import type { Metadata } from 'next';
import { LegalPageShell, type LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = { title: 'Disclaimer', description: 'Review important Alpha Legal Intake disclaimers regarding legal intake services, lead generation, and call center support.' };

const sections: LegalSection[] = [
  { title: 'Informational Website', paragraphs: ['Alpha Legal Intake provides informational content and intake request tools related to Motor Vehicle Accident leads, personal injury leads, live transfer calls, and legal call center support.', 'Nothing on this website should be interpreted as legal, tax, financial, or professional advice. Users should consult qualified professionals for advice regarding specific circumstances.'] },
  { title: 'Not a Law Firm', paragraphs: ['Alpha Legal Intake is privately owned and operated. We are not a law firm, do not provide legal advice, do not represent callers, and do not make attorney-client relationship decisions.', 'Submitting information through this website does not create an attorney-client relationship with Alpha Legal Intake or any participating law firm.'] },
  { title: 'Lead and Transfer Availability', paragraphs: ['Alpha Legal Intake does not guarantee lead volume, live transfer availability, case acceptance, signed retainers, settlement value, or legal outcomes.', 'Campaign results may vary based on geography, qualification criteria, marketing channels, caller availability, and firm response procedures.'] },
  { title: 'Communication Consent', paragraphs: ['By submitting your information, you may be contacted by Alpha Legal Intake and participating legal marketing or attorney partners regarding accident intake, personal injury lead qualification, live transfer coordination, and related legal services.', 'Your consent to be contacted is not a condition of purchase. Message and data rates may apply.'] },
  { title: 'Third-Party Relationships', paragraphs: ['This website may reference or link to third-party services, vendors, or participating legal teams. Alpha Legal Intake does not control and is not responsible for third-party content, terms, privacy practices, availability, or decisions.', 'Participating firms remain responsible for their own legal evaluations, client communications, and professional obligations.'] },
];

export default function DisclaimerPage() {
  return <LegalPageShell eyebrow="Important Notices" title="Disclaimer" intro="These notices clarify the role of Alpha Legal Intake, the limits of the information provided on this website, and the communication context associated with legal intake requests." effectiveDate="May 13, 2026" documentLabel="Website Disclaimer" sections={sections} />;
}
