import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../sanityClient'

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, bio, username } = JSON.parse(req.body)

  client
    .patch(_id)
    .set({
      name,
      bio,
      username,
    })
    .commit()
    .then(() => {
      res.status(200).json({ message: 'Profile Edited' })
    })
    .catch((err) => {
      return res.status(500).json({ message: "Couldn't Edit Profile:", err })
    })
}
