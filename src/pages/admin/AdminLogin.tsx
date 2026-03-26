import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../hooks/useAdmin'
import { PageWrapper } from '../../components/layout/PageWrapper'

export function AdminLogin() {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(pass)) {
      navigate('/admin/dashboard')
    } else {
      setError(true)
      setPass('')
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card bg-base-200 w-full max-w-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">Admin access</h2>
            <p className="text-sm text-base-content/50">Enter the admin password to continue.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <input
                type="password"
                className="input input-bordered"
                placeholder="Password"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError(false) }}
                autoFocus
              />
              {error && (
                <div className="alert alert-error text-sm py-2">
                  Incorrect password.
                </div>
              )}
              <button type="submit" className="btn btn-primary">Enter</button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
