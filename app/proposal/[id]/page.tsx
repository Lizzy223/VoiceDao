import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProposalDetailClient from "./proposal-detail-client";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (!proposal) notFound();

  return <ProposalDetailClient proposal={proposal} />;
}
