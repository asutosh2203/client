import Head from 'next/head'
import React from 'react'
import { Spinner } from '.'

const AuthLoading: React.FC<{ title: string; message?: string }> = ({
  title,
  message,
}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Head>
        <title>{title}</title>
      </Head>
      <Spinner message={message} />
    </div>
  )
}

export default AuthLoading
