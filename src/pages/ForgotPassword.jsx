import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter your email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Remembered your password?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
