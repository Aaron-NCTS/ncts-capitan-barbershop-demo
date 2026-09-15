import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
