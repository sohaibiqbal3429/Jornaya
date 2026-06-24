import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ObjectId, WithId } from 'mongodb';
import { getMongoClient } from './dbConnect';

export type SubmissionStatus = 'new' | 'seen' | 'archived';

export type Submission = {
  id: string;
  formType: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
  consent_checked: boolean;
  consent_timestamp: string;
  consent_text_version: string;
  leadiD_token?: string;
  page_url: string;
  page_source: string;
  lead_id?: string;
  journey_identifier?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  status: SubmissionStatus;
};

type SubmissionStored = Omit<Submission, 'id' | 'createdAt'> & {
  createdAt: Date;
};

type SubmissionDocument = WithId<SubmissionStored>;

type LocalSubmissionDocument = Omit<Submission, 'status'> & {
  status?: SubmissionStatus;
};

type CreateSubmissionInput = Omit<Submission, 'id' | 'createdAt' | 'status'> & {
  leadiD_token: string;
};

type ListSubmissionsParams = {
  query?: string;
  formType?: string;
  status?: string;
  consentChecked?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

const LOCAL_STORE_PATH = path.join(process.cwd(), '.data', 'submissions.json');

let localWriteQueue = Promise.resolve();

function toSubmission(doc: SubmissionDocument): Submission {
  return {
    id: doc._id.toString(),
    formType: doc.formType,
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    serviceInterest: doc.serviceInterest,
    message: doc.message,
    consent_checked: doc.consent_checked,
    consent_timestamp: doc.consent_timestamp,
    consent_text_version: doc.consent_text_version,
    leadiD_token: doc.leadiD_token,
    page_url: doc.page_url,
    page_source: doc.page_source,
    lead_id: doc.lead_id,
    journey_identifier: doc.journey_identifier,
    ip: doc.ip,
    userAgent: doc.userAgent,
    createdAt: doc.createdAt.toISOString(),
    status: doc.status,
  };
}

async function getMongoCollection() {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || 'apha-health-plan');
  return db.collection<SubmissionStored>('submissions');
}

async function runWithLocalWriteLock<T>(operation: () => Promise<T>) {
  const next = localWriteQueue.then(operation, operation);
  localWriteQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function readLocalDocs() {
  try {
    const fileContents = await readFile(LOCAL_STORE_PATH, 'utf8');
    const parsed = JSON.parse(fileContents);
    if (!Array.isArray(parsed)) return [];
    return parsed as LocalSubmissionDocument[];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeLocalDocs(docs: LocalSubmissionDocument[]) {
  await mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  await writeFile(LOCAL_STORE_PATH, `${JSON.stringify(docs, null, 2)}\n`, 'utf8');
}

function normalizeLocalDoc(doc: LocalSubmissionDocument): Submission {
  return {
    ...doc,
    status: doc.status ?? 'new',
  };
}

function escapeRegex(source: string) {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesSubmissionFilters(submission: Submission, params: ListSubmissionsParams) {
  if (params.query) {
    const matcher = new RegExp(escapeRegex(params.query), 'i');
    const haystack = [submission.fullName, submission.email, submission.company, submission.phone]
      .filter(Boolean)
      .join('\n');

    if (!matcher.test(haystack)) {
      return false;
    }
  }

  if (params.formType && params.formType !== 'all' && submission.formType !== params.formType) {
    return false;
  }

  if (params.status && params.status !== 'all' && submission.status !== params.status) {
    return false;
  }

  if (params.consentChecked === 'true' && !submission.consent_checked) {
    return false;
  }

  if (params.consentChecked === 'false' && submission.consent_checked) {
    return false;
  }

  const createdAt = new Date(submission.createdAt).getTime();
  if (Number.isNaN(createdAt)) {
    return false;
  }

  if (params.from) {
    const from = new Date(`${params.from}T00:00:00.000Z`).getTime();
    if (createdAt < from) {
      return false;
    }
  }

  if (params.to) {
    const to = new Date(`${params.to}T23:59:59.999Z`).getTime();
    if (createdAt > to) {
      return false;
    }
  }

  return true;
}

async function createSubmissionLocal(input: CreateSubmissionInput) {
  return runWithLocalWriteLock(async () => {
    const docs = await readLocalDocs();
    const submission: Submission = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    docs.unshift(submission);
    await writeLocalDocs(docs);
    return submission;
  });
}

async function listSubmissionsLocal(params: ListSubmissionsParams) {
  const docs = (await readLocalDocs())
    .map(normalizeLocalDoc)
    .filter((doc) => matchesSubmissionFilters(doc, params))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, Math.min(100, params.limit ?? 20));
  const skip = (page - 1) * limit;

  return {
    data: docs.slice(skip, skip + limit),
    total: docs.length,
    page,
    limit,
  };
}

async function updateSubmissionStatusLocal(id: string, status: SubmissionStatus) {
  return runWithLocalWriteLock(async () => {
    const docs = await readLocalDocs();
    const index = docs.findIndex((doc) => doc.id === id);
    if (index === -1) {
      return null;
    }

    const updated: Submission = {
      ...normalizeLocalDoc(docs[index]),
      status,
    };

    docs[index] = updated;
    await writeLocalDocs(docs);
    return updated;
  });
}

async function deleteSubmissionLocal(id: string) {
  return runWithLocalWriteLock(async () => {
    const docs = await readLocalDocs();
    const nextDocs = docs.filter((doc) => doc.id !== id);
    if (nextDocs.length === docs.length) {
      return false;
    }

    await writeLocalDocs(nextDocs);
    return true;
  });
}

export async function createSubmission(input: CreateSubmissionInput) {
  try {
    const collection = await getMongoCollection();
    const doc: SubmissionStored = {
      ...input,
      createdAt: new Date(),
      status: 'new',
    };

    const result = await collection.insertOne(doc);
    return toSubmission({ _id: result.insertedId, ...doc });
  } catch {
    return createSubmissionLocal(input);
  }
}

export async function listSubmissions(params: ListSubmissionsParams) {
  try {
    const collection = await getMongoCollection();
    const filter: Record<string, unknown> = {};

    if (params.query) {
      const queryRegex = new RegExp(escapeRegex(params.query), 'i');
      filter.$or = [
        { fullName: queryRegex },
        { email: queryRegex },
        { company: queryRegex },
        { phone: queryRegex },
      ];
    }

    if (params.formType && params.formType !== 'all') filter.formType = params.formType;
    if (params.status && params.status !== 'all') filter.status = params.status;
    if (params.consentChecked === 'true') filter.consent_checked = true;
    if (params.consentChecked === 'false') filter.consent_checked = false;

    if (params.from || params.to) {
      const createdAt: Record<string, Date> = {};
      if (params.from) createdAt.$gte = new Date(`${params.from}T00:00:00.000Z`);
      if (params.to) createdAt.$lte = new Date(`${params.to}T23:59:59.999Z`);
      filter.createdAt = createdAt;
    }

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, Math.min(100, params.limit ?? 20));
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      data: docs.map((doc) => toSubmission(doc)),
      total,
      page,
      limit,
    };
  } catch {
    return listSubmissionsLocal(params);
  }
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  if (ObjectId.isValid(id)) {
    try {
      const collection = await getMongoCollection();
      const _id = new ObjectId(id);
      const result = await collection.findOneAndUpdate(
        { _id },
        { $set: { status } },
        { returnDocument: 'after' },
      );

      if (result) {
        return toSubmission(result);
      }
    } catch {
      return updateSubmissionStatusLocal(id, status);
    }
  }

  return updateSubmissionStatusLocal(id, status);
}

export async function deleteSubmission(id: string) {
  if (ObjectId.isValid(id)) {
    try {
      const collection = await getMongoCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        return true;
      }
    } catch {
      return deleteSubmissionLocal(id);
    }
  }

  return deleteSubmissionLocal(id);
}
