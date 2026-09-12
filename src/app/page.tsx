import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from("plans")
    .select("id, name, price_cents")
    .order("price_cents", { ascending: true });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        LifeOps
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Forward it. Photograph it. Forget about it. LifeOps remembers.
      </p>

      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 text-left text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
          Supabase connectivity check
        </p>
        {error ? (
          <p className="text-red-600 dark:text-red-400">{error.message}</p>
        ) : (
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
            {plans?.map((plan) => (
              <li key={plan.id} className="flex justify-between">
                <span>{plan.name}</span>
                <span>${(plan.price_cents / 100).toFixed(2)}/mo</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
