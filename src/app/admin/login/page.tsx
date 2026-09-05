'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldAlert, Eye, EyeOff, Lock, Loader2, UserPlus, LogIn, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '@/lib/validations'
import toast from 'react-hot-toast'

function AdminAuthComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('Access Denied: This account does not have administrator privileges.')
    }
  }, [searchParams])

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    setError('')
    setSuccessMessage('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Invalid credentials. Access denied.')
        return
      }

      toast.success('Signed in successfully')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Connection error. Ensure local MongoDB is running.')
    }
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setError('')
    setSuccessMessage('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Failed to create administrator account.')
        return
      }

      toast.success('Admin account created successfully!')
      setSuccessMessage('Account created! Redirecting to admin dashboard...')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Connection error. Ensure local MongoDB is running.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-3 shadow-lg shadow-primary/10">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === 'login'
              ? 'Restricted access. Sign in with your administrator credentials.'
              : 'Create a new local administrator account for full panel access.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-4 grid grid-cols-2 p-1 bg-muted/60 border border-border/50 rounded-xl">
          <button
            type="button"
            id="tab-sign-in"
            onClick={() => {
              setMode('login')
              setError('')
              setSuccessMessage('')
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </button>
          <button
            type="button"
            id="tab-create-account"
            onClick={() => {
              setMode('register')
              setError('')
              setSuccessMessage('')
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Create Account
          </button>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-xl">
          {error && (
            <div
              className="rounded-lg bg-destructive/10 border border-destructive/30 px-3.5 py-2.5 text-xs text-destructive flex items-start gap-2 mb-4"
              role="alert"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 text-xs text-emerald-400 flex items-start gap-2 mb-4"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
              id="admin-login-form"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-xs font-medium">Administrator Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@portfolio.local"
                  {...loginForm.register('email')}
                  className="rounded-xl text-sm"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-xs font-medium">Master Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...loginForm.register('password')}
                    className="rounded-xl pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="toggle-login-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full rounded-xl mt-2 shadow-md shadow-primary/20"
                id="login-submit-btn"
              >
                {loginForm.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  'Sign In to Admin'
                )}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setSuccessMessage('')
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Need a new administrator account? <span className="text-primary font-medium underline">Create Account</span>
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
              id="admin-register-form"
            >
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-xs font-medium">Administrator Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="username"
                  placeholder="your.name@portfolio.local"
                  {...registerForm.register('email')}
                  className="rounded-xl text-sm"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-xs font-medium">Password (min 6 chars)</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...registerForm.register('password')}
                    className="rounded-xl pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="toggle-register-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-xs font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...registerForm.register('confirmPassword')}
                    className="rounded-xl pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    id="toggle-register-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="w-full rounded-xl mt-2 shadow-md shadow-primary/20"
                id="register-submit-btn"
              >
                {registerForm.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Admin Account'
                )}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setSuccessMessage('')
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Already have an account? <span className="text-primary font-medium underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            MongoDB Local Auth • Private session
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            Default: admin@portfolio.local / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <AdminAuthComponent />
    </Suspense>
  )
}
