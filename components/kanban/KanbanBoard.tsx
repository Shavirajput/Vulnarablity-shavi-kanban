'use client'

import { useSelector, useDispatch } from 'react-redux'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { RootState, AppDispatch } from '@/lib/store'
import { moveTask, reorderTasks, Task } from '@/lib/features/kanban/kanbanSlice'
import { KanbanColumn } from './KanbanColumn'
import TaskCard from './TaskCard'
import KanbanHeader from './KanbanHeader'
import KanbanFilters from './KanbanFilters'

export default function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, columns, searchTerm, selectedLabels, sortBy, sortOrder } = useSelector((state: RootState) => state.kanban)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  // Filter and sort tasks
  const getFilteredTasks = (taskIds: string[]) => {
    let filteredTasks = taskIds.map(id => tasks[id]).filter(task => {
      // Search filter
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Label filter
      if (selectedLabels.length > 0) {
        const hasSelectedLabel = task.labels.some(label => selectedLabels.includes(label.id))
        if (!hasSelectedLabel) return false
      }
      
      return true
    })

    // Sort tasks
    filteredTasks.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'severity':
          comparison = a.severity - b.severity
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filteredTasks
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks[active.id as string]
    setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If we're over a column, handle moving between columns
    if (columns[overId]) {
      const task = tasks[activeId]
      if (task && task.status !== overId) {
        dispatch(moveTask({
          taskId: activeId,
          newStatus: overId as Task['status'],
          newIndex: 0,
        }))
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Handle reordering within the same column
    if (activeId !== overId) {
      const activeTask = tasks[activeId]
      const overTask = tasks[overId]
      
      if (activeTask && overTask && activeTask.status === overTask.status) {
        const columnId = activeTask.status
        const column = columns[columnId]
        const oldIndex = column.taskIds.indexOf(activeId)
        const newIndex = column.taskIds.indexOf(overId)
        
        const newTaskIds = [...column.taskIds]
        newTaskIds.splice(oldIndex, 1)
        newTaskIds.splice(newIndex, 0, activeId)
        
        dispatch(reorderTasks({ status: columnId, taskIds: newTaskIds }))
      }
    }
  }

  const columnOrder = ['draft', 'unsolved', 'under-review', 'solved', 'new']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <KanbanHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <KanbanFilters />
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
            {columnOrder.map(columnId => {
              const column = columns[columnId]
              const filteredTasks = getFilteredTasks(column.taskIds)
              
              return (
                <SortableContext
                  key={columnId}
                  items={filteredTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    column={column}
                    tasks={filteredTasks}
                  />
                </SortableContext>
              )
            })}
          </div>
          
          <DragOverlay>
            {activeTask && (
              <div className="rotate-6 scale-105">
                <TaskCard task={activeTask} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}