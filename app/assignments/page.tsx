'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Assignment, NewAssignment } from '@/types/assignment'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AssignmentsPage() {
  const supabase = createClient()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Assignment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const today = new Date().toISOString().split('T')[0]

  async function fetchAssignments() {
    const { data } = await supabase
      .from('assignments')
      .select('*')
      .order('deadline', { ascending: true })
    setAssignments((data as Assignment[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAssignments() }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteId(deleteTarget.id)
    await supabase.from('assignments').delete().eq('id', deleteTarget.id)
    setAssignments(prev => prev.filter(a => a.id !== deleteTarget.id))
    setDeleteId(null)
    setDeleteTarget(null)
  }

  function handleEditSaved(updated: Assignment) {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a))
    setEditTarget(null)
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Assignments</h1>
            <p className="text-slate-400 text-sm mt-1">{assignments.length} total</p>
          </div>
          <Link
            href="/assignments/new"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            + New
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1a1d27] border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-16 rounded-full bg-white/5 animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#1a1d27]">
            <p className="text-slate-400 text-sm">No assignments yet</p>
            <Link href="/assignments/new" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block transition">
              Add your first one →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {assignments.map(a => (
              <div
                key={a.id}
                className="bg-[#1a1d27] border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between hover:border-white/20 transition group"
              >
                <div className="flex flex-col gap-0.5 min-w-0 mr-4">
                  <p className="font-medium text-sm text-white truncate">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.course}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:inline-block ${
                    a.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    a.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {a.priority}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    a.status === 'submitted'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {a.status}
                  </span>
                  <span className={`text-xs font-medium min-w-[64px] text-right hidden sm:block ${
                    a.status === 'submitted' ? 'text-slate-500' :
                    a.deadline < today ? 'text-red-400' :
                    a.deadline === today ? 'text-purple-400' :
                    'text-slate-500'
                  }`}>
                    {a.status === 'submitted' ? a.deadline :
                     a.deadline < today ? 'Overdue' :
                     a.deadline === today ? 'Due today' : a.deadline}
                  </span>

                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setEditTarget(a)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      disabled={deleteId === a.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editTarget && (
        <EditModal
          assignment={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEditSaved}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteId === deleteTarget.id}
        />
      )}
    </div>
  )
}

function EditModal({
  assignment,
  onClose,
  onSaved,
}: {
  assignment: Assignment
  onClose: () => void
  onSaved: (updated: Assignment) => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<NewAssignment>({
    title: assignment.title,
    course: assignment.course,
    deadline: assignment.deadline,
    priority: assignment.priority,
    status: assignment.status,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('assignments')
      .update(form)
      .eq('id', assignment.id)
      .select()
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSaved(data as Assignment)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Edit assignment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-slate-300 hover:bg-white/5 font-medium py-2.5 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteModal({
  title,
  onClose,
  onConfirm,
  loading,
}: {
  title: string
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">Delete assignment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 text-slate-300 hover:bg-white/5 font-medium py-2.5 rounded-lg text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}