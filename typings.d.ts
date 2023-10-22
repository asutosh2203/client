export interface userProfile {
  email?: string | null;
  googleId: string;
  image?: string | null;
  name?: string | null;
  bio?: string;
  id: string;
}

export interface Author {
  _id: string;
  bio: string;
  name: string;
  username: string;
  profile: object;
  imageUrl: string;
  followers: Array;
  followings: Array;
}

export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: Author;
  comments: [Comment];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: string;
  appreciatedBy: Array;
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}
