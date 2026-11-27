import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../AdminServices/adminAuthservice'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

function AdminLogin() {
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const [showPassword, setshowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const navigate = useNavigate()

    function validateFields() {
        const errors = {}
        if (!userName.trim()) {
            errors.userName = 'Please enter your admin username.'
        }
        if (!password) {
            errors.password = 'Please enter your password.'
        }
        return errors
    }

    async function handleLogin(event) {
        event.preventDefault()
        setError('')

        const errors = validateFields()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})

        setIsLoading(true)
        try {
            const admin = await loginAdmin(userName, password)

            if (admin) {
                sessionStorage.setItem("admin", JSON.stringify(admin))
                navigate('/admin/dashboard', { replace: true })
            } else {
                setError("Invalid admin username or password.")
            }
        } catch {
            setError("Unable to connect to the server. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    iStore Admin
                </h1>

                <p className="text-gray-500 text-sm text-center mb-8">
                    Sign in to your administrator portal
                </p>

                <form onSubmit={handleLogin} noValidate className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            value={userName}
                            onChange={function(event) {
                                setUsername(event.target.value)
                                if (fieldErrors.userName) {
                                    setFieldErrors(function(prev) {
                                        return { ...prev, userName: '' }
                                    })
                                }
                            }}
                            onBlur={function() {
                                if (!userName.trim()) {
                                    setFieldErrors(function(prev) {
                                        return { ...prev, userName: 'Please enter your admin username.' }
                                    })
                                }
                            }}
                            placeholder="Enter admin username"
                            className={`w-full border rounded-xl p-3 outline-none transition ${
                                fieldErrors.userName
                                    ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900 placeholder:text-red-300'
                                    : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                            }`}
                        />

                        {fieldErrors.userName && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{fieldErrors.userName}</span>
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={function(event) {
                                    setPassword(event.target.value)
                                    if (fieldErrors.password) {
                                        setFieldErrors(function(prev) {
                                            return { ...prev, password: '' }
                                        })
                                    }
                                }}
                                onBlur={function() {
                                    if (!password) {
                                        setFieldErrors(function(prev) {
                                            return { ...prev, password: 'Please enter your password.' }
                                        })
                                    }
                                }}
                                placeholder="Enter admin password"
                                className={`w-full border rounded-xl p-3 pr-12 outline-none transition ${
                                    fieldErrors.password
                                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900 placeholder:text-red-300'
                                        : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                                }`}
                            />

                            <button
                                type="button"
                                onClick={function() {
                                    setshowPassword(!showPassword)
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {fieldErrors.password && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{fieldErrors.password}</span>
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200/80 p-3.5 text-sm text-red-700">
                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                            <div className="font-medium leading-relaxed">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In to Admin"}
                    </button>

                </form>

            </div>
        </div>
    )
}

export default AdminLogin
