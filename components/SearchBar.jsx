import React, { useState } from 'react';
import Link from 'next/link';
import { client } from '../sanityClient';
import { postSearchQuery, fetchUserByName } from '../utils/sanityQueries';
import { useDispatch } from 'react-redux';
import { setSearchData, setSearchTerm } from '../features/postSearch';
const SearchBar = () => {
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  var dropdown = posts.length > 0 || authors.length > 0;
  const dispatch = useDispatch();
  const search = (searchTerm) => {
    client
      .fetch(postSearchQuery, {
        search: searchTerm,
      })
      .then((searchedPosts) => {
        dispatch(setSearchData({ searchTerm, data: searchedPosts }));
        setPosts(searchedPosts);
      });

    client
      .fetch(fetchUserByName, { search: searchTerm })
      .then((searchedAuthors) => {
        setAuthors(searchedAuthors);
      });
  };

  const debouncer = (func, delay) => {
    let timer;
    return function (searchTerm) {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const delayedSearch = debouncer(search, 500);

  return (
    <div className='flex flex-col items-center'>
      <input
        className='border border-gray-400 m-4 py-2 px-4 w-full rounded-full outline-none focus-within:border-black'
        type='text'
        placeholder='Search'
        onChange={(e) => {
          delayedSearch(e.target.value.toLowerCase());
        }}
      />
      {dropdown && (
        <div className='fixed bg-white shadow-2xl top-32 m-4 py-2 px-4 w-4/5 max-w-5xl max-h-96 overflow-y-scroll'>
          {posts.length > 0 && (
            <div>
              <p className='font-semibold text-sm uppercase my-3 text-gray-500'>
                Posts
              </p>
              <hr />
              <div>
                {posts.map((post) => (
                  <Link key={post._id} href={`/post/${post._id}`}>
                    <p className='my-2'>{post.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {authors.length > 0 && (
            <div>
              <p className='font-semibold text-sm uppercase my-3 text-gray-500'>
                Authors
              </p>
              <hr />
              <div>
                {authors.map((author) => (
                  <Link key={author._id} href={`/user/${author._id}`}>
                    <p className='my-2'>@{author.username}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
