'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { Task } from '@/lib/features/kanban/kanbanSlice'
import { deleteTask, AppDispatch } from '@/lib/features/kanban/kanbanSlice'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TaskModal from './TaskModal'
import { MoreHorizontal, Calendar, Edit, Trash2, User, Target } from 'lucide-react'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200'
    if (severity >= 6) return 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
    if (severity >= 4) return 'text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
    return 'text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this vulnerability?')) {
      dispatch(deleteTask(task.id))
    }
  }
  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 border-l-4 ${
          isDragging ? 'rotate-3 shadow-2xl scale-105' : ''
        } ${getSeverityColor(task.severity).includes('red') ? 'border-l-red-500' : 
             getSeverityColor(task.severity).includes('orange') ? 'border-l-orange-500' :
             getSeverityColor(task.severity).includes('yellow') ? 'border-l-yellow-500' : 'border-l-green-500'}`}
      >
        <div className="space-y-3">
          {/* Header with ID and menu */}
          <div className="flex items-start justify-between">
            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-full">
              #{task.id.split('-')[1]}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6 -mt-1 -mr-1 hover:bg-gray-100">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
            {task.title}
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>

          {/* Labels */}
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                className="text-xs px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: label.color + '20',
                  borderColor: label.color,
                  color: label.color,
                }}
              >
                {label.name}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs space-x-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">
                  {formatDate(task.createdAt)}
                </span>
              </div>
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500 truncate max-w-16">
                    {task.assignee.split('@')[0]}
                  </span>
                </div>
              )}
              {task.target && (
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500 truncate max-w-16">
                    {task.target}
                  </span>
                </div>
              )}
            </div>
            <div className={`px-2 py-1 rounded-full font-bold text-xs border ${getSeverityColor(task.severity)}`}>
              {task.severity}
            </div>
          </div>
        </div>
      </Card>
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        status={task.status}
      />
    </>
  )
}