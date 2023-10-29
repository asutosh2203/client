import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: '37yduzme',
  dataset: 'production',
  apiVersion: '2022-03-13',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

export const urlFor = (source) => imageUrlBuilder(client).image(source);