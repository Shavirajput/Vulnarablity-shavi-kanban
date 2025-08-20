'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RootState, AppDispatch } from '@/lib/store'
import { signUpStart, signUpSuccess, signUpError, loginStart, loginSuccess, loginError, clearError } from '@/lib/features/auth/authSlice'
import { Eye, EyeOff, Shield } from 'lucide-react'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

type AuthFormData = z.infer<typeof authSchema>

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  const onSubmit = (data: AuthFormData) => {
    dispatch(clearError())
    
    if (isSignUp) {
      dispatch(signUpStart())
      // Simulate API call
      setTimeout(() => {
        // Always succeed for demo purposes
        dispatch(signUpSuccess({
          id: Date.now().toString(),
          email: data.email,
          name: data.name || data.email.split('@')[0],
        }))
      }, 1000)
    } else {
      dispatch(loginStart())
      // Simulate API call
      setTimeout(() => {
        // Always succeed for demo purposes
        dispatch(loginSuccess({
          id: Date.now().toString(),
          email: data.email,
          name: data.email.split('@')[0],
        }))
      }, 1000)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 h-screen">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isSignUp 
              ? 'Join the Security Vulnerability Management System' 
              : 'Access your vulnerability dashboard'
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Enter your full name"
                  className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Enter your email"
                className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="Enter your password"
                  className="bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" 
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                form.reset()
                dispatch(clearError())
              }}
              className="text-sm text-blue-600 hover:text-purple-600 hover:underline transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}