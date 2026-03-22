'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Assignment, NewAssignment } from '@/types/assignment'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function EditAssignmentPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<NewAssignment>({
    title: '',
    course: '',
    deadline: '',
    priority: 'medium',
    status: 'pending',
  })

  useEffect(() => {
    async function fetchAssignment() {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        router.push('/assignments')
        return
      }

      const a = data as Assignment
      setForm({
        title: a.title,
        course: a.course,
        deadline: a.deadline,
        priority: a.priority,
        status: a.status,
      })
      setFetching(false)
    }

    fetchAssignment()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('assignments')
      .update(form)
      .eq('id', id)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/assignments')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this assignment?')) return

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      router.push('/assignments')
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0f1117]">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-5">
          <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/assignments" className="text-slate-500 hover:text-slate-300 text-sm transition">
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-white">Edit assignment</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 w-full bg-[#0f1117] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition"
            >
              Delete
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}