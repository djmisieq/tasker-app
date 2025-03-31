"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { 
  DndContext, 
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Typy danych
interface Task {
  id: string
  title: string
  priority: "Wysoki" | "Średni" | "Niski"
  status: "Do zrobienia" | "W trakcie" | "Zrobione"
  assignee: {
    name: string
    initials: string
  }
  dueDate?: string
}

// Komponent pojedynczego zadania
const TaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="mb-3 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <Badge variant={task.priority === "Wysoki" ? "destructive" : task.priority === "Średni" ? "default" : "secondary"}>
            {task.priority}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" /> 
              {task.dueDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Komponent kolumny Kanban
const KanbanColumn = ({ title, tasks }: { title: string, tasks: Task[] }) => {
  return (
    <div className="min-w-72 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <SortableContext 
        items={tasks.map(task => task.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[150px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// Dane demonstracyjne
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Przygotować prezentację projektu",
    priority: "Wysoki",
    status: "Do zrobienia",
    assignee: {
      name: "Jan Kowalski",
      initials: "JK"
    }
  },
  {
    id: "task-2",
    title: "Redesign strony",
    priority: "Średni",
    status: "W trakcie",
    assignee: {
      name: "Jan Kowalski",
      initials: "JK"
    },
    dueDate: "19 mar"
  },
  {
    id: "task-3",
    title: "Zaktualizować zależności",
    priority: "Niski",
    status: "Zrobione",
    assignee: {
      name: "Jan Kowalski",
      initials: "JK"
    },
    dueDate: "15 mar"
  }
]

// Główny komponent tablicy Kanban
export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Jeśli nie ma elementu docelowego, przerywamy
    if (!over) return

    const draggedTaskId = active.id as string
    const overTaskId = over.id as string

    // Jeśli przeciągamy nad tym samym elementem, nie robimy nic
    if (draggedTaskId === overTaskId) return

    // Znajdź zadanie, które jest przeciągane
    const draggedTask = tasks.find(task => task.id === draggedTaskId)
    if (!draggedTask) return

    // Znajdź zadanie, nad którym upuszczamy (jeśli takie istnieje)
    const overTask = tasks.find(task => task.id === overTaskId)
    
    // Jeśli znaleźliśmy zadanie docelowe, używamy jego statusu
    // W przeciwnym razie (np. przeciąganie bezpośrednio na kolumnę) 
    // status się nie zmienia
    if (overTask && draggedTask.status !== overTask.status) {
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === draggedTaskId 
            ? { ...task, status: overTask.status } 
            : task
        )
      )
    }
  }

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn title="Do zrobienia" tasks={getColumnTasks("Do zrobienia")} />
        <KanbanColumn title="W trakcie" tasks={getColumnTasks("W trakcie")} />
        <KanbanColumn title="Zrobione" tasks={getColumnTasks("Zrobione")} />
      </div>
    </DndContext>
  )
}
