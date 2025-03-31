import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import Link from "next/link"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Zadania</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nowe zadanie
          </Link>
        </Button>
      </div>

      <KanbanBoard />
    </div>
  )
}