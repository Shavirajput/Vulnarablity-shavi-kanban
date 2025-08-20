'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Shield, LogOut, Settings, Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RootState, AppDispatch } from '@/lib/store'
import { logout } from '@/lib/features/auth/authSlice'

export default function KanbanHeader() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vulnerabilities
              </h1>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
              <Settings className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 ring-2 ring-blue-200">
                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-bold">
                  {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}