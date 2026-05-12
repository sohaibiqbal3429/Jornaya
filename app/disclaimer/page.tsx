import type { Metadata } from 'next';
import { LegalPageShell, type LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Review important Apha Health Plan disclaimers regarding Medicare information, plan availability, and insurance solicitation.',
};

const sections: LegalSection[] = [
  {
    title: 'General Website Disclaimer',
    paragraphs: [
      'Apha Health Plan provides informational content and consultation request tools intended to help consumers prepare for Medicare-related coverage conversations. The website is not a substitute for reviewing official Medicare materials or carrier-specific plan documents.',
      'Nothing on this website should be interpreted as legal, tax, medical, or financial advice. Users should consult their own advisors or healthcare professionals when those forms of guidance are needed.',
    ],
  },
  {
    title: 'No Government Affiliation',
    paragraphs: [
      'Apha Health Plan is a privately owned and operated website. We are not affiliated with, endorsed by, or acting on behalf of Medicare, the Centers for Medicare & Medicaid Services (CMS), Healthcare.gov, the Department of Health and Human Services, or any federal or state government agency.',
      'For official Medicare information, visit Medicare.gov or call 1-800-MEDICARE.',
    ],
  },
  {
    title: 'No Representation of All Available Plans',
    paragraphs: [
      'Apha Health Plan does not offer every plan available in your area. Any plan options discussed through a licensed insurance professional may be limited by ZIP code, service area, contract status, carrier participation, eligibility requirements, and enrollment timing.',
      'The availability of a consultation does not guarantee that a particular plan, carrier, or benefit structure will be available to you.',
    ],
  },
  {
    title: 'Insurance Solicitation Disclosure',
    paragraphs: [
      'By submitting your information, you may be contacted by Apha Health Plan, a licensed insurance agent, insurance agency, or insurance company regarding Medicare Advantage, Medicare Supplement Insurance, or Prescription Drug Plan options.',
      'The purpose of these communications is the solicitation of insurance. Your consent to be contacted is not a condition of purchase.',
    ],
  },
  {
    title: 'No Guarantee of Enrollment or Savings',
    paragraphs: [
      'Apha Health Plan does not guarantee enrollment, acceptance, eligibility, savings, plan suitability, network participation, or prescription coverage outcomes.',
      'Any examples, comparisons, or educational content on the website are illustrative and should not be treated as guarantees or promises of future results.',
    ],
  },
  {
    title: 'Emergency and Clinical Situations',
    paragraphs: [
      'Apha Health Plan does not provide emergency assistance, medical triage, or clinical decision support. If you are experiencing a medical emergency, call 911 immediately or contact your nearest emergency services provider.',
      'Website content should not be used to delay care, discontinue treatment, or make urgent clinical decisions.',
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      eyebrow="Important Notices"
      title="Disclaimer"
      intro="These notices clarify the role of Apha Health Plan, the limits of the information provided on this website, and the insurance-solicitation context associated with consultation requests."
      effectiveDate="May 13, 2026"
      documentLabel="Website Disclaimer"
      sections={sections}
    />
  );
}
