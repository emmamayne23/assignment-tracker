'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { NewAssignment } from '@/types/assignment'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function NewAssignmentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<NewAssignment>({
    title: '',
    course: '',
    deadline: '',
    priority: 'medium',
    status: 'pending',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('assignments').insert({
      ...form,
      user_id: user.id,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/assignments')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/assignments" className="text-slate-500 hover:text-slate-300 text-sm transition">
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-white">New assignment</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Research paper on climate change"
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Course</label>
            <input
              name="course"
              type="text"
              required
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. Environmental Science"
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Deadline</label>
            <input
              name="deadline"
              type="date"
              required
              value={form.deadline}
              onChange={handleChange}
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : 'Save assignment'}
          </button>
        </form>
      </main>
    </div>
  )
}