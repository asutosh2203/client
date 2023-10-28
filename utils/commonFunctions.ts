import { Author } from '../typings';
import { v4 as uuidv4 } from 'uuid';
import { client } from '../sanityClient';

export const followAuthor = (
  user: any,
  alreadyFollowing: boolean,
  author: Author
) => {
  if (!user) return;

  if (alreadyFollowing) return;

  client
    .patch(author._id)
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
        _ref: author._id,
      },
    ])
    .commit()
    .then(() => {
      window.location.reload();
    });
};
