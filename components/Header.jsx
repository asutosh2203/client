import Link from 'next/link';
import { useEffect, useState } from 'react';
import Toolbox from './Toolbox';
import SearchBar from './SearchBar';
import { client, urlFor } from '../sanityClient';
import { useSession, signIn, getSession } from 'next-auth/react';
import { fetchUserById } from '../utils/sanityQueries';
import {
  uniqueNamesGenerator,
  Config,
  colors,
  names,
} from 'unique-names-generator';

const Header = ({ isOnAuthorPage, isOnProfile }) => {
  const [showToolbox, setShowToolbox] = useState(false);
  const [user, setUser] = useState();
  const [author, setAuthor] = useState();
  const { status } = useSession();

  const config = {
    dictionaries: [colors, names],
    separator: '',
    style: 'capital',
    length: 2,
  };

  useEffect(() => {
    const userName = `the${uniqueNamesGenerator(config)}`;

    getSession().then((data) => {
      if (data) {
        setUser(data?.user);
        client.createIfNotExists({
          _id: data?.user?.id,
          _type: 'author',
          name: data?.user?.name,
          email: data?.user?.email,
          username: userName,
          imageUrl: data?.user?.image,
        });
        const query = fetchUserById(data?.user?.id);
        client.fetch(query).then((data) => {
          setAuthor(data[0]);
        });
      }
    });
  }, []);

  const alertProgress = () => {
    alert(
      "We know nothing happens when you click there. Don't worry, your mouse is perfectly fine. We're sorry but this feature is still under development. 😅"
    );
  };

  return (
    <header className='flex justify-between items-center p-5 shadow-[0_2px_10px_rgba(0,0,0,0.25)] sticky-header bg-white max-w-[2100px] mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href={'/'}>
          <img
            className='w-44 object-contain cursor-pointer'
            src='https://links.papareact.com/yvf'
            alt='company-logo'
          />
        </Link>
        {isOnAuthorPage && !isOnProfile && (
          <div className='hidden md:inline-flex items-center space-x-5'>
            <h3 onClick={alertProgress} className='cursor-pointer'>
              About
            </h3>
            <h3 onClick={alertProgress} className='cursor-pointer'>
              Contact
            </h3>
            <h3
              onClick={alertProgress}
              className='text-white bg-green-600 px-4 py-1 rounded-full cursor-pointer'
            >
              Follow
            </h3>
          </div>
        )}
      </div>
      <div className='flex items-center space-x-5 text-green-600'>
        <h3 className='border px-4 py-1 rounded-full border-green-600 hover:text-white hover:bg-green-600 cursor-pointer transition-all duration-200 min-w-[120px]'>
          Get Started
        </h3>
        {status === 'authenticated' ? (
          <div className='flex items-center space-x-3 relative'>
            <img
              className='h-10 w-10 rounded-full cursor-pointer object-cover hover:scale-105 transition-all duration-200'
              src={
                author?.profile
                  ? urlFor(author?.profile).url()
                  : author?.imageUrl
              }
              alt='user-logo'
              onClick={() => {
                setShowToolbox(!showToolbox);
              }}
            />
            {showToolbox && <Toolbox author={author} user={user} />}
          </div>
        ) : (
          <h3
            onClick={() => {
              signIn('google');
            }}
            className='cursor-pointer'
          >
            Sign In
          </h3>
        )}
      </div>
    </header>
  );
};

export default Header;
