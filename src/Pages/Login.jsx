import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { addToCart } from '../Redux/cartSlice'
import { loginUser } from '../Redux/authSlice'

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const registrationSuccess = location.state?.registered === true
    const blockedMessage = location.state?.blockedMessage
    const { error, isLoading } = useSelector(function(state) {
        return state.auth
    })

    function validateFields() {
        const errors = {}
        if (!username.trim()) {
            errors.username = 'Please enter your username.'
        }
        if (!password) {
            errors.password = 'Please enter your password.'
        }
        return errors
    }

    async function handleLogin(event) {
        event.preventDefault()

        const errors = validateFields()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})

        const result = await dispatch(loginUser({ username, password }))

        if (loginUser.fulfilled.match(result)) {
            if (location.state?.buyNowProduct) {
                dispatch(addToCart(location.state.buyNowProduct))
            }

            const destination = location.state?.from
                ? `${location.state.from.pathname}${location.state.from.search || ''}`
                : "/"
            navigate(destination, { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-5 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 md:p-10">

                {/* Heading */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-black">
                        iStore
                    </Link>

                    <h1 className="text-2xl font-semibold text-gray-900 mt-6">
                        Sign in to iStore.
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Enter your account details to continue.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} noValidate className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={function(event) {
                                setUsername(event.target.value)
                                if (fieldErrors.username) {
                                    setFieldErrors(function(prev) {
                                        return { ...prev, username: '' }
                                    })
                                }
                            }}
                            onBlur={function() {
                                if (!username.trim()) {
                                    setFieldErrors(function(prev) {
                                        return { ...prev, username: 'Please enter your username.' }
                                    })
                                }
                            }}
                            className={`w-full border rounded-xl px-4 py-3 outline-none transition ${
                                fieldErrors.username
                                    ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900 placeholder:text-red-300'
                                    : 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5'
                            }`}
                        />

                        {fieldErrors.username && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{fieldErrors.username}</span>
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
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
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
                                className={`w-full border rounded-xl px-4 py-3 pr-12 outline-none transition ${
                                    fieldErrors.password
                                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900 placeholder:text-red-300'
                                        : 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={function() { setShowPassword(!showPassword) }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-900"
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

                    {/* Error / Blocked Message */}
                    {(blockedMessage || error) && (
                        <div className="flex items-start gap-3 rounded-2xl bg-red-50/90 border border-red-200/80 p-4 text-sm text-red-700">
                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                            <div className="font-medium leading-relaxed">
                                {blockedMessage || error}
                            </div>
                        </div>
                    )}

                    {registrationSuccess && (
                        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 text-sm text-emerald-800">
                            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                            <div className="font-medium leading-relaxed">
                                Account created successfully. Sign in to continue.
                            </div>
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0071e3] text-white rounded-full py-3 font-medium hover:bg-[#0077ed] transition disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-7">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-[#0071e3] font-medium ml-1 hover:underline"
                    >
                        Create Account
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login
