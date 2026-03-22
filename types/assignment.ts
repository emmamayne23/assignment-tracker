export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' | 'submitted'

export interface Assignment {
  id: string
  user_id: string
  title: string
  course: string
  deadline: string
  priority: Priority
  status: Status
  created_at: string
}

export type NewAssignment = Omit<Assignment, 'id' | 'user_id' | 'created_at'>