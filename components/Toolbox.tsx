import Link from 'next/link';
import { userProfile } from '../typings';
import { signOut } from 'next-auth/react';
import { urlFor } from '../sanityClient';
import { useRouter } from 'next/router';

const Toolbox: React.FC<{
  user?: userProfile;
  author: any;
}> = ({ user, author }) => {
  const router = useRouter();

  return (
    <div className='flex z-50 flex-col p-5 border border-gray-200 shadow-lg absolute bg-white top-12 min-w-[250px] right-0'>
      <div
        onClick={(e) => {
          e.preventDefault();
          router.push(`/user/${user!.id}`);
        }}
        className='flex items-center space-x-3 mb-5 cursor-pointer'
      >
        {user?.image && (
          <img
            className='w-10 h-10 rounded-full object-cover'
            src={author?.profile ? urlFor(author?.profile).url() : user?.image}
          />
        )}
        <div>
          <p className='text-black  font-semibold'>{author?.name}</p>
          <p className='text-gray-500 hover:underline underline-offset-2'>
            @{author?.username}
          </p>
        </div>
      </div>
      <hr />
      <div className='flex flex-col mt-5'>
        <p
          onClick={(e) => {
            e.preventDefault();
            router.push('/new-story');
          }}
          className='mb-2 cursor-pointer text-gray-500 hover:text-black'
        >
          Write a Story
        </p>
        <p
          className='cursor-pointer text-gray-500 hover:text-black mb-5'
          onClick={(e) => {
            e.preventDefault();
            router.push(`/${user!.id}`);
          }}
        >
          Stories
        </p>
      </div>
      <hr />
      <p className='text-gray-500 hover:text-black cursor-pointer mt-5 mb-2'>
        Settings
      </p>
      <p
        onClick={(e) => {
          e.preventDefault();
          router.push('/user/edit-profile');
        }}
        className='text-gray-500 hover:text-black cursor-pointer mb-5'
      >
        Edit Profile
      </p>
      <hr />
      <p
        onClick={() => {
          signOut({ callbackUrl: '/' });
        }}
        className='text-red-500 hover:text-red-600 cursor-pointer mt-5 font-semibold'
      >
        Sign out
      </p>
    </div>
  );
};

export default Toolbox;
