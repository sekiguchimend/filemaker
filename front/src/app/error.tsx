'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-lg font-semibold">問題が発生しました</h2>
        <p className="text-sm text-muted-foreground break-words">{error.message}</p>
        <button onClick={() => reset()} className="px-4 py-2 rounded bg-primary text-primary-foreground">
          再試行
        </button>
      </div>
    </div>
  )
}


