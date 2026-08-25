import { PartyDetailClient } from "@/features/parties/party-detail-client";

export default async function PartyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PartyDetailClient partyId={(await params).id} />;
}

