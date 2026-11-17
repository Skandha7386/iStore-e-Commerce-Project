import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Edit3, LogOut, PackageCheck, UserRound } from 'lucide-react'
import { clearSession } from '../Redux/authSlice'
import { clearCart } from '../Redux/cartSlice'
import { clearFavorites } from '../Redux/wishListSlice'
import { updateUser } from '../Services/userService'

function readLoggedInUser() {
    try {
        return JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    } catch {
        return {}
    }
}

export default function Profile() {
    const [user, setUser] = useState(readLoggedInUser)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ name: user.name || '', username: user.username || '', email: user.email || '' })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function startEditing() {
        setForm({ name: user.name || '', username: user.username || '', email: user.email || '' })
        setError('')
        setIsEditing(true)
    }

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    async function saveProfile(event) {
        event.preventDefault()
        setError('')
        setIsSaving(true)

        const updates = {
            name: form.name.trim(),
            username: form.username.trim(),
            email: form.email.trim()
        }

        try {
            const updatedUser = await updateUser(user.id, updates)
            const sessionUser = { ...user, ...updates, id: updatedUser.id }
            localStorage.setItem('loggedInUser', JSON.stringify(sessionUser))
            setUser(sessionUser)
            setIsEditing(false)
        } catch (saveError) {
            setError(saveError.response?.data?.message || saveError.message || 'Could not update your profile.')
        } finally {
            setIsSaving(false)
        }
    }

    function handleLogout() {
        localStorage.removeItem('loggedInUser')
        dispatch(clearSession())
        dispatch(clearCart())
        dispatch(clearFavorites())
        navigate('/login', { replace: true })
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#f5f5f7] px-5 py-12">
            <div className="mx-auto max-w-4xl">
                <p className="text-sm text-gray-500">Account</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">Your Profile</h1>
                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm md:p-9">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f7] text-gray-600"><UserRound size={26} /></span>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user.name || user.username || 'Account'}</h2>
                            <p className="mt-1 text-sm text-gray-500">{user.email || 'No email saved'}</p>
                        </div>
                    </div>
                    {isEditing ? (
                        <form onSubmit={saveProfile} className="grid gap-5 py-6 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium text-gray-700">Full name
                                <input name="name" value={form.name} onChange={handleChange} required className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-black" />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-gray-700">Email address
                                <input name="email" type="email" value={form.email} onChange={handleChange} required className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-black" />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">Username
                                <input name="username" value={form.username} onChange={handleChange} required className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-black" />
                            </label>
                            {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
                            <div className="flex gap-3 sm:col-span-2">
                                <button type="submit" disabled={isSaving} className="rounded-full bg-[#0071e3] px-5 py-3 text-sm font-medium text-white hover:bg-[#0077ed] disabled:opacity-50">{isSaving ? 'Saving…' : 'Save changes'}</button>
                                <button type="button" onClick={function() { setIsEditing(false); setError('') }} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid gap-5 py-6 sm:grid-cols-2">
                            <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Full name</p><p className="mt-2 text-gray-900">{user.name || 'Not provided'}</p></div>
                            <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email address</p><p className="mt-2 text-gray-900">{user.email || 'Not provided'}</p></div>
                            <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Username</p><p className="mt-2 text-gray-900">{user.username || 'Not provided'}</p></div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                        {!isEditing && <button type="button" onClick={startEditing} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:border-black"><Edit3 size={17} /> Edit Profile</button>}
                        <Link to="/my-orders" className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-sm font-medium text-white hover:bg-[#0077ed]"><PackageCheck size={17} /> My Orders</Link>
                        <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600"><LogOut size={17} /> Log Out</button>
                    </div>
                </section>
            </div>
        </main>
    )
}
