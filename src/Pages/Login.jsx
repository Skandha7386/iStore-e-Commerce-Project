
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { addToCart } from '../Redux/cartSlice'
import { loginUser } from '../Redux/authSlice'

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const registrationSuccess = location.state?.registered === true
    const { error, isLoading } = useSelector(function(state) {
        return state.auth
    })

    async function handleLogin(event) {

        event.preventDefault()

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

                <form onSubmit={handleLogin} className="space-y-5">

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
                            }}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                        />

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
                                }}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:border-black"
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

                    </div>


                    {/* Error Message */}

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {registrationSuccess && (
                        <p role="status" className="text-sm text-green-700">
                            Account created successfully. Sign in to continue.
                        </p>
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
