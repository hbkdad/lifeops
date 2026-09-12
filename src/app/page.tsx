import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(claims?.claims?.sub);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        LifeOps
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Forward it. Photograph it. Forget about it. LifeOps remembers.
      </p>

      {isLoggedIn ? (
        <Link
          href="/households"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Go to your households
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
