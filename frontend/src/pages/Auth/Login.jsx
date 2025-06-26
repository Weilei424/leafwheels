import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    // const { login, loading } = useUserStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // login(formData);
    };

    return (
        // Full screen container with light blue background
        <div className='min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4'>

            {/* Main content container - max width and centered */}
            <div className='max-w-md w-full'>

                {/* Header section */}
                <div className='text-center mb-10'>
                    <h2 className='text-3xl font-bold text-gray-900'>Welcome Back</h2>
                    <p className='text-gray-600 mt-3'>Sign in to your account</p>
                </div>

                {/* White form container with shadow */}
                <div className='bg-white p-10 rounded-xl shadow-md border border-gray-100'>

                    <form onSubmit={handleSubmit} className='space-y-5'>

                        {/* Email field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='you@example.com'
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Password
                            </label>
                            <input
                                type='password'
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='••••••••'
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium'
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    {/* Signup link */}
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Don't have an account?{" "}
                        <Link to='/signup' className='text-blue-600 hover:text-blue-500 font-medium'>
                            Create one here
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;