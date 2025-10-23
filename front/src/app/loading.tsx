export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span>読み込み中...</span>
      </div>
    </div>
  )
}


