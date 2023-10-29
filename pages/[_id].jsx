import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AuthLoading, Header, Posts, Unauth } from '../components';
import Head from 'next/head';
import { client } from '../sanityClient';
import {
  fetchAllFollowedPosts,
  fetchAllFollowing,
} from '../utils/sanityQueries';

import Link from 'next/link';

const UserId = ({ followedPosts = [] }) => {
  const { status, data } = useSession();
  const params = useRouter().query;

  if (status === 'loading')
    return <AuthLoading message='Please wait while we get your interests' />;
  if (status === 'unauthenticated') return <Unauth />;

  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Your Stories</title>
      </Head>
      <Header />
      {data.user?.id === params._id ? (
        <Posts posts={followedPosts} onFollowingPage />
      ) : (
        <div className='text-center mt-5 text-xl italic'>
          <p>You cannot get there from here.</p>
          To view your stories, click{' '}
          <Link href={`${data.user?.id}`}>
            <p className='underline text-yellow-400 cursor-pointer'>Here</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "author"]{_id}`;

  const authors = await client.fetch(query);

  const paths = authors.map((author) => ({
    params: {
      _id: author._id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const followedUsers = await client.fetch(fetchAllFollowing, {
    _id: params?._id,
  });

  let followedPosts = [];

  if (followedUsers.followings && followedUsers.followings.length > 0)
    followedPosts = await client.fetch(
      fetchAllFollowedPosts(followedUsers.followings)
    );

  return {
    props: {
      followedPosts,
    },
    revalidate: 60 * 15, // refetches data every 15 minutes
  };
};

export default UserId;
