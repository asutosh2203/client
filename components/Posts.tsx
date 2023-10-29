import Link from 'next/link';
import { urlFor } from '../sanityClient';
import { Post } from '../typings';

const Posts: React.FC<{ posts: [Post] | []; onFollowingPage?: boolean }> = ({
  posts = [],
  onFollowingPage,
}) => {
  if (!posts.length) {
    return (
      <div className='max-w-7xl mx-auto'>
        <div className='text-center'>
          {!onFollowingPage ? (
            <>
              <h2 className='text-3xl font-bold my-4'>No posts yet</h2>
              <p className='text-lg mb-4'>
                You can be the first to post something.
              </p>
              <Link href='/new-story'>
                <a className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                  Be the first author
                </a>
              </Link>
            </>
          ) : (
            <p className='text-lg my-4'>
              No posts to show. Follow someone to populate your feed.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
      {posts.map((post) => {
        return (
          <Link key={post._id} href={`/post/${post._id}`}>
            <div className='border rounded-lg group cursor-pointer overflow-hidden'>
              <img
                className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
                src={
                  post.mainImage
                    ? urlFor(post.mainImage).url()!
                    : 'https://images.yourstory.com/cs/wordpress/2017/02/52-Blog.jpg'
                }
                alt='main-blog-banner'
              />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold max-w-[250px]'>
                    {post.title}
                  </p>
                  {post.description.length > 40 ? (
                    <p className='text-sm font-semibold'>
                      {post.description.substring(0, 40)}...
                    </p>
                  ) : (
                    <p className='text-sm font-semibold'>{post.description}</p>
                  )}

                  <p className='text-xs'>
                    By{' '}
                    <span className='font-semibold'>{post.author?.name}</span>
                  </p>
                </div>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={
                    post.author.profile
                      ? urlFor(post.author.profile).url()
                      : post.author.imageUrl
                  }
                  alt='author-profile'
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Posts;
