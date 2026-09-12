import Link from "next/link";
import { createClient, requireUserId } from "@/lib/supabase/server";
import { listMyHouseholds } from "@/modules/households";
import { createHouseholdAction } from "./actions";
import { logout } from "@/app/logout/actions";

export default async function HouseholdsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  await requireUserId(supabase);
  const households = await listMyHouseholds(supabase);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your households
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400"
          >
            Log out
          </button>
        </form>
      </div>

      {households.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          You don&apos;t belong to any households yet. Create one below to
          get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {households.map((h) => (
            <li key={h.id}>
              <Link
                href={`/households/${h.id}`}
                className="flex items-center justify-between rounded border border-zinc-200 px-4 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {h.name}
                </span>
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  {h.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Create a household
        </h2>
        {error && (
          <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        <form action={createHouseholdAction} className="flex gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. The Smith Household"
            className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
