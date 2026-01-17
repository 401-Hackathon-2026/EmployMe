import AppShell from "@/components/layout/AppShell"

export default function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Job Detail</h1>
      <p className="text-muted-foreground">
        Job ID: {params.id}
      </p>
    </AppShell>
  )
}
