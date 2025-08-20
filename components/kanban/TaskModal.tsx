'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RootState, AppDispatch } from '@/lib/store'
import { addTask, updateTask, Task, Label as KanbanLabel } from '@/lib/features/kanban/kanbanSlice'
import { X, Plus } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  severity: z.number().min(0).max(10),
  assignee: z.string().optional(),
  target: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
  status: Task['status']
}

export default function TaskModal({ isOpen, onClose, task, status }: TaskModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { labels } = useSelector((state: RootState) => state.kanban)
  const [selectedLabels, setSelectedLabels] = useState<KanbanLabel[]>(task?.labels || [])

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      severity: task?.severity || 5,
      assignee: task?.assignee || '',
      target: task?.target || '',
    },
  })

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      dispatch(updateTask({
        id: task.id,
        updates: {
          ...data,
          labels: selectedLabels,
        }
      }))
    } else {
      dispatch(addTask({
        ...data,
        status,
        labels: selectedLabels,
      }))
    }
    onClose()
    form.reset()
    setSelectedLabels([])
  }

  const toggleLabel = (label: KanbanLabel) => {
    setSelectedLabels(prev => 
      prev.find(l => l.id === label.id)
        ? prev.filter(l => l.id !== label.id)
        : [...prev, label]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {task ? 'Edit Vulnerability' : 'Create New Vulnerability'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Update the vulnerability details below.' : 'Add a new security vulnerability to track.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Vulnerability Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="e.g., SQL Injection in Login Form"
                className="mt-1"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Detailed description of the vulnerability..."
                className="mt-1 min-h-[100px]"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="severity">Severity Score (0-10) *</Label>
              <Input
                id="severity"
                type="number"
                min="0"
                max="10"
                step="0.1"
                {...form.register('severity', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                {...form.register('assignee')}
                placeholder="e.g., john.doe@company.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="target">Target System</Label>
              <Input
                id="target"
                {...form.register('target')}
                placeholder="e.g., Production API"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={status} disabled>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unsolved">Unsolved</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Labels</Label>
            <div className="mt-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedLabels.map(label => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className="px-3 py-1 cursor-pointer"
                    style={{
                      backgroundColor: label.color + '20',
                      borderColor: label.color,
                      color: label.color,
                    }}
                    onClick={() => toggleLabel(label)}
                  >
                    {label.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              
              <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-600 mb-2">Available Labels:</p>
                <div className="flex flex-wrap gap-2">
                  {labels.filter(label => !selectedLabels.find(l => l.id === label.id)).map(label => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      className="px-3 py-1 cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: label.color + '10',
                        borderColor: label.color + '40',
                        color: label.color,
                      }}
                      onClick={() => toggleLabel(label)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {task ? 'Update Vulnerability' : 'Create Vulnerability'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}