import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, requireUserId } from "@/lib/supabase/server";
import { getHouseholdWithMembers } from "@/modules/households";

export default async function HouseholdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  await requireUserId(supabase);

  const result = await getHouseholdWithMembers(supabase, id);
  if (!result) notFound();

  const { household, members } = result;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/households" className="text-sm text-zinc-500 underline">
        ← Your households
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {household.name}
      </h1>

      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Members
        </h2>
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <li
              key={m.user_id}
              className="flex items-center justify-between rounded border border-zinc-200 px-4 py-2 dark:border-zinc-800"
            >
              <span className="text-zinc-900 dark:text-zinc-50">
                {m.display_name ?? "(no name set)"}
              </span>
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-zinc-500">
        Inviting other members isn&apos;t built yet - next up.
      </p>
    </div>
  );
}
