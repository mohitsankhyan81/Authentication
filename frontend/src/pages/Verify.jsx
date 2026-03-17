import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios"

const Verify = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [status, setstatus] = useState("Verifying...")

  useEffect(() => {
    const emailverify = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3455/api/user/verification",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        )

        if (res.data.success) {
          setstatus("Email verified successfully 🎉")

          setTimeout(() => {
            navigate("/login")
          }, 3000)

        } else {
          setstatus("Invalid or expired token ❌")
        }

      } catch (error) {
        console.log(error)
        setstatus("Verification failed. Please try again ❌")
      }
    }

    emailverify()
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl text-white text-center">
        
        <h1 className="text-2xl font-semibold tracking-wide">
          {status}
        </h1>

        <p className="text-sm opacity-80 mt-3">
          You will be redirected shortly...
        </p>

      </div>

    </div>
  )
}

export default Verify