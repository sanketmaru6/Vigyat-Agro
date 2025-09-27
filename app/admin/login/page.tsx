"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || "Login failed")
      }
      router.push("/admin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-slate-800 text-white">
      <Header />
      <main className="max-w-md mx-auto p-6">
        <Card className="p-6 md:p-8 bg-slate-800/70 backdrop-blur border-slate-700 shadow-xl rounded-2xl">
          <div className="text-center mb-6">
            <img src="/vigyat-logo.png" alt="Vigyat logo" className="h-12 mx-auto mb-3 drop-shadow" />
            <h1 className="text-2xl font-bold tracking-tight">Vigyat AgroStore</h1>
            <p className="text-slate-300 text-sm">Admin Portal — Secure Access</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm" role="alert">{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  className="w-full rounded-lg bg-slate-900/70 border border-slate-700 pl-10 pr-3 py-2 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/60 transition disabled:opacity-60"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  disabled={loading}
                  aria-label="Username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg bg-slate-900/70 border border-slate-700 pl-10 pr-10 py-2 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/60 transition disabled:opacity-60"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 select-none">
                <input type="checkbox" className="accent-green-500/80" disabled={loading} />
                <span className="text-slate-300">Remember me</span>
              </label>
              <a className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer">Forgot password?</a>
            </div>

            <Button disabled={loading} className="w-full bg-green-500 hover:bg-green-600 font-medium gap-2">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In to Admin Portal
                </>
              )}
            </Button>


          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
