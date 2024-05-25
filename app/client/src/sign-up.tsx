import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { auth, googleProvider } from './firebase'
import Logo from './assets/primeshopperBlack.png'
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

const Login: React.FC = () => {
  const history = useHistory()
  const location = useLocation<{ from: string } | undefined>()
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailUp, setEmialUp] = useState('')
  const [passwordUp, setPasswordUp] = useState('')
  const [userName, setUserName] = useState('')

  const singUpWithPassword = async () => {
    setPasswordLoading(true)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailUp,
      passwordUp
    )

    updateProfile(userCredential.user, {
      displayName: userName,
    })
      .then(() => {
        setPasswordLoading(false)
        const redirectPath = location.state?.from || '/'
        history.push(redirectPath)
      })
      .catch((error) => {
        setPasswordLoading(false)
        setError(error.message)
      })
  }

  const signInWithGoogle = () => {
    setGoogleLoading(true)
    signInWithPopup(auth, googleProvider)
      .then(() => {
        setGoogleLoading(false)
        const redirectPath = location.state?.from || '/'
        history.push(redirectPath)
      })
      .catch((error: any) => {
        setGoogleLoading(false)
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
        <img className="w-[150px] my-[20px] object-contain" src={Logo} alt="" />
      </Link>

      <div className="w-[300px] h-fit p-[20px] mb-7 border-[1px] border-gray-300 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-3">Sign Up</h1>
        <form className="w-full flex flex-col items-center mb-7">
          <div className="w-full h-full">
            <label htmlFor="userName">Full Name</label>
            <input
              id="userName"
              type="email"
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-2 py-1 outline-none border border-gray-300 rounded-sm "
            />
          </div>
          <div className="w-full h-full">
            <label htmlFor="signUpEmail">Email</label>
            <input
              id="signUpEmail"
              type="email"
              onChange={(e) => setEmialUp(e.target.value)}
              className="w-full px-2 py-1 outline-none border border-gray-300 rounded-sm "
            />
          </div>
          <div className="w-full h-full my-2">
            <label htmlFor="signUpPassword">Password</label>
            <input
              id="signUpPassword"
              type="password"
              onChange={(e) => setPasswordUp(e.target.value)}
              className="w-full px-2 py-1 border outline-none border-gray-300 rounded-sm"
            />
          </div>
          <p className="mb-1 mt-2 text-xs font-medium">
            By signing up you agree with PrimeShopper&apos;s Condition of Use
            and Sales. Please see our Condition Notice, our Cookies Notice and
            out Interest-Based Ads Notice
          </p>
          <button
            className={`button w-full ${
              passwordLoading ||
              (googleLoading &&
                'from-gray-300 to-gray-500 text-white active:from-gray-300 active:to-gray-500 focus:ring-0')
            }`}
            disabled={passwordLoading || googleLoading}
            onClick={singUpWithPassword}
          >
            {passwordLoading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className="w-full relative">
          <div className="border border-gray-300"></div>
          <p className="px-2 py-1 ml-[-15px] bg-white absolute left-1/2 top-[-15px] text-sm text-gray-400 font-semibold">
            OR
          </p>
        </div>
        <button
          className={`button w-full mt-5 ${
            passwordLoading ||
            (googleLoading &&
              'from-gray-300 to-gray-500 text-white active:from-gray-300 active:to-gray-500 focus:ring-0')
          }`}
          disabled={passwordLoading || googleLoading}
          onClick={signInWithGoogle}
        >
          {googleLoading ? 'Loading...' : 'Sign in with Google'}
        </button>
        <p className="w-full mt-5 text-sm text-right">
          <span>Have account already?</span>
          <span>
            <button
              onClick={() => history.push('/login')}
              className="text-blue-500 ml-1"
            >
              Sign In.
            </button>
          </span>
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
