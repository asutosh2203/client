import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../sanityClient'

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    console.log({ _id, name, email, comment })
    await client
      .create({
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: _id,
        },
        name,
        email,
        comment,
      })
      .then((data) => console.log(data))
  } catch (err) {
    return res.status(500).json({ message: "Couldn't Submit Comment", err })
  }

  res.status(200).json({ message: 'Comment Submitted' })
}
