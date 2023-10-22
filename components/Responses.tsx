import React from 'react'
import { Post } from '../typings'
import { shortMonths } from '../utils/time'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
const Responses: React.FC<{ post: Post; isLoggedIn: boolean }> = ({
  post,
  isLoggedIn,
}) => {
  return (
    <div className='bg-white w-full overflow-y-scroll h-full no-scrollbar'>
      <h3 className='text-2xl font-semibold px-4 pt-6 pb-4'>
        Responses {post.comments?.length > 0 ? `(${post.comments.length})` : ''}
      </h3>
      <hr className='pb-2' />
      {post.comments?.length > 0 ? (
        post.comments?.map((comment) => (
          <div className='px-4 pb-5' key={comment._id}>
            <div className='flex justify-between'>
              <div>
                <p className='font-semibold'>{comment.name}</p>
                <p className='text-sm text-gray-500'>
                  {`${
                    shortMonths[new Date(post._createdAt).getUTCMonth()]
                  } ${new Date(post._createdAt).getUTCDate()}, ${new Date(
                    post._createdAt
                  ).getUTCFullYear()}`}
                </p>
                <p className='text-sm my-2 max-w-[240px]'>{comment.comment}</p>
              </div>
              <HiDotsHorizontal className='mt-2 cursor-pointer' fontSize={18} />
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className='h-[80%] flex flex-col items-center justify-center p-4'>
          <p className='text-center text-gray-500 italic'>
            There are no responses yet. Be the first one to respond.
          </p>
          {!isLoggedIn && (
            <button
              onClick={() => {
                signIn('google')
              }}
              className='px-4 py-2 flex font-semibold rounded-full m-4 border border-green-600'
            >
              <FcGoogle className='w-6 h-6 mr-2' />
              Login to Respond
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Responses
