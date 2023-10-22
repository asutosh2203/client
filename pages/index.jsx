import Head from 'next/head'

import { client } from '../sanityClient'
import { fetchAllPosts } from '../utils/sanityQueries'

import { Banner, Header, Posts, SearchBar } from '../components'
import { useState } from 'react'

import { useSelector } from 'react-redux'

export default function Home({ posts }) {
  const searchedPosts = useSelector((state) => state.searchReducer.value.data)
  const searchTerm = useSelector(
    (state) => state.searchReducer.value.searchTerm
  )

  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium 2.0</title>
      </Head>
      <Header />
      <SearchBar />
      {/* {searchTerm && searchedPosts && 
      <div className='shadow-md mb-4 absolute'>
        {searchedPosts.map((post) => <p>{post.title}</p>)}
      </div>
      } */}
      <Banner
        heading='Medium is a place to read, write and connect'
        subHeading="It's easy and free to post your thinking on any topic and connect with millions of readers."
      />
      <Posts posts={posts} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const posts = await client.fetch(fetchAllPosts)

  return {
    props: {
      posts,
    },
  }
}
