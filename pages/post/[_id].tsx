import { GetStaticProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { Header, Responses } from '../../components';
import { client, urlFor } from '../../sanityClient';
import { Author, Post } from '../../typings';
import { fetchPost } from '../../utils/sanityQueries';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { shortMonths } from '../../utils/time';
import { RiMailCheckLine } from 'react-icons/ri';
import {
  AiOutlineComment,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineCheck,
} from 'react-icons/ai';
import { MdOutlineClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface InputForm {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const [user, setUser] = useState<any>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [toggleResponse, setToggleResponse] = useState<boolean>(false);
  const [commentBoxRows, setCommentBoxRows] = useState<number>(1);

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        if (session.user?.id)
          client
            .fetch(`*[_type == "author" && _id=='${session.user.id}']`)
            .then((data:[Author]) => {
              if (data[0]) {
                setUser(data[0]);
              } else setUser(session.user);
            });
      }
    });
  }, []);

  const alreadyLiked = !!post.appreciatedBy?.filter(
    (item: any) => item?.userId === user?._id
  ).length;

  const alreadyFollowing =
    !!post.author.followers?.filter((item: any) => item?._ref === user?._id)
      .length &&
    !!user?.followings?.filter((item: any) => item?._ref === post.author._id)
      .length;

  const followAuthor = () => {
    if (!user) return;

    if (alreadyFollowing) return;

    client
      .patch(post.author._id)
      .setIfMissing({ followers: [] })
      .insert('after', 'followers[-1]', [
        {
          _key: uuidv4(),
          _ref: user._id,
        },
      ])
      .commit()
      .then(() => {});
    client
      .patch(user._id)
      .setIfMissing({ followings: [] })
      .insert('after', 'followings[-1]', [
        {
          _key: uuidv4(),
          _ref: post.author._id,
        },
      ])
      .commit()
      .then(() => {
        window.location.reload();
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>();

  const onSubmit: SubmitHandler<InputForm> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data), 
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        console.error(err);
        setSubmitted(false);
      });
  };

  const router = useRouter();

  return (
    <main className='mx-auto no-scrollbar'>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Header />
      {toggleResponse && (
        <div className='w-1/6 min-w-[300px] fixed bg-white h-screen overflow-y-auto shadow-md z-50 animate-slide-in fullWidth'>
          <div className='absolute w-full flex justify-end items-center mt-7 px-3 '>
            <MdOutlineClose
              fontSize={25}
              className='cursor-pointer'
              onClick={() => setToggleResponse(false)}
            />
          </div>
          <Responses post={post} isLoggedIn={!!user} />
        </div>
      )}
      {post.mainImage && (
        <img
          className='w-full max-w-[2100px] mx-auto object-cover h-96 drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]'
          src={urlFor(post.mainImage).url()!}
          alt=''
        />
      )}

      <article className='max-w-3xl mx-auto p-5 relative'>
        <div className='absolute -left-56 top-16 w-48 hideProfile'>
          <Link href={`/user/${post.author._id}`}>
            <img
              src={
                post.author.profile
                  ? urlFor(post.author.profile).url()
                  : post.author.imageUrl
              }
              alt=''
              className='h-28 w-28 rounded-full cursor-pointer object-cover'
            />
          </Link>

          <p
            onClick={(e) => {
              e.preventDefault();
              router.push(`/user/${post.author._id}`);
            }}
            className='pt-4 font-semibold cursor-pointer'
          >
            {post.author.name}
          </p>
          <div
            onClick={(e) => {
              e.preventDefault();
              router.push(`/user/${post.author._id}`);
            }}
            className='flex items-center'
          >
            <span className='pb-2 text-gray-400 cursor-pointer text-sm'>@</span>
            <p className='pb-2 text-gray-400 cursor-pointer text-sm hover:underline underline-offset-2'>
              {post.author.username}
            </p>
          </div>
          <p className='text-gray-400 font-light pb-3'>{post.author.bio}</p>

          {user ? (
            <div>
              {post.author._id !== user?._id && (
                <div className='flex items-center mb-4 text-sm'>
                  <button
                    onClick={followAuthor}
                    className='hover:bg-green-700 transition-all duration-150 mr-4 h-[2.25rem] px-4 rounded-full font-semibold bg-green-600 text-white'
                  >
                    {alreadyFollowing ? (
                      <p className='flex space-x-1 items-center'>
                        <AiOutlineCheck size={'1.25em'} />{' '}
                        <span>Following</span>
                      </p>
                    ) : (
                      <p>Follow</p>
                    )}
                  </button>
                  <button className='hover:bg-green-700 transition-all duration-150 mr-4 h-[2.25rem] w-[2.25rem] text-lg rounded-full bg-green-600 text-white'>
                    <RiMailCheckLine className='mx-auto' />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                signIn('google');
              }}
              className='hover:bg-green-700 transition-all duration-150  mb-4 py-2 px-4 rounded-full font-semibold bg-green-600 text-white'
            >
              Login to follow
            </button>
          )}
          <hr />
          <div className='flex items-center space-x-8'>
            <p className='flex items-center mt-5 text-gray-400 cursor-pointer hover:text-gray-500 w-fit'>
              <AiOutlineComment
                onClick={() => {
                  setToggleResponse(!toggleResponse);
                }}
                className='text-2xl mr-2'
              />
              {post.comments?.length}
            </p>
            {user && (
              <p className='flex items-center mt-5 text-gray-400 cursor-pointer hover:text-gray-500 w-fit'>
                {alreadyLiked ? (
                  <p className='flex items-center'>
                    <AiFillHeart className='text-xl mr-2 text-gray-800' />
                  </p>
                ) : (
                  <AiOutlineHeart
                    onClick={() => {
                      // appreciatePost(post._id)
                    }}
                    className='text-2xl mr-2'
                  />
                )}
                <span>{post?.appreciatedBy?.length}</span>
              </p>
            )}
          </div>
        </div>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>
          {post.description}
        </h2>
        <div className='flex items-center space-x-2'>
          <p className='font-extralight text-sm'>
            By{' '}
            <span
              className='text-green-600 cursor-pointer hover:underline underline-offset-2'
              onClick={() => {
                router.push(`/user/${post.author._id}`);
              }}
            >
              {post.author.name}
            </span>{' '}
            - Published on{' '}
            {`${
              shortMonths[new Date(post._createdAt).getUTCMonth()]
            } ${new Date(post._createdAt).getUTCDate()}, ${new Date(
              post._createdAt
            ).getUTCFullYear()}`}
          </p>
        </div>
        <div className='mt-10'>
          {/* <PortableText
            dataset={'production'}
            projectId={'37yduzme'}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          /> */}
          {post.body.split('\n').map((para: string, index: number) => (
            <p key={index} className='mb-1'>
              {para}
            </p>
          ))}
        </div>
        <div className='flex space-x-6 items-center'>
          <p className='flex items-center mt-5 text-gray-400 cursor-pointer hover:text-gray-500 w-fit'>
            <AiOutlineComment
              onClick={() => {
                setToggleResponse(!toggleResponse);
              }}
              className='mr-2'
              fontSize={30}
            />
            {post.comments?.length}
          </p>
          {user && (
            <p className='flex items-center mt-5 text-gray-400 cursor-pointer hover:text-gray-500 w-fit'>
              {alreadyLiked ? (
                <p className='flex items-center'>
                  <AiFillHeart className='text-xl mr-2 text-gray-800' />
                </p>
              ) : (
                <AiOutlineHeart
                  onClick={() => {
                    // appreciatePost(post._id)
                  }}
                  className='text-2xl mr-2'
                />
              )}
              <span>{post?.appreciatedBy?.length}</span>
            </p>
          )}
        </div>
      </article>
      <hr className='max-w-lg my-5 mx-auto border border-green-500' />

      {user &&
        (submitted ? (
          <div className='flex flex-col p-10 my-10 bg-green-600 text-white max-w-2xl mx-auto'>
            <h3 className='text-3xl font-bold'>Thank you for the comment!</h3>
            <p>Reload the page to see your comment</p>
          </div>
        ) : (
          <div className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register('_id')}
                type='hidden'
                name='_id'
                value={post._id}
              />
              <input
                {...register('name', { required: true })}
                type='hidden'
                value={user?.name}
              />
              <input
                {...register('email', { required: true })}
                type='hidden'
                value={user?.email}
              />

              <div className='block border px-5 py-5 mb-5 rounded-lg shadow-md'>
                <div className='flex items-center space-x-3 mb-4'>
                  <img
                    src={
                      user.profile ? urlFor(user.profile).url() : user.imageUrl
                    }
                    alt='user-logo'
                    className='h-12 w-12 object-cover rounded-full'
                  />
                  <p className='text-gray-600 font-semibold'>{user.name}</p>
                </div>
                <textarea
                  {...register('comment', { required: true })}
                  className='form-textarea mt-1 block w-full outline-none '
                  placeholder='What are your thoughts?'
                  rows={commentBoxRows}
                  onFocus={() => {
                    setCommentBoxRows(4);
                  }}
                  onBlur={() => {
                    setCommentBoxRows(1);
                  }}
                />
                {errors.comment && (
                  <p className='text-red-500 mt-2'>This is a required field.</p>
                )}
              </div>

              <div>
                <input
                  type='submit'
                  className='hover:bg-green-700 transition-all duration-150 mr-4 h-[2.25rem] px-6 rounded-full font-semibold bg-green-600 text-white cursor-pointer'
                />
                {commentBoxRows != 1 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCommentBoxRows(1);
                    }}
                    className='transition-all duration-150 mr-4 h-[2.25rem] px-6 rounded-full font-semibold cursor-pointer border-2 border-gray-400'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ))}
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{_id}`;

  const posts = await client.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      // slug: post.slug.current,
      _id: post._id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = fetchPost;
  const post = await client.fetch(query, {
    // slug: params?.slug,
    _id: params?._id,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //updates the page in every 60 seconds
  };
};
