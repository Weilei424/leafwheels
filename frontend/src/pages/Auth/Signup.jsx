import { useState } from "react";
import { Link } from "react-router-dom";
import {useUserStore} from "../../stores/useUserStore.js";
const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

        const { signup, loading } = useUserStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        const {firstName, lastName, email, password, confirmPassword} = formData
        signup(firstName, lastName, email, password, confirmPassword)
    };

    return (
        // Full screen container with light blue background
        <div className='min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4'>

            {/* Main content container - max width and centered */}
            <div className='max-w-md w-full'>

                {/* Header section */}
                <div className='text-center mb-10'>
                    <h2 className='text-3xl font-bold text-gray-900'>Create Account</h2>
                    <p className='text-gray-600 mt-3'>Join us today</p>
                </div>

                {/* White form container with shadow */}
                <div className='bg-white p-10 rounded-xl shadow-md border border-gray-100'>

                    <form onSubmit={handleSubmit} className='space-y-5'>

                        {/* Name field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                First Name
                            </label>
                            <input
                                type='text'
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='John Doe'
                            />
                        </div>

                        {/* Name field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Last Name
                            </label>
                            <input
                                type='text'
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='John Doe'
                            />
                        </div>

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
                                placeholder='john@example.com'
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

                        {/* Confirm Password field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='••••••••'
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium'
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

                    {/* Login link */}
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Already have an account?{" "}
                        <Link to='/login' className='text-blue-600 hover:text-blue-500 font-medium'>
                            Sign in here
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default SignUpPage;