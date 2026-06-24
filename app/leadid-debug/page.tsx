import { LeadIdDebugClient } from '@/components/leadid/LeadIdDebugClient';
import { LeadIdProvider } from '@/components/leadid/LeadIdProvider';

export default function LeadIdDebugPage() {
  return (
    <LeadIdProvider>
      <LeadIdDebugClient />
    </LeadIdProvider>
  );
}
