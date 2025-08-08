"use client"

import { useSimpleAuth } from "@/components/providers/simple-auth-provider"

export function SessionInfo() {
  const { user, loading } = useSimpleAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Not signed in</div>
  }

  return (
    <div>
      <p>Signed in as: {user.email}</p>
      <p>Name: {user.name}</p>
      <p>Subscription: {user.subscription}</p>
      <p>Company: {user.companyName}</p>
    </div>
  )
} 