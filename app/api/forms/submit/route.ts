import { after, NextRequest, NextResponse } from 'next/server';
import { resolveLeadIdToken } from '@/lib/leadid';
import { runLeadIdVerification } from '@/lib/leadid-verification';
import { createSubmission, updateSubmissionFields } from '@/lib/submissions-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const normalizedLeadIdToken = resolveLeadIdToken(body ?? {});
    if (!body?.fullName || !body?.phone || !body?.message || typeof body?.consent_checked !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!normalizedLeadIdToken) {
      return NextResponse.json({ error: 'A valid Jornaya LeadiD token is required.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const userAgent = req.headers.get('user-agent') || undefined;
    const verificationParentSubmissionId =
      typeof body?.verification_parent_submission_id === 'string'
        ? body.verification_parent_submission_id.trim()
        : '';

    if (verificationParentSubmissionId) {
      const verified = await updateSubmissionFields(verificationParentSubmissionId, {
        verification_leadiD_token: normalizedLeadIdToken,
        verification_status: 'verified',
        verification_completedAt: new Date().toISOString(),
        verification_error: '',
        verification_metadata: {
          page_url: body.page_url || req.nextUrl.toString(),
          page_source: body.page_source || 'Alpha Legal Intake landing form verification replay',
          ip,
          userAgent,
          leadid_debug: body.leadid_debug ?? null,
          consent_checked: body.consent_checked,
          consent_timestamp: body.consent_timestamp || new Date().toISOString(),
          consent_text_version: body.consent_text_version || 'alpha-legal-v1.0',
        },
        isVarified: true,
      });

      if (!verified) {
        return NextResponse.json({ error: 'Verification submission target not found.' }, { status: 404 });
      }

      return NextResponse.json({ ok: true, verification: true, submission: verified });
    }

    const created = await createSubmission({
      formType: body.formType || 'legal_intake_contact',
      fullName: body.fullName,
      email: body.email || '',
      phone: body.phone,
      zipCode: body.zipCode || '',
      company: body.company,
      serviceInterest: body.serviceInterest || 'Alpha Legal Intake consultation',
      message: body.message,
      consent_checked: body.consent_checked,
      consent_timestamp: body.consent_timestamp || new Date().toISOString(),
      consent_text_version: body.consent_text_version || 'alpha-legal-v1.0',
      leadiD_token: normalizedLeadIdToken,
      original_leadiD_token: normalizedLeadIdToken,
      universal_leadid:
        (typeof body.universal_leadid === 'string' && body.universal_leadid.trim()) || normalizedLeadIdToken,
      page_url: body.page_url || req.nextUrl.toString(),
      page_source: body.page_source || 'Alpha Legal Intake landing form',
      lead_id: body.lead_id,
      journey_identifier: body.journey_identifier,
      ip,
      userAgent,
      leadid_debug: body.leadid_debug ?? null,
      isVarified: false,
      verification_status: 'pending',
      verification_requestedAt: new Date().toISOString(),
      verification_metadata: null,
    });

    after(async () => {
      await runLeadIdVerification({
        origin: req.nextUrl.origin,
        submission: created,
      });
    });

    return NextResponse.json({ ok: true, submission: created });
  } catch (error) {
    console.error('Form submission failed.', error);
    return NextResponse.json(
      { error: 'Submission service unavailable. Check MongoDB connection and environment variables.' },
      { status: 503 },
    );
  }
}
