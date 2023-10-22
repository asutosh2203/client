import Head from 'next/head'
import { useSession, getSession } from 'next-auth/react'
import { Unauth, AuthLoading, Spinner } from '../components'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Header } from '../components'
import { client } from '../sanityClient'
import { SanityImageAssetDocument } from '@sanity/client'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useToaster from '../utils/toaster'

const newStory = () => {
  const [user, setUser] = useState<any>()
  const [content, setContent] = useState<{
    title: string
    story: string
    desc: string
  }>({
    title: '',
    story: '',
    desc: '',
  })
  const [contentImage, setContentImage] =
    useState<SanityImageAssetDocument | null>()
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUser(session.user)
      }
    })
  }, [])

  const { status } = useSession()

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { type, name } = e.target.files![0]

    if (type.match(/image.*/)) {
      setImageLoading(true)
      client.assets
        .upload('image', e.target.files![0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setContentImage(document)
          setImageLoading(false)
        })
        .catch((error) => {
          console.error('Image Upload Error', error)
        })
    } else {
      setImageError(true)
    }
  }

  const publishStory = () => {
    let slug = ''

    if (content.title && content.story && user) {
      slug = content.title.toLowerCase().replace(/\s/g, '-')
      fetch('/api/createPost', {
        method: 'POST',
        body: JSON.stringify({
          ...content,
          slug,
          ...user,
          contentImage,
        }),
      })
        .then(() => {
          router.replace('/')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      useToaster('error', 'Please fill in all fields')
    }
  }

  if (status === 'loading') return <AuthLoading title='New Story' />
  else if (status === 'unauthenticated') return <Unauth />
  else
    return (
      <div className='max-w-7xl mx-auto'>
        <ToastContainer theme='colored' />
        <Header />
        <div className='my-4 mx-2 flex items-center justify-between'>
          <p>
            By{' '}
            <span
              className='text-green-600 hover:underline underline-offset-2 cursor-pointer hover:text-green-800 mb-5'
              onClick={() => {
                router.push(`/user/${user?.id}`)
              }}
            >
              {user?.name}
            </span>
          </p>
          <button
            onClick={publishStory}
            className='px-4 py-2 font-semibold rounded-full bg-green-600 text-white'
          >
            Publish
          </button>
        </div>
        <div className='mx-auto max-w-4xl h-screen flex flex-col items-center'>
          <Head>
            <title>New Story</title>
          </Head>
          <div>
            {!contentImage ? (
              <label>
                <div className='flex flex-col justify-center items-center cursor-pointer border  border-dashed border-black p-5 h-[30rem] w-[40rem] bg-gray-100'>
                  {imageLoading ? (
                    <Spinner message='Uploading' />
                  ) : (
                    <div>
                      <div className='flex flex-col justify-center items-center'>
                        <p className='font-bold text-2xl'>
                          <AiOutlineCloudUpload />
                        </p>
                        <p className='text-lg'>Upload your cover photo</p>
                      </div>
                      <p className='mt-32 text-center text-gray-400'>
                        This appears on the top of your story.
                        <br />
                        Recommendation: Use high-quality JPEG, SVG, PNG, GIF or
                        TIFF
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type={'file'}
                  name='upload-image'
                  className='w-0 h-0'
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <div className='relative h-full bg-gray-100 border border-dashed border-black'>
                <img
                  src={contentImage?.url}
                  alt='uploaded-pic'
                  className='h-[30rem] w-[40rem] object-contain'
                />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-2 rounded-full bg-black text-xl cursor-pointer outline-none hove:shadow-xl hover:scale-110 transition-all duration-100 ease-in-out'
                  onClick={() => {
                    setContentImage(null)
                  }}
                >
                  <MdDelete color='red' />
                </button>
              </div>
            )}
          </div>
          <div className='w-full flex items-center my-10'>
            {!!content.title && <p className='text-gray-500 mr-2'>Title</p>}
            <input
              placeholder='Title'
              className='w-full px-4 py-2 text-4xl font-semibold outline-none'
              type='text'
              value={content.title}
              onChange={(e) => {
                setContent({ ...content, title: e.target.value })
              }}
            />
          </div>
          <div className='w-full flex items-center'>
            {!!content.desc && (
              <p className='text-gray-500 mr-2'>Description</p>
            )}
            <input
              placeholder='Short Description'
              className='w-full px-4 py-2 text-2xl font-semibold outline-none'
              type='text'
              value={content.desc}
              onChange={(e) => {
                setContent({ ...content, desc: e.target.value })
              }}
            />
          </div>
          <div className='w-full h-full'>
            <textarea
              placeholder='Tell your story ...'
              className='text-xl w-full px-4 py-2 my-4 h-[80%] outline-none'
              value={content.story}
              onChange={(e) => {
                setContent({ ...content, story: e.target.value })
              }}
            />
          </div>
        </div>
      </div>
    )
}

export default newStory
