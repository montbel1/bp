// Simple authentication system for local development
export interface User {
  id: string
  email: string
  name: string
  subscription: string
  flowAccess: boolean
  companyName: string
  companyType: string
}

// In-memory user store for development
const users: User[] = [
  {
    id: "dev-user-1",
    email: "admin@avanee.com",
    name: "Admin User",
    subscription: "PRO",
    flowAccess: true,
    companyName: "Avanee Books Pro",
    companyType: "bookkeeping"
  },
  {
    id: "dev-user-2", 
    email: "cpa@avanee.com",
    name: "CPA User",
    subscription: "BASIC",
    flowAccess: true,
    companyName: "Avanee Books Pro",
    companyType: "accounting"
  }
]

export const simpleAuth = {
  // Sign in with email/password
  signIn: async (email: string, password: string): Promise<User | null> => {
    // For development, accept any email/password
    const user = users.find(u => u.email === email) || {
      id: `dev-user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      subscription: "BASIC",
      flowAccess: true,
      companyName: "Avanee Books Pro",
      companyType: "bookkeeping"
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return user
  },

  // Get current user from session
  getCurrentUser: async (): Promise<User | null> => {
    // In a real app, this would check cookies/session
    // For now, return the first user as "logged in"
    return users[0] || null
  },

  // Sign out
  signOut: async (): Promise<void> => {
    // In a real app, this would clear cookies/session
    await new Promise(resolve => setTimeout(resolve, 200))
  }
} 
