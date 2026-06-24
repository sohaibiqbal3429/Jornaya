import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ObjectId, WithId } from 'mongodb';
import { getMongoClient } from './dbConnect';

export type SubmissionStatus = 'new' | 'seen' | 'archived';
export type VerificationStatus = 'pending' | 'verified' | 'failed';

export type Submission = {
  id: string;
  formType: string;
  fullName: string;
  email: string;
  phone?: string;
  zipCode?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
  consent_checked: boolean;
  consent_timestamp: string;
  consent_text_version: string;
  leadiD_token?: string;
  original_leadiD_token?: string;
  universal_leadid?: string;
  page_url: string;
  page_source: string;
  lead_id?: string;
  journey_identifier?: string;
  ip?: string;
  userAgent?: string;
  leadid_debug?: Record<string, unknown> | null;
  isVarified: boolean;
  verification_status?: VerificationStatus;
  verification_requestedAt?: string;
  verification_completedAt?: string;
  verification_leadiD_token?: string;
  verification_error?: string;
  verification_metadata?: Record<string, unknown> | null;
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

type SubmissionPatch = Partial<Omit<Submission, 'id' | 'createdAt'>>;

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
const TMP_STORE_PATH = path.join(os.tmpdir(), 'alpha-legal-intake', 'submissions.json');

let localWriteQueue = Promise.resolve();
let memoryStore: LocalSubmissionDocument[] = [];

function getLocalStorePath() {
  return process.env.VERCEL ? TMP_STORE_PATH : LOCAL_STORE_PATH;
}

function shouldUseMemoryStore(error: unknown) {
  const nodeError = error as NodeJS.ErrnoException;
  return nodeError.code === 'EACCES' || nodeError.code === 'EPERM' || nodeError.code === 'EROFS';
}

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
    zipCode: doc.zipCode,
    leadiD_token: doc.leadiD_token,
    original_leadiD_token: doc.original_leadiD_token,
    universal_leadid: doc.universal_leadid,
    page_url: doc.page_url,
    page_source: doc.page_source,
    lead_id: doc.lead_id,
    journey_identifier: doc.journey_identifier,
    ip: doc.ip,
    userAgent: doc.userAgent,
    leadid_debug: doc.leadid_debug,
    isVarified: doc.isVarified,
    verification_status: doc.verification_status,
    verification_requestedAt: doc.verification_requestedAt,
    verification_completedAt: doc.verification_completedAt,
    verification_leadiD_token: doc.verification_leadiD_token,
    verification_error: doc.verification_error,
    verification_metadata: doc.verification_metadata,
    createdAt: doc.createdAt.toISOString(),
    status: doc.status,
  };
}

async function getMongoCollection() {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || 'alpha-legal-intake');
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
    const fileContents = await readFile(getLocalStorePath(), 'utf8');
    const parsed = JSON.parse(fileContents);
    if (!Array.isArray(parsed)) return [];
    return parsed as LocalSubmissionDocument[];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return memoryStore;
    }
    if (shouldUseMemoryStore(error)) {
      return memoryStore;
    }
    throw error;
  }
}

async function writeLocalDocs(docs: LocalSubmissionDocument[]) {
  const storePath = getLocalStorePath();
  memoryStore = docs;

  try {
    await mkdir(path.dirname(storePath), { recursive: true });
    await writeFile(storePath, `${JSON.stringify(docs, null, 2)}\n`, 'utf8');
  } catch (error) {
    if (shouldUseMemoryStore(error)) {
      return;
    }
    throw error;
  }
}

function normalizeLocalDoc(doc: LocalSubmissionDocument): Submission {
  return {
    ...doc,
    isVarified: doc.isVarified ?? false,
    leadid_debug: doc.leadid_debug ?? null,
    verification_metadata: doc.verification_metadata ?? null,
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
      isVarified: input.isVarified ?? false,
      leadid_debug: input.leadid_debug ?? null,
      verification_metadata: input.verification_metadata ?? null,
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
  return updateSubmissionFieldsLocal(id, { status });
}

async function updateSubmissionFieldsLocal(id: string, patch: SubmissionPatch) {
  return runWithLocalWriteLock(async () => {
    const docs = await readLocalDocs();
    const index = docs.findIndex((doc) => doc.id === id);
    if (index === -1) {
      return null;
    }

    const updated: Submission = {
      ...normalizeLocalDoc(docs[index]),
      ...patch,
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
      isVarified: input.isVarified ?? false,
      leadid_debug: input.leadid_debug ?? null,
      verification_metadata: input.verification_metadata ?? null,
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
  return updateSubmissionFields(id, { status });
}

export async function updateSubmissionFields(id: string, patch: SubmissionPatch) {
  if (ObjectId.isValid(id)) {
    try {
      const collection = await getMongoCollection();
      const _id = new ObjectId(id);
      const result = await collection.findOneAndUpdate(
        { _id },
        { $set: patch },
        { returnDocument: 'after' },
      );

      if (result) {
        return toSubmission(result);
      }
    } catch {
      return updateSubmissionFieldsLocal(id, patch);
    }
  }

  return updateSubmissionFieldsLocal(id, patch);
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
