"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MoreHorizontal } from "lucide-react"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// Typy danych
interface Task {
  id: string
  title: string
  description?: string
  priority: "Wysoki" | "Średni" | "Niski"
  status: "Do zrobienia" | "W trakcie" | "Zrobione"
  assignee: {
    name: string
    avatar?: string
    initials: string
  }
  dueDate?: string
}

// Komponent pojedynczego zadania
const TaskCard = ({
  task,
}: {
  task: Task
}) => {
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

  const priorityColorMap = {
    "Wysoki": "bg-red-500",
    "Średni": "bg-yellow-500",
    "Niski": "bg-green-500",
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
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
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
const KanbanColumn = ({
  title,
  tasks,
}: {
  title: string
  tasks: Task[]
}) => {
  return (
    <div className="min-w-72 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
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
  },
  {
    id: "task-4",
    title: "Skonfigurować deployment",
    description: "Ustawić CI/CD pipeline",
    priority: "Wysoki",
    status: "Do zrobienia",
    assignee: {
      name: "Anna Nowak",
      initials: "AN"
    },
    dueDate: "22 mar"
  },
  {
    id: "task-5",
    title: "Napisać testy",
    priority: "Średni",
    status: "W trakcie",
    assignee: {
      name: "Piotr Wiśniewski",
      initials: "PW"
    }
  },
]

// Główny komponent tablicy Kanban
export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)

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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTasks(tasks => {
        const activeTask = tasks.find(t => t.id === active.id)
        if (!activeTask) return tasks
        
        // Znajdujemy zadanie, nad którym zakończyliśmy przeciąganie
        const overTask = tasks.find(t => t.id === over.id)
        if (!overTask) return tasks
        
        // Zmieniamy status zadania na status kolumny docelowej
        return tasks.map(task => 
          task.id === active.id 
            ? { ...task, status: overTask.status } 
            : task
        )
      })
    }

    setActiveId(null)
  }

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn title="Do zrobienia" tasks={getColumnTasks("Do zrobienia")} />
        <KanbanColumn title="W trakcie" tasks={getColumnTasks("W trakcie")} />
        <KanbanColumn title="Zrobione" tasks={getColumnTasks("Zrobione")} />
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <div className="w-72">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
