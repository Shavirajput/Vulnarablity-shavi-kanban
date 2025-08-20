import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Label {
  id: string
  name: string
  color: string
  type: 'severity' | 'category' | 'source'
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'draft' | 'unsolved' | 'under-review' | 'solved' | 'new'
  severity: number
  labels: Label[]
  createdAt: string
  updatedAt: string
  assignee?: string
  target?: string
}

export interface Column {
  color: string
  id: string
  title: string
  status: Task['status']
  taskIds: string[]
}

interface KanbanState {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  labels: Label[]
  searchTerm: string
  selectedLabels: string[]
  sortBy: 'date' | 'severity' | 'title'
  sortOrder: 'asc' | 'desc'
}

const defaultLabels: Label[] = [
  { id: '1', name: 'Critical', color: '#ef4444', type: 'severity' },
  { id: '2', name: 'Bypassed', color: '#8b5cf6', type: 'category' },
  { id: '3', name: 'Source Code', color: '#f97316', type: 'source' },
  { id: '4', name: 'Getstars', color: '#06b6d4', type: 'category' },
  { id: '5', name: 'Medium', color: '#f59e0b', type: 'severity' },
  { id: '6', name: 'Low', color: '#10b981', type: 'severity' },
]

const initialTasks: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    title: 'Server Side Template Injection (Blind)',
    description: 'Critical vulnerability found in server-side template processing',
    status: 'draft',
    severity: 8.8,
    labels: [
      { id: '1', name: 'Critical', color: '#ef4444', type: 'severity' },
      { id: '2', name: 'Bypassed', color: '#8b5cf6', type: 'category' }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  'task-2': {
    id: 'task-2',
    title: 'PII Disclosure',
    description: 'Personal information exposure vulnerability',
    status: 'draft',
    severity: 4.5,
    labels: [
      { id: '5', name: 'Medium', color: '#f59e0b', type: 'severity' },
      { id: '4', name: 'Getstars', color: '#06b6d4', type: 'category' }
    ],
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
  },
  'task-3': {
    id: 'task-3',
    title: 'JSON Web Key Set Disclosed',
    description: 'JWKS endpoint improperly exposed',
    status: 'unsolved',
    severity: 6.5,
    labels: [
      { id: '3', name: 'Source Code', color: '#f97316', type: 'source' },
      { id: '4', name: 'Getstars', color: '#06b6d4', type: 'category' }
    ],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  'task-4': {
    id: 'task-4',
    title: 'WordPress Database Backup File Found',
    description: 'Database backup file accessible via web',
    status: 'under-review',
    severity: 6.5,
    labels: [
      { id: '5', name: 'Medium', color: '#f59e0b', type: 'severity' },
      { id: '4', name: 'Getstars', color: '#06b6d4', type: 'category' }
    ],
    createdAt: '2024-01-12T14:40:00Z',
    updatedAt: '2024-01-12T14:40:00Z',
  },
  'task-5': {
    id: 'task-5',
    title: 'Phpmyadmin Information Schema Disclosure',
    description: 'Information schema exposed through phpMyAdmin',
    status: 'solved',
    severity: 6.5,
    labels: [
      { id: '1', name: 'Critical', color: '#ef4444', type: 'severity' },
      { id: '3', name: 'Source Code', color: '#f97316', type: 'source' }
    ],
    createdAt: '2024-01-11T11:25:00Z',
    updatedAt: '2024-01-11T11:25:00Z',
  },
}

const initialColumns: Record<string, Column> = {
  'draft': {
    id: 'draft',
    title: 'Draft',
    status: 'draft',
    color: '#64748b',
    taskIds: ['task-1', 'task-2'],
  },
  'unsolved': {
    id: 'unsolved',
    title: 'Unsolved',
    status: 'unsolved',
    color: '#ef4444',
    taskIds: ['task-3'],
  },
  'under-review': {
    id: 'under-review',
    title: 'Under Review',
    status: 'under-review',
    color: '#f59e0b',
    taskIds: ['task-4'],
  },
  'solved': {
    id: 'solved',
    title: 'Solved',
    status: 'solved',
    color: '#10b981',
    taskIds: ['task-5'],
  },
  'new': {
    id: 'new',
    title: 'New',
    status: 'new',
    color: '#3b82f6',
    taskIds: [],
  },
}

const initialState: KanbanState = {
  tasks: initialTasks,
  columns: initialColumns,
  labels: defaultLabels,
  searchTerm: '',
  selectedLabels: [],
  sortBy: 'date',
  sortOrder: 'desc',
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const id = `task-${Date.now()}`
      const now = new Date().toISOString()
      const task: Task = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      }
      state.tasks[id] = task
      state.columns[task.status].taskIds.push(id)
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload
      if (state.tasks[id]) {
        state.tasks[id] = {
          ...state.tasks[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload
      const task = state.tasks[taskId]
      if (task) {
        // Remove from column
        const column = state.columns[task.status]
        column.taskIds = column.taskIds.filter(id => id !== taskId)
        // Remove from tasks
        delete state.tasks[taskId]
      }
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newStatus: Task['status']; newIndex: number }>) => {
      const { taskId, newStatus, newIndex } = action.payload
      const task = state.tasks[taskId]
      if (task) {
        const oldStatus = task.status
        
        // Remove from old column
        state.columns[oldStatus].taskIds = state.columns[oldStatus].taskIds.filter(id => id !== taskId)
        
        // Add to new column
        state.columns[newStatus].taskIds.splice(newIndex, 0, taskId)
        
        // Update task status
        state.tasks[taskId].status = newStatus
        state.tasks[taskId].updatedAt = new Date().toISOString()
      }
    },
    reorderTasks: (state, action: PayloadAction<{ status: Task['status']; taskIds: string[] }>) => {
      const { status, taskIds } = action.payload
      state.columns[status].taskIds = taskIds
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setSelectedLabels: (state, action: PayloadAction<string[]>) => {
      state.selectedLabels = action.payload
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: KanbanState['sortBy']; sortOrder: KanbanState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },
    addLabel: (state, action: PayloadAction<Omit<Label, 'id'>>) => {
      const id = `label-${Date.now()}`
      const label: Label = { ...action.payload, id }
      state.labels.push(label)
    },
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  setSearchTerm,
  setSelectedLabels,
  setSortBy,
  addLabel,
} = kanbanSlice.actions

export default kanbanSlice.reducer