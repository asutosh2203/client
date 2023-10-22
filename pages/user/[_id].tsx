import { client, urlFor } from '../../sanityClient';
import { GetStaticProps } from 'next';
import { Author, Post } from '../../typings';
import { fetchAuthor } from '../../utils/sanityQueries';
import Head from 'next/head';
import { Header } from '../../components';
import { longMonths } from '../../utils/time';
import { useRouter } from 'next/router';
import { AiOutlineComment, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { postsQuery } from '../../utils/sanityQueries';
import { useSession } from 'next-auth/react';
import { AuthLoading, Unauth } from '../../components';
import Link from 'next/link';

const User: React.FC<{ author: Author; postsByAuthor: [Post] }> = ({
  author,
  postsByAuthor,
}) => {
  const router = useRouter();

  const { status, data } = useSession();

  if (status === 'loading') return <AuthLoading title='Profile' />;
  if (status === 'unauthenticated') return <Unauth />;

  return (
    <div>
      <Head>
        <title>@{author.username}</title>
      </Head>
      <Header isOnAuthorPage />
      <div className='max-w-3xl mx-auto p-5 relative'>
        <div className='absolute -left-56 top-16 w-48 hideProfile'>
          <img
            src={
              author.profile ? urlFor(author.profile).url() : author?.imageUrl
            }
            alt=''
            className='h-28 w-28 rounded-full object-cover'
          />

          <p className='pt-4 pb-2 font-semibold cursor-default'>
            {author.name}
          </p>
          <p className='text-gray-400 font-light pb-3 cursor-default'>
            {author.bio}
          </p>
          <p className='flex gap-3'>
            <p>{author.followers ? author.followers.length : 0} Followers</p>
            <p> {author.followings ? author.followings.length : 0} Following</p>
          </p>
        </div>
        {postsByAuthor.length <= 0 && (
          <div className='max-w-7xl mx-auto'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold my-4'>No posts yet</h2>
              <p className='text-lg mb-4'>Express yourself to the world</p>
              <Link href='/new-story'>
                <p className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                  Write a Story
                </p>
              </Link>
            </div>
          </div>
        )}
        {postsByAuthor.map((post, index) => {
          return (
            <div key={index} className='mb-10'>
              <p className='font-extralight text-sm text-gray-500'>
                {`${
                  longMonths[new Date(post._createdAt).getUTCMonth()]
                } ${new Date(post._createdAt).getUTCDate()}, ${new Date(
                  post._createdAt
                ).getUTCFullYear()}`}
              </p>
              <h1 className='text-4xl my-3 font-bold'>{post.title}</h1>
              <h2 className='text-lg font-light text-gray-500 mb-2'>
                {post.description}
              </h2>

              <p
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/post/${post._id}`);
                }}
                className='text-green-600 mt-4 text-sm cursor-pointer hover:text-green-700'
              >
                Read complete story
              </p>
              <div className='flex gap-3'>
                <p className='flex items-center text-gray-400 mt-4'>
                  <AiOutlineComment fontSize={24} className='mr-2' />
                  {post.comments?.length}
                </p>
                <p className='flex items-center text-gray-400 mt-4'>
                  {!!post.appreciatedBy?.filter(
                    (appreciator: any) => appreciator._ref === data?.user?.id
                  ).length ? (
                    <AiFillHeart fontSize={24} className='mr-2' />
                  ) : (
                    <AiOutlineHeart fontSize={24} className='mr-2' />
                  )}
                  {post.appreciatedBy ? post.appreciatedBy.length : 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default User;

export const getStaticPaths = async () => {
  const query = `*[_type == "author"]{_id}`;

  const authors = await client.fetch(query);

  const paths = authors.map((author: Author) => ({
    params: {
      _id: author._id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = fetchAuthor;
  const author = await client.fetch(query, {
    _id: params?._id,
  });

  // const postsQuery = `*[_type == "post" && author._ref=="${params?._id}"]`
  const postsByAuthor = await client.fetch(postsQuery, {
    _id: params?._id,
  });

  if (!author) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      author,
      postsByAuthor,
    },
    revalidate: 60, //updates the page in every 60 seconds
  };
};
