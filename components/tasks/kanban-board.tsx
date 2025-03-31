"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Definicje typów
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

// Nowa struktura danych dla tablicy Kanban
interface Column {
  id: string
  title: string
  status: "Do zrobienia" | "W trakcie" | "Zrobione"
}

interface KanbanData {
  tasks: {
    [key: string]: Task
  }
  columns: {
    [key: string]: Column
  }
  columnOrder: string[]
  tasksByColumn: {
    [columnId: string]: string[]
  }
}

// Komponent pojedynczego zadania
const TaskCard = ({ id, task }: { id: string, task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

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
const KanbanColumn = ({ column, taskIds, tasks }: { 
  column: Column, 
  taskIds: string[], 
  tasks: { [key: string]: Task } 
}) => {
  return (
    <div className="min-w-72 rounded-lg bg-muted/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{column.title}</h2>
        <Badge variant="outline">{taskIds.length}</Badge>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {taskIds.map((taskId) => (
            <TaskCard key={taskId} id={taskId} task={tasks[taskId]} />
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

// Utworzenie początkowej struktury danych
const getInitialData = (tasks: Task[]): KanbanData => {
  // Definicje kolumn
  const columns = {
    'column-1': { id: 'column-1', title: 'Do zrobienia', status: 'Do zrobienia' as const },
    'column-2': { id: 'column-2', title: 'W trakcie', status: 'W trakcie' as const },
    'column-3': { id: 'column-3', title: 'Zrobione', status: 'Zrobione' as const },
  }
  
  const columnOrder = ['column-1', 'column-2', 'column-3']

  // Inicjalizacja tasksByColumn
  const tasksByColumn: { [columnId: string]: string[] } = {
    'column-1': [],
    'column-2': [],
    'column-3': [],
  }

  // Konwersja tablicy zadań na obiekt i przypisanie do odpowiednich kolumn
  const tasksById: { [key: string]: Task } = {}
  
  tasks.forEach(task => {
    tasksById[task.id] = task
    
    // Przypisanie zadania do odpowiedniej kolumny na podstawie statusu
    if (task.status === 'Do zrobienia') {
      tasksByColumn['column-1'].push(task.id)
    } else if (task.status === 'W trakcie') {
      tasksByColumn['column-2'].push(task.id)
    } else if (task.status === 'Zrobione') {
      tasksByColumn['column-3'].push(task.id)
    }
  })

  return {
    tasks: tasksById,
    columns,
    columnOrder,
    tasksByColumn
  }
}

// Główny komponent tablicy Kanban
export function KanbanBoard() {
  const [kanbanData, setKanbanData] = useState<KanbanData>(getInitialData(initialTasks))
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    const activeId = active.id as string
    const overId = over.id as string
    
    // Znajdź, do której kolumny należy zadanie
    let sourceColumnId: string | null = null
    let destinationColumnId: string | null = null
    
    // Znajdź kolumnę źródłową
    Object.entries(kanbanData.tasksByColumn).forEach(([columnId, taskIds]) => {
      if (taskIds.includes(activeId)) {
        sourceColumnId = columnId
      }
    })
    
    // Znajdź kolumnę docelową - może to być zadanie lub kolumna
    const isOverATask = Object.values(kanbanData.tasks).some(task => task.id === overId)
    
    if (isOverATask) {
      // Sprawdź, w której kolumnie jest to zadanie
      Object.entries(kanbanData.tasksByColumn).forEach(([columnId, taskIds]) => {
        if (taskIds.includes(overId)) {
          destinationColumnId = columnId
        }
      })
    } else {
      // Over jest bezpośrednio kolumną
      destinationColumnId = overId
    }
    
    // Jeśli nie znaleziono którejś z kolumn lub są takie same, zakończ
    if (!sourceColumnId || !destinationColumnId || sourceColumnId === destinationColumnId) {
      return
    }
    
    // Aktualizacja stanu
    setKanbanData(prev => {
      const sourceTaskIds = [...prev.tasksByColumn[sourceColumnId!]]
      const destTaskIds = [...prev.tasksByColumn[destinationColumnId!]]
      
      // Usuń zadanie z kolumny źródłowej
      const sourceIndex = sourceTaskIds.indexOf(activeId)
      sourceTaskIds.splice(sourceIndex, 1)
      
      // Dodaj do kolumny docelowej
      destTaskIds.push(activeId)
      
      // Aktualizuj status zadania na podstawie kolumny docelowej
      const newTasks = {
        ...prev.tasks,
        [activeId]: {
          ...prev.tasks[activeId],
          status: prev.columns[destinationColumnId!].status
        }
      }
      
      return {
        ...prev,
        tasks: newTasks,
        tasksByColumn: {
          ...prev.tasksByColumn,
          [sourceColumnId!]: sourceTaskIds,
          [destinationColumnId!]: destTaskIds
        }
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }
    
    const activeId = active.id as string
    const overId = over.id as string
    
    // Znajdź kolumnę, do której należy zadanie
    let columnId: string | null = null
    
    Object.entries(kanbanData.tasksByColumn).forEach(([colId, taskIds]) => {
      if (taskIds.includes(activeId)) {
        columnId = colId
      }
    })
    
    if (!columnId) {
      setActiveId(null)
      return
    }
    
    // Jeśli przeciągnięto zadanie na inne zadanie w tej samej kolumnie, zmień kolejność
    if (activeId !== overId && kanbanData.tasksByColumn[columnId].includes(overId)) {
      const oldIndex = kanbanData.tasksByColumn[columnId].indexOf(activeId)
      const newIndex = kanbanData.tasksByColumn[columnId].indexOf(overId)
      
      setKanbanData(prev => {
        const newTaskIds = arrayMove(prev.tasksByColumn[columnId], oldIndex, newIndex)
        
        return {
          ...prev,
          tasksByColumn: {
            ...prev.tasksByColumn,
            [columnId]: newTaskIds
          }
        }
      })
    }
    
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kanbanData.columnOrder.map(columnId => {
          const column = kanbanData.columns[columnId]
          const taskIds = kanbanData.tasksByColumn[columnId]
          
          return (
            <KanbanColumn 
              key={columnId} 
              column={column} 
              taskIds={taskIds} 
              tasks={kanbanData.tasks} 
            />
          )
        })}
      </div>
    </DndContext>
  )
}
