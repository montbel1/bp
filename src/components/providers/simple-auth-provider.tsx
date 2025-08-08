"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  subscription: string
  flowAccess: boolean
  companyName: string
  companyType: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for testing
const mockUsers: User[] = [
  {
    id: "cpa-user-1",
    email: "cpa@avanee.com",
    name: "CPA Professional",
    subscription: "PRO",
    flowAccess: true,
    companyName: "Avanee CPA Services",
    companyType: "accounting"
  },
  {
    id: "tax-user-1",
    email: "tax@avanee.com", 
    name: "Tax Preparer",
    subscription: "BASIC",
    flowAccess: true,
    companyName: "Avanee Tax Services",
    companyType: "tax_preparation"
  },
  {
    id: "cfo-user-1",
    email: "cfo@avanee.com",
    name: "CFO Manager",
    subscription: "PRO",
    flowAccess: true,
    companyName: "Avanee Financial Services",
    companyType: "financial_services"
  },
  {
    id: "bookkeeper-user-1",
    email: "bookkeeper@avanee.com",
    name: "Bookkeeper",
    subscription: "BASIC",
    flowAccess: true,
    companyName: "Avanee Bookkeeping",
    companyType: "bookkeeping"
  }
]

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('avanee-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find user by email or create new one
    const existingUser = mockUsers.find(u => u.email === email)
    const user = existingUser || {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      subscription: "BASIC",
      flowAccess: true,
      companyName: "Avanee Books Pro",
      companyType: "accounting"
    }
    
    setUser(user)
    localStorage.setItem('avanee-user', JSON.stringify(user))
    return true
  }

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      subscription: "BASIC",
      flowAccess: true,
      companyName: "Avanee Books Pro",
      companyType: "accounting"
    }
    
    setUser(user)
    localStorage.setItem('avanee-user', JSON.stringify(user))
    return true
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('avanee-user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider')
  }
  return context
} 