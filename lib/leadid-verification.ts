import { LEADID_TOKEN_PATTERN } from './leadid';
import { type Submission, updateSubmissionFields } from './submissions-store';

type VerificationOptions = {
  origin: string;
  submission: Submission;
};

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: 'Lead', lastName: 'Verification' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ') || 'Verification',
  };
}

function buildVerificationUrl(origin: string, pageUrl: string, submissionId: string) {
  const nextUrl = new URL(pageUrl || origin, origin);
  nextUrl.searchParams.set('leadid_verify', '1');
  nextUrl.searchParams.set('verification_parent_submission_id', submissionId);
  return nextUrl.toString();
}

export async function runLeadIdVerification({ origin, submission }: VerificationOptions) {
  try {
    await updateSubmissionFields(submission.id, {
      verification_status: 'pending',
      verification_requestedAt: new Date().toISOString(),
      verification_error: '',
      verification_metadata: {
        ...(submission.verification_metadata ?? {}),
        workerStartedAt: new Date().toISOString(),
      },
    });

    const playwright = await import('playwright');
    const browser = await playwright.chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();
      const verificationUrl = buildVerificationUrl(origin, submission.page_url, submission.id);
      const { firstName, lastName } = splitFullName(submission.fullName);

      await page.goto(verificationUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      await page.waitForFunction(
        (patternSource) => {
          const field = document.querySelector<HTMLInputElement>(
            'input#leadid_token[name="universal_leadid"]',
          );
          const value = field?.value?.trim() || '';
          return new RegExp(patternSource, 'i').test(value);
        },
        LEADID_TOKEN_PATTERN.source,
        { timeout: 15_000 },
      );

      const verificationToken = await page.evaluate(() => {
        const canonicalField = document.querySelector<HTMLInputElement>(
          'input#leadid_token[name="universal_leadid"]',
        );
        const mirroredField = document.querySelector<HTMLInputElement>(
          'input#leadid_token_form[name="universal_leadid"]',
        );
        return canonicalField?.value.trim() || mirroredField?.value.trim() || '';
      });

      await page.locator('#firstName').fill(firstName);
      await page.locator('#lastName').fill(lastName);
      await page.locator('#phone').fill(submission.phone || '0000000000');
      await page.locator('#zipCode').fill(submission.zipCode || '00000');
      if (submission.email) {
        await page.locator('#email').fill(submission.email);
      }
      await page.locator('#consent').check();

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/forms/submit') &&
          response.request().method() === 'POST',
        { timeout: 20_000 },
      );

      await page.locator('button[type="submit"]').click();
      const response = await responsePromise;

      if (!response.ok()) {
        const responseText = await response.text().catch(() => '');
        throw new Error(`Verification submit failed with ${response.status()}: ${responseText}`);
      }

      const responseBody = await response.json().catch(() => null);

      await updateSubmissionFields(submission.id, {
        verification_metadata: {
          ...(submission.verification_metadata ?? {}),
          workerCompletedAt: new Date().toISOString(),
          verificationUrl,
          verificationTokenObserved: verificationToken,
          verificationResponse: responseBody,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown verification error.';
    console.error('LeadID verification worker failed.', error);

    await updateSubmissionFields(submission.id, {
      verification_status: 'failed',
      verification_error: message,
      verification_completedAt: new Date().toISOString(),
      verification_metadata: {
        ...(submission.verification_metadata ?? {}),
        workerFailedAt: new Date().toISOString(),
        error: message,
      },
    });
  }
}
