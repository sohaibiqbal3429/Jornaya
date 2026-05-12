import type { Metadata } from 'next';
import { LegalPageShell, type LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Review the terms governing use of the Apha Health Plan website and Medicare consultation request experience.',
};

const sections: LegalSection[] = [
  {
    title: 'Acceptance of Terms',
    paragraphs: [
      'These Terms & Conditions govern your access to and use of the Apha Health Plan website, including consultation request forms, informational content, and related digital services.',
      'By using this website, you agree to these terms and to our Privacy Policy. If you do not agree, do not use the website or submit information through it.',
    ],
  },
  {
    title: 'Nature of the Website',
    paragraphs: [
      'Apha Health Plan is a privately operated website that provides Medicare-related educational content, consultation request tools, and pathways for communication with licensed insurance professionals.',
      'Apha Health Plan is not a government agency, is not affiliated with or endorsed by Medicare or CMS, and is not itself an insurer, carrier, or health plan issuer.',
    ],
  },
  {
    title: 'No Guarantee of Plan Availability or Enrollment',
    paragraphs: [
      'Submitting a request through this website does not guarantee eligibility, plan availability, enrollment, coverage approval, or acceptance by any insurance company.',
      'Plan options vary by ZIP code, service area, carrier participation, contract status, and individual eligibility. Enrollment is subject to applicable Medicare rules and enrollment periods, including Initial Enrollment Periods, Annual Enrollment Periods, and Special Enrollment Periods where available.',
    ],
  },
  {
    title: 'Communications and Consent',
    paragraphs: [
      'If you provide contact information, Apha Health Plan or a licensed insurance agent, insurance agency, or insurance company may contact you by phone, text message, or email regarding Medicare Advantage, Medicare Supplement Insurance, Prescription Drug Plan options, or related consultation services.',
      'The purpose of these communications may include the solicitation of insurance. Your consent to receive communications is not a condition of purchase, and you may revoke consent as permitted by law.',
    ],
  },
  {
    title: 'Informational Use Only',
    paragraphs: [
      'Content on this website is provided for general informational purposes only. It is not legal advice, tax advice, medical advice, financial advice, or a substitute for reviewing official Medicare and carrier materials.',
      'While Apha Health Plan strives to keep information current and accurate, we do not warrant that website content is complete, error-free, or suitable for every situation.',
    ],
  },
  {
    title: 'User Responsibilities',
    paragraphs: [
      'You agree to provide accurate information when submitting forms and to use the website only for lawful purposes. You may not use the website to transmit harmful code, impersonate another person, interfere with website operations, or attempt unauthorized access to systems or data.',
      'If Apha Health Plan reasonably believes a submission is fraudulent, abusive, or unlawful, we may decline to process it and may take protective or legal action where appropriate.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraphs: [
      'All website content, branding, design elements, text, graphics, software, and other materials made available by Apha Health Plan are protected by applicable intellectual property laws and remain the property of Apha Health Plan or its licensors.',
      'You may view and use the website for personal, non-commercial purposes only unless Apha Health Plan provides prior written permission for another use.',
    ],
  },
  {
    title: 'Third-Party Services and Links',
    paragraphs: [
      'This website may reference or link to third-party services, websites, or carriers. Apha Health Plan does not control and is not responsible for the content, terms, privacy practices, availability, or accuracy of third-party resources.',
      'Your interactions with third parties are governed by the applicable third-party terms and policies.',
    ],
  },
  {
    title: 'Disclaimer of Warranties and Limitation of Liability',
    paragraphs: [
      'The website is provided on an "as is" and "as available" basis to the fullest extent permitted by law. Apha Health Plan disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      'To the fullest extent permitted by law, Apha Health Plan will not be liable for indirect, incidental, consequential, special, punitive, or exemplary damages, or for any loss arising from your use of or inability to use the website, reliance on content, or interactions with third-party service providers or insurance entities.',
    ],
  },
  {
    title: 'Updates to These Terms',
    paragraphs: [
      'Apha Health Plan may revise these Terms & Conditions from time to time. Updated terms become effective when posted on this page unless a later effective date is stated.',
      'Continued use of the website after updated terms are posted constitutes acceptance of the revised terms.',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      eyebrow="Website Terms"
      title="Terms & Conditions"
      intro="These terms define how the Apha Health Plan website may be used and set the framework for the Medicare consultation requests, educational content, and communication workflows offered through this platform."
      effectiveDate="May 13, 2026"
      documentLabel="Website Terms & Conditions"
      sections={sections}
    />
  );
}
