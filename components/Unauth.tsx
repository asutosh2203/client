import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { FcGoogle } from 'react-icons/fc'

const Unauth = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Head>
        <title>Sign In</title>
      </Head>
      <p className="font-bold text-2xl">
        You need to sign in to access this page
      </p>
      <button
        onClick={() => {
          signIn('google')
        }}
        className="m-5 px-4 py-2 flex items-center space-x-3 border-2 rounded-full w-fit font-semibold border-slate-400"
      >
        <FcGoogle fontSize={28} />
        <p>Sign In With Google</p>
      </button>
    </div>
  )
}

export default Unauth
