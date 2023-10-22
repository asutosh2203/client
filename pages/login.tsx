import GoogleLogin from 'react-google-login'
import { client } from '../sanityClient'
import { useRouter } from 'next/router'
import { userProfile } from '../typings'
import Head from 'next/head'

const login = () => {
  const router = useRouter()

  const responseGoogle = (response: any) => {
    const userProfile: userProfile = response.profileObj
    localStorage.setItem('user', JSON.stringify(userProfile))
    const { googleId, name, email } = userProfile
    const doc = {
      _id: googleId,
      _type: 'author',
      name,
      email,
    }
    client
      .createIfNotExists(doc)
      .then((data) => {
        router.replace('/')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <Head>
        <title>Login to Medium</title>
      </Head>
      <div className=" relative w-full h-full">
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={
                '183825655660-caa49ujgf0f4uca82n01vad6lubpn32m.apps.googleusercontent.com'
              }
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default login
