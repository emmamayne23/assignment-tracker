import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Assignment } from '@/types/assignment'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('assignments')
    .select('*')
    .order('deadline', { ascending: true })

  const all = (data as Assignment[]) ?? []
  const today = new Date().toISOString().split('T')[0]

  const total = all.length
  const pending = all.filter(a => a.status === 'pending').length
  const submitted = all.filter(a => a.status === 'submitted').length
  const overdue = all.filter(a => a.status === 'pending' && a.deadline < today).length
  const dueToday = all.filter(a => a.status === 'pending' && a.deadline === today).length

  const stats = [
    { label: 'Total', value: total, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending', value: pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Submitted', value: submitted, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Due today', value: dueToday, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Overdue', value: overdue, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ]

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, {user.user_metadata?.full_name ?? user.email}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className={`rounded-xl p-4 border ${stat.bg}`}>
              <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-white">Upcoming assignments</h2>
          <Link href="/assignments" className="text-sm text-blue-400 hover:text-blue-300 transition">
            View all →
          </Link>
        </div>

        {all.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#1a1d27]">
            <p className="text-slate-400 text-sm">No assignments yet</p>
            <Link
              href="/assignments/new"
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block transition"
            >
              Add your first one →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {all.filter(a => a.status === 'pending').slice(0, 5).map(a => (
              <Link
                key={a.id}
                href={`/assignments/${a.id}`}
                className="bg-[#1a1d27] border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between hover:border-blue-500/40 hover:bg-[#1e2130] transition group"
              >
                <div>
                  <p className="font-medium text-sm text-white group-hover:text-blue-300 transition">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.course}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:inline-block ${
                    a.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    a.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {a.priority}
                  </span>
                  <span className={`text-xs font-medium ${
                    a.deadline < today ? 'text-red-400' :
                    a.deadline === today ? 'text-purple-400' :
                    'text-slate-500'
                  }`}>
                    {a.deadline < today ? 'Overdue' :
                     a.deadline === today ? 'Due today' : a.deadline}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}