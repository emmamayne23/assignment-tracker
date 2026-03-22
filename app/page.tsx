import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">
        Assignment Tracker
      </h1>
    </main>
  );
}