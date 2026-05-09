import { supabase } from "./supabase";

export interface Proposal {
    id?: string;
    proposer: string;
    title: string;
    summary: string;
    category: string;
    transcript?: string;
    audio_url?: string;
    solana_tx?: string;
    votes_for?: number;
    votes_against?: number;
    deadline: string;
    created_at?: string;
}

// Save a new proposal
export const saveProposal = async (proposal: Proposal) => {
    const { data, error } = await supabase
        .from("proposals")
        .insert([proposal])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Fetch all proposals
export const fetchProposals = async () => {
    const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

// Save a vote
export const saveVote = async (
    proposalId: string,
    voter: string,
    support: boolean,
    reasoning: string
) => {
    // Save vote record
    const { error: voteError } = await supabase
        .from("votes")
        .insert([{ proposal_id: proposalId, voter, support, reasoning }]);

    if (voteError) throw voteError;

    // Update vote count on proposal
    const column = support ? "votes_for" : "votes_against";
    const { data: current } = await supabase
        .from("proposals")
        .select(column)
        .eq("id", proposalId)
        .single();

    await supabase
        .from("proposals")
        .update({ [column]: (current?.[column] || 0) + 1 })
        .eq("id", proposalId);
};