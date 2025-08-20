'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Task } from '@/lib/features/kanban/kanbanSlice';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
  color: string;
}

export function KanbanColumn({ id, title, tasks, count, color }: KanbanColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodeRef } = useDroppable({ id });

  const getColumnStyle = () => {
    const styles = {
      draft: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
      unsolved: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      'under-review': 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      solved: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      new: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
    };
    return styles[id as keyof typeof styles] || styles.draft;
  };

  const getHeaderStyle = () => {
    const styles = {
      draft: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
      unsolved: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
      'under-review': 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white',
      solved: 'bg-gradient-to-r from-green-600 to-green-700 text-white',
      new: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
    };
    return styles[id as keyof typeof styles] || styles.draft;
  };

  return (
    <div className={`rounded-xl border-2 ${getColumnStyle()} shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Column Header */}
      <div className={`${getHeaderStyle()} p-4 rounded-t-xl flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
            {count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            title="Add new task"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className="p-4 min-h-[200px] space-y-3"
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/50 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs mt-1">Click the + button to add a task</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columnId={id}
        status={id as Task['status']}
      />
    </div>
  );
}