import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">EmployMe</h1>
      <Button>Add Job</Button>
    </main>
  )
}