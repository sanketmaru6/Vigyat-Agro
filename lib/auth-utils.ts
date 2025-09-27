// Authentication utilities for admin system

export interface AdminSession {
  isAuthenticated: boolean
  username?: string
}

// Simple session management (replace with proper auth in production)
let currentSession: AdminSession = { isAuthenticated: false }

export const login = (username: string, password: string): boolean => {
  // Simple hardcoded admin credentials (replace with proper auth)
  if (username === "admin" && password === "admin123") {
    currentSession = { isAuthenticated: true, username }
    return true
  }
  return false
}

export const logout = (): void => {
  currentSession = { isAuthenticated: false }
}

export const getSession = (): AdminSession => currentSession

export const isAuthenticated = (): boolean => currentSession.isAuthenticated
