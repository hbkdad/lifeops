import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        That confirmation link didn&apos;t work
      </h1>
      <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
        It may have expired or already been used. Try logging in, or sign up
        again to get a new confirmation email.
      </p>
      <Link href="/login" className="font-medium underline">
        Back to login
      </Link>
    </div>
  );
}
