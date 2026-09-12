"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/server";
import { createHousehold } from "@/modules/households";
import { redirect } from "next/navigation";
import { z } from "zod";

const createHouseholdSchema = z.object({
  name: z.string().trim().min(1, "Household name is required").max(100),
});

export async function createHouseholdAction(formData: FormData) {
  const supabase = await createClient();
  await requireUserId(supabase);

  const parsed = createHouseholdSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    redirect(`/households?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const householdId = await createHousehold(supabase, parsed.data.name);
  redirect(`/households/${householdId}`);
}
