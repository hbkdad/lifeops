import type { SupabaseClient } from "@supabase/supabase-js";

export type Household = {
  id: string;
  name: string;
  created_at: string;
  role: "owner" | "admin" | "member" | "viewer";
};

export type HouseholdMember = {
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  display_name: string | null;
};

/** Households the current user belongs to, with their role in each. */
export async function listMyHouseholds(
  supabase: SupabaseClient,
): Promise<Household[]> {
  const { data, error } = await supabase
    .from("household_members")
    .select("role, households(id, name, created_at)")
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const household = row.households as unknown as {
      id: string;
      name: string;
      created_at: string;
    };
    return {
      id: household.id,
      name: household.name,
      created_at: household.created_at,
      role: row.role as Household["role"],
    };
  });
}

/** Creates a household and makes the current user its owner (create_household RPC). */
export async function createHousehold(
  supabase: SupabaseClient,
  name: string,
): Promise<string> {
  const { data, error } = await supabase.rpc("create_household", {
    household_name: name,
  });

  if (error) throw error;
  return data as string;
}

/** A single household plus its member roster - RLS ensures only members can read this. */
export async function getHouseholdWithMembers(
  supabase: SupabaseClient,
  householdId: string,
): Promise<{
  household: { id: string; name: string; created_at: string };
  members: HouseholdMember[];
} | null> {
  const { data: household, error: householdError } = await supabase
    .from("households")
    .select("id, name, created_at")
    .eq("id", householdId)
    .maybeSingle();

  if (householdError) throw householdError;
  if (!household) return null;

  const { data: members, error: membersError } = await supabase
    .from("household_members")
    .select("user_id, role, profiles!household_members_user_id_fkey(display_name)")
    .eq("household_id", householdId);

  if (membersError) throw membersError;

  return {
    household,
    members: (members ?? []).map((m) => ({
      user_id: m.user_id,
      role: m.role as HouseholdMember["role"],
      display_name:
        (m.profiles as unknown as { display_name: string | null } | null)
          ?.display_name ?? null,
    })),
  };
}
