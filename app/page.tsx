'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import AuthForm from '@/components/auth/AuthForm'
import KanbanBoard from '@/components/kanban/KanbanBoard'

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <>
      {isAuthenticated ? <KanbanBoard /> : <AuthForm />}
    </>
  )
}