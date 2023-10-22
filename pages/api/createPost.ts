import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../sanityClient'

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, story, desc, slug, id, contentImage } = JSON.parse(req.body)
  const data = JSON.parse(req.body)
  console.log(data)

  client
    .create({
      _type: 'post',
      title,
      description: desc,
      body: story,
      slug: slug,
      author: {
        _type: 'reference',
        _ref: id,
      },
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: contentImage._id,
        },
      },
    })
    .then((data) => {
      res.status(200).json({ message: 'Post Submitted' })
    })
    .catch((err) => {
      return res.status(500).json({ message: "Couldn't Submit Post", err })
    })
}
