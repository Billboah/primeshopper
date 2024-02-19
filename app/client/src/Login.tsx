import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { auth, googleProvider } from './firebase'
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'

const Login: React.FC = () => {
  const history = useHistory()
  const location = useLocation<{ from: string } | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      const redirectPath = location.state?.from || '/'
      if (user) {
        history.push(redirectPath)
      }
    })
  }, [])

  const signIn = () => {
    setLoading(true)
    signInWithPopup(auth, googleProvider).catch((error: any) => {
      setLoading(false)
      setError(error.message)
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  return (
    <div className="flex-1 h-full bg-white flex flex-col items-center min-w-[380px]">
      <Link to="/">
        <img
          className="w-[150px] my-[20px] object-contain"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png"
          alt=""
        />
      </Link>

      <div className="w-[300px] h-fit p-[20px] border-[1px] border-gray-300 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-3">Sign in</h1>

        <button
          className={`${
            loading
              ? 'button  w-full mt-[10px]'
              : 'from-gray-300 to-gray-500 border-gray-200 text-gray-100 cursor-not-allowed active:from-gray-300 active:to-gray-500 focus:ring-0'
          }`}
          disabled={loading}
          onClick={signIn}
        >
          {loading ? 'Loading...' : 'Sign in with Google'}
        </button>
        <p className="mt-[15px] text-xs font-medium">
          By signing-in you agree with Amazone&apos;s Condition of Use and
          Sales. Please see our Condition Notice, our Cookies Notice and out
          Interest-Based Ads Notice
        </p>
      </div>
      <button
        onClick={() => setError('')}
        className={`${
          !error ? 'hidden' : 'animate__fadeInUp'
        } cursor-default animate__animated animate__delay-300ms absolute  bottom-[20px] flex h-fit w-full items-center justify-center p-[10px] `}
      >
        <div className="flex h-fit w-full max-w-[500px] items-center justify-center rounded border border-inherit bg-red-500 px-1 py-2 text-white shadow-lg">
          <p className="text-center font-semibold">{error}</p>
        </div>
      </button>
    </div>
  )
}

export default Login
