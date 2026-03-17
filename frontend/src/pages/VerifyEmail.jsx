import React from 'react'

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl text-white text-center">
        
        <h1 className="text-3xl font-bold mb-4 tracking-wide">
          Verify Your Email
        </h1>

        <p className="text-sm opacity-90 leading-relaxed">
          We’ve sent a verification link to your email address.  
          Please check your inbox and click the link to activate your account.
        </p>

      </div>

    </div>
  )
}

export default VerifyEmail