
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { registerAccount } from '../Redux/authSlice'

function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error, isLoading } = useSelector(function(state) {
        return state.auth
    })

    async function handleRegister(event) {

        event.preventDefault()

        const result = await dispatch(registerAccount({
            name,
            email,
            username,
            password,
            confirmPassword
        }))

        if (registerAccount.fulfilled.match(result)) {
            navigate('/login', { replace: true, state: { registered: true } })
        }

    }

    return (

        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-5 py-12">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 md:p-10">

                <div className="text-center mb-8">

                    <Link to="/" className="text-3xl font-bold text-black">
                        iStore
                    </Link>

                    <h1 className="text-2xl font-semibold text-gray-900 mt-6">
                        Create your account.
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Join iStore and explore our products.
                    </p>

                </div>

                <form onSubmit={handleRegister} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={function(event) {
                                setName(event.target.value)
                            }}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={function(event) {
                                setEmail(event.target.value)
                            }}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={function(event) {
                                setUsername(event.target.value)
                            }}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={function(event) {
                                    setConfirmPassword(event.target.value)
                                }}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:border-black"
                            />
                            <button
                                type="button"
                                onClick={function() { setShowConfirmPassword(!showConfirmPassword) }}
                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                aria-pressed={showConfirmPassword}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-900"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0071e3] text-white rounded-full py-3 font-medium hover:bg-[#0077ed] transition disabled:opacity-50"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-7">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-[#0071e3] font-medium ml-1 hover:underline"
                    >
                        Sign in
                    </Link>

                </p>

            </div>

        </div>

    )

}

export default Register
