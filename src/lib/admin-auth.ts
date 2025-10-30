const ADMIN_SESSION_KEY = 'admin_session_v1'

export type AdminSession = {
  email: string
  loggedInAt: number
}

export function getAdminEnvCreds() {
  const email = import.meta.env.VITE_ADMIN_EMAIL as string | undefined
  const password = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined
  return { email, password }
}

export function isAdminLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as AdminSession
    return Boolean(parsed?.email)
  } catch {
    return false
  }
}

export function loginAdmin(email: string, password: string): boolean {
  const creds = getAdminEnvCreds()
  if (!creds.email || !creds.password) return false
  if (email === creds.email && password === creds.password) {
    const session: AdminSession = { email, loggedInAt: Date.now() }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}


