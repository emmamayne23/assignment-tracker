'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/public/logo.png'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const linkClass = (href: string) =>
    `text-sm transition px-3 py-1.5 rounded-lg ${
      pathname === href
        ? 'bg-white/10 text-white'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="w-full border-b border-white/10 bg-[#0f1117] px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">

      <div className="flex items-center">
        <Image src={logo} alt="Logo" className="w-8 h-8 mr-2" />
        <Link href="/dashboard" className="text-lg font-semibold text-white tracking-tight">
          Assign<span className="text-blue-400">Track</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/assignments" className={linkClass('/assignments')}>
          Assignments
        </Link>
        <Link
          href="/assignments/new"
          className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition font-medium ml-2"
        >
          + New
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-white/5 ml-1"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}