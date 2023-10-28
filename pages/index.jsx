import Head from 'next/head';

import { client } from '../sanityClient';
import {
  fetchAllPosts,
  fetchAllFollowing,
  fetchAllFollowedPosts,
} from '../utils/sanityQueries';

import { Banner, Header, Posts, SearchBar } from '../components';
import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { getSession, signIn } from 'next-auth/react';

export default function Home({ posts }) {
  const searchedPosts = useSelector((state) => state.searchReducer.value.data);
  const searchTerm = useSelector(
    (state) => state.searchReducer.value.searchTerm
  );
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUser(session.user);

        client
          .fetch(fetchAllFollowing, {
            _id: session.user.id,
          })
          .then((user) => setFollowing(user.followings));

        following.length > 0 &&
          client
            .fetch(fetchAllFollowedPosts(following))
            .then((posts) => setFollowedPosts(posts));
      }
    });
  }, [following.length]);

  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium 2.0</title>
      </Head>
      <Header />
      {/* <SearchBar />
      {searchTerm && searchedPosts && 
      <div className='shadow-md mb-4 absolute'>
        {searchedPosts.map((post) => <p>{post.title}</p>)}
      </div>
      } */}
      <Banner
        heading="'Medium is a place to read, write and connect'"
        subHeading="It's easy and free to post your thinking on any topic and connect with millions of readers."
      />
      <Posts posts={followedPosts} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const posts = await client.fetch(fetchAllPosts);

  return {
    props: {
      posts,
    },
  };
};
