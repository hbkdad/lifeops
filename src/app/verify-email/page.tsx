export default function VerifyEmailPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Check your email
      </h1>
      <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
        We sent you a confirmation link. Click it to finish creating your
        account.
      </p>
    </div>
  );
}
