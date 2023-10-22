export const fetchAllPosts: string = `*[_type == "post"]| order(_createdAt desc){_id, title, author -> {
  name, profile, bio, _id, imageUrl, username, followers
}, description, mainImage, slug}`

export const fetchPost: string = `*[_type == "post" && _id == $_id][0]{
    _id, 
    _createdAt, 
    title, 
    author -> {
    name, profile, bio, _id, imageUrl, username, followers, followings
  },
  "comments": *[
    _type == "comment" && post._ref == ^._id
  ] | order(_createdAt desc),
  description, 
  mainImage, 
  slug, 
  body,
  appreciatedBy
  }`

export const fetchAllAuthors: string = `
*[_type == "author"]{
  _id
}
`
export const fetchUserById = (userId: string) => `
*[_type == "author" && _id=="${userId}"]{
  _id, name, profile, username, imageUrl, bio
}
`
export const fetchUserByName = `*[_type == "author" && (name match $search || username match $search)]{
  _id, name, profile, username, bio, imageUrl
}`
export const fetchAuthor = `
*[_type == "author" && _id == $_id][0]{
  _id, name, profile, username, bio, imageUrl, followers, followings
}
`

export const postsQuery = `*[_type == "post" && author._ref==$_id]{
  _id, 
  _createdAt, 
  title, 
  author -> {
  name, profile, bio, _id, imageUrl, username
},
"comments": *[
  _type == "comment" && post._ref == ^._id
] | order(_createdAt desc),
appreciatedBy,
description,
body
}`

export const postSearchQuery = `*[_type == "post" && (title match $search || description match $search || $search in categories[])]{
  _id, 
  _createdAt, 
  title, 
  author -> {
  name, profile, bio, _id, imageUrl, username
},
"comments": *[
  _type == "comment" && post._ref == ^._id && approved == true
] | order(_createdAt desc),
description,
mainImage,
body
}`