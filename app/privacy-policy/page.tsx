import type { Metadata } from 'next';
import { LegalPageShell, type LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how Apha Health Plan collects, uses, shares, and protects information submitted through our Medicare consultation website.',
};

const sections: LegalSection[] = [
  {
    title: 'Scope and Purpose',
    paragraphs: [
      'This Privacy Policy describes how Apha Health Plan collects, uses, discloses, and safeguards information when you visit our website, request a consultation, communicate with our team, or interact with services made available through this platform.',
      'Apha Health Plan operates as a private Medicare and insurance consultation website. We are not the federal Medicare program, a government agency, or a health plan issuer. This policy applies to information collected online through our website and related digital experiences.',
      'By using this website or submitting information to Apha Health Plan, you acknowledge the practices described in this Privacy Policy as of the effective date listed on this page.',
    ],
  },
  {
    title: 'Information We Collect',
    paragraphs: [
      'We collect information you voluntarily provide when you complete a consultation request, contact form, call request, or similar intake experience. This may include your name, telephone number, email address, ZIP code, and other details you choose to provide about your Medicare or insurance needs.',
      'We may also collect operational data associated with a submission, including consent records, timestamps, lead-identification tokens, page URLs, and communication preferences, so we can document your request and maintain compliance records.',
    ],
    bullets: [
      'Device and usage information such as browser type, IP address, referring page, pages visited, session timing, and general analytics data.',
      'Cookies, pixels, and similar technologies used to understand site performance, improve usability, and measure campaign effectiveness.',
      'Communications you send to Apha Health Plan by email, phone, or web form, including follow-up questions and support requests.',
    ],
  },
  {
    title: 'How We Use Information',
    paragraphs: [
      'Apha Health Plan uses collected information to respond to consultation requests, coordinate contact with licensed insurance professionals, provide information about Medicare-related coverage options, operate the website, improve our user experience, and maintain internal records.',
      'We may use your information to personalize outreach, verify your request, document consent, prevent fraud, troubleshoot technical issues, comply with legal obligations, and communicate important service or policy updates.',
      'Where permitted by law and based on your preferences, we may also use your information to send relevant educational or marketing communications related to Medicare Advantage, Medicare Supplement Insurance, or Prescription Drug Plan options.',
    ],
  },
  {
    title: 'How Information May Be Shared',
    paragraphs: [
      'We do not sell your personal information for cash consideration. We may disclose information to licensed insurance agents, insurance agencies, carriers, call center partners, CRM and hosting providers, analytics vendors, and other service providers that support the consultation workflow or website operations.',
      'Information may also be disclosed when reasonably necessary to protect the rights, safety, or property of Apha Health Plan, our users, or others; to investigate suspected fraud or abuse; to enforce our terms; or to comply with subpoenas, court orders, legal process, or other lawful requests.',
      'If Apha Health Plan is involved in a merger, acquisition, financing, or sale of assets, information may be transferred as part of that transaction subject to appropriate confidentiality and legal safeguards.',
    ],
  },
  {
    title: 'Consent, TCPA, and Medicare Communications',
    paragraphs: [
      'When you submit a consultation request, you may authorize Apha Health Plan, a licensed insurance agent, insurance agency, or insurance company to contact you by phone, text message, or email regarding Medicare-related plan options. These communications may include the solicitation of insurance.',
      'Your consent to receive communications is not a condition of purchase. Message and data rates may apply to text communications. You may opt out of marketing communications using the instructions provided in the communication or by contacting us directly.',
      'Apha Health Plan does not represent that every plan available in your service area will be shown. For complete Medicare information, consumers should visit Medicare.gov, call 1-800-MEDICARE, or contact their local State Health Insurance Assistance Program.',
    ],
  },
  {
    title: 'Cookies and Analytics',
    paragraphs: [
      'We and our service providers may use cookies, local storage, tags, and similar technologies to maintain site functionality, remember preferences, attribute marketing activity, and understand how users interact with the website.',
      'Most browsers allow you to block or delete cookies. Disabling certain technologies may affect the availability or functionality of some features on the site.',
    ],
  },
  {
    title: 'Data Security and Retention',
    paragraphs: [
      'Apha Health Plan uses administrative, technical, and physical safeguards designed to protect information against unauthorized access, disclosure, alteration, or destruction. These measures may include secure transport protocols, access controls, authentication requirements, and restricted internal access.',
      'No internet transmission or storage system can be guaranteed to be completely secure. We retain information for as long as reasonably necessary to provide services, document compliance, resolve disputes, enforce agreements, and satisfy legal, operational, or recordkeeping obligations.',
    ],
  },
  {
    title: 'Your Choices and Privacy Rights',
    paragraphs: [
      'You may choose not to provide information through our forms, but some services or response workflows may not be available without the requested details. You may also request updates to your contact information, ask to opt out of marketing communications, or inquire about deletion or access rights where applicable law provides them.',
      'Residents of certain states may have additional rights regarding access, deletion, correction, or opt-out requests. We will review and respond to eligible requests in accordance with applicable law and may need to verify your identity before fulfilling a request.',
    ],
  },
  {
    title: 'Children and Sensitive Situations',
    paragraphs: [
      'This website is intended for adults seeking Medicare or insurance guidance. It is not directed to children under 13, and Apha Health Plan does not knowingly collect personal information from children through this website.',
      'This website is not intended for emergency medical needs. If you are experiencing a medical emergency, call 911 or contact the appropriate emergency services provider immediately.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy and Data Use"
      title="Privacy Policy"
      intro="Apha Health Plan is committed to handling personal information with clarity, restraint, and a healthcare-grade standard of trust. This policy explains how information moves through our Medicare consultation experience."
      effectiveDate="May 13, 2026"
      documentLabel="Website Privacy Policy"
      sections={sections}
    />
  );
}
