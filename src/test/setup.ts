import '@testing-library/jest-dom'
import React from 'react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
    button: 'button',
    a: 'a',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock react-router-dom for tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    Link: ({ children, to, ...props }: any) => {
      return React.createElement('a', { href: to, ...props }, children)
    },
  }
})
