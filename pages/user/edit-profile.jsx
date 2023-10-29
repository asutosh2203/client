import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { AuthLoading, Header, Unauth } from '../../components';
import { fetchUserById } from '../../utils/sanityQueries';
import { client } from '../../sanityClient';
import { Spinner } from '../../components';
import Head from 'next/head';
import { urlFor } from '../../sanityClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useToaster from '../../utils/toaster';
import { MdOutlineFileDownloadDone, MdOutlineFileUpload } from 'react-icons/md';
import { ImUpload } from 'react-icons/im';
import { AiFillDelete } from 'react-icons/ai';
import { VscDiscard } from 'react-icons/vsc';

const EditProfile = () => {
  const { status } = useSession();

  const [saved, setSaved] = useState(false);
  const [author, setAuthor] = useState();
  const [isEditing, setIsEditing] = useState({
    bio: false,
    name: false,
    username: false,
  });
  const [initialUser, setInitialUser] = useState({
    _id: '',
    bio: '',
    name: '',
    username: '',
  });

  const [changes, setChanges] = useState({
    bio: '',
    name: '',
    username: '',
  });

  const [authorProfile, setAuthorProfile] = useState();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfile, setNewProfile] = useState();
  const [uploading, setUploading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);

  const [saveAlert, setSaveAlert] = useState({
    bio: false,
    name: false,
    username: false,
    profile: false,
  });

  useEffect(() => {
    getSession().then((data) => {
      client.fetch(fetchUserById(data?.user?.id)).then((data) => {
        if (data[0]) {
          setChanges({
            name: data[0]?.name,
            bio: data[0]?.bio,
            username: data[0]?.username,
          });
          setInitialUser({
            name: data[0]?.name,
            bio: data[0]?.bio,
            username: data[0]?.username,
            _id: data[0]?._id,
          });
          setAuthor(data[0]);
          if (data[0].profile) setAuthorProfile(urlFor(data[0].profile).url());
          else setAuthorProfile(data[0].imageUrl);
        }
      });
    });
  }, []);

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setSaveAlert((prevAlerts) => ({ ...prevAlerts, profile: true }));
      setWrongImageType(false);
      setUploading(true);
      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setNewProfile(document);
          setUploading(false);
        })
        .catch((error) => {
          console.log('Image Upload Error', error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const saveChanges = () => {
    if (!author?._id) {
      console.error('error - no author id');
      return;
    }
    if (
      initialUser.name == '' ||
      initialUser.bio == '' ||
      initialUser.username == ''
    ) {
      useToaster('error', "You're missing a required field.");
      return;
    }
    if (newProfile) {
      client
        .patch(author._id)
        .set({
          profile: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: newProfile._id,
            },
          },
        })
        .commit()
        .catch((err) => {
          console.error('Image upload error', err);
        });
    }
    fetch('/api/editProfile', {
      method: 'POST',
      body: JSON.stringify(initialUser),
    })
      .then(() => {
        setSaved(true);
        // router.reload()
      })
      .catch((err) => {
        console.log(err);
        setSaved(false);
      });
  };

  const discardChanges = () => {
    setChanges({
      name: author?.name,
      bio: author?.bio,
      username: author?.username,
    });
    setInitialUser({
      name: author?.name,
      bio: author?.bio,
      username: author?.username,
      _id: author?._id,
    });
    setIsEditing({
      bio: false,
      name: false,
      username: false,
    });
    setSaved(false);
    setIsEditingProfile(false);
    setNewProfile(null);
    setUploading(false);
    setWrongImageType(false);
    setSaveAlert({
      bio: false,
      name: false,
      username: false,
      profile: false,
    });
  };

  if (status === 'loading') return <AuthLoading title='Edit Profile' />;
  else if (status === 'unauthenticated') return <Unauth />;
  else if (status === 'authenticated')
    return (
      <div>
        <Header />
        <ToastContainer theme='colored' />
        {!author ? (
          <div className='h-screen w-full flex items-center justify-center'>
            <Spinner message='Fetching you' />
          </div>
        ) : (
          <div className='max-w-4xl mx-auto pt-8 px-10'>
            <Head>
              <title>Edit profile - @{author.username}</title>
            </Head>
            <p className='text-2xl font-bold pb-4'>About you</p>
            <hr className='border-2 border-slate-300' />
            <div className='pt-6'>
              <div className='mb-5'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold'>Name</p>
                  <div>
                    {!isEditing.name ? (
                      <p
                        className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        onClick={() => {
                          setIsEditing((prevEdit) => {
                            return { ...prevEdit, name: true };
                          });
                        }}
                      >
                        Edit
                      </p>
                    ) : (
                      <div className='flex space-x-2'>
                        <p
                          onClick={() => {
                            setInitialUser((prevUser) => {
                              return { ...prevUser, name: changes.name };
                            });
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, name: false };
                            });
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Done
                        </p>
                        <p
                          onClick={() => {
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, name: false };
                            });
                            setSaveAlert((prevAlerts) => ({
                              ...prevAlerts,
                              name: false,
                            }));
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing.name && (
                  <p className='pt-3 mb-3'>{initialUser.name}</p>
                )}
                {isEditing.name && (
                  <input
                    className='border-b-2 py-2 px-2 mb-3 mt-1 block w-full outline-none focus:rounded-lg focus:border-2'
                    type='text'
                    value={changes.name}
                    onChange={(e) => {
                      setChanges((prevChanges) => {
                        return { ...prevChanges, name: e.target.value };
                      });
                      setSaveAlert((prevAlerts) => ({
                        ...prevAlerts,
                        name: true,
                      }));
                    }}
                  />
                )}
                {!isEditing.name && <hr className='mb-3 max-w-3xl mx-auto' />}
                {initialUser.name == '' && (
                  <p className='text-red-500 text-sm mb-2'>
                    This is a required field
                  </p>
                )}
                <div className='text-sm font-light text-gray-600 max-w-lg'>
                  <p>
                    Your name appears on your Profile page, as your byline, and
                    in your responses.
                  </p>
                  <p>It is a required field.</p>
                </div>
              </div>

              <div className='mb-5'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold'>Short Bio</p>
                  <div>
                    {!isEditing.bio ? (
                      <p
                        className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        onClick={() => {
                          setIsEditing((prevEdit) => {
                            return { ...prevEdit, bio: true };
                          });
                        }}
                      >
                        Edit
                      </p>
                    ) : (
                      <div className='flex space-x-2'>
                        <p
                          onClick={() => {
                            setInitialUser((prevUser) => {
                              return { ...prevUser, bio: changes.bio };
                            });
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, bio: false };
                            });
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Done
                        </p>
                        <p
                          onClick={() => {
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, bio: false };
                            });
                            setSaveAlert((prevAlerts) => ({
                              ...prevAlerts,
                              bio: false,
                            }));
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing.bio && (
                  <p className='pt-3 mb-3'>{initialUser.bio}</p>
                )}
                {isEditing.bio && (
                  <input
                    maxLength={160}
                    className='border-b-2 py-2 px-2 mb-3 mt-1 block w-full outline-none focus:rounded-lg focus:border-2'
                    type='text'
                    value={changes.bio}
                    onChange={(e) => {
                      setChanges((prevChanges) => {
                        return { ...prevChanges, bio: e.target.value };
                      });
                      setSaveAlert((prevAlerts) => ({
                        ...prevAlerts,
                        bio: true,
                      }));
                    }}
                  />
                )}
                {!isEditing.bio && <hr className='mb-3 max-w-3xl mx-auto' />}
                {initialUser.bio == '' && (
                  <p className='text-red-500 text-sm mb-2'>
                    This is a required field
                  </p>
                )}
                <div className='text-sm font-light text-gray-600 max-w-lg'>
                  <p>
                    Your short bio appears on your Profile and next to your
                    stories.
                  </p>
                  <p>
                    Max <span className='font-[600]'>160</span> characters.
                  </p>
                </div>
              </div>

              <div className='mb-5'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold'>Username</p>
                  <div>
                    {!isEditing.username ? (
                      <p
                        className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        onClick={() => {
                          setIsEditing((prevEdit) => {
                            return { ...prevEdit, username: true };
                          });
                        }}
                      >
                        Edit
                      </p>
                    ) : (
                      <div className='flex space-x-2'>
                        <p
                          onClick={() => {
                            setInitialUser((prevUser) => {
                              return {
                                ...prevUser,
                                username: changes.username,
                              };
                            });
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, username: false };
                            });
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Done
                        </p>
                        <p
                          onClick={() => {
                            setIsEditing((prevEdit) => {
                              return { ...prevEdit, username: false };
                            });
                            setSaveAlert((prevAlerts) => ({
                              ...prevAlerts,
                              username: false,
                            }));
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing.username && (
                  <p className='pt-3 mb-3'>@{initialUser.username}</p>
                )}
                {isEditing.username && (
                  <span className='flex items-center'>
                    <span className='mb-3'>@</span>
                    <input
                      className='border-b-2 py-2 px-2 mb-3 mt-1 block w-full outline-none focus:rounded-lg focus:border-2'
                      type='text'
                      value={changes.username}
                      onChange={(e) => {
                        setChanges((prevChanges) => {
                          return { ...prevChanges, username: e.target.value };
                        });
                        setSaveAlert((prevAlerts) => ({
                          ...prevAlerts,
                          username: true,
                        }));
                      }}
                    />
                  </span>
                )}
                {!isEditing.username && (
                  <hr className='mb-3 max-w-3xl mx-auto' />
                )}
                {initialUser.username == '' && (
                  <p className='text-red-500 text-sm mb-2'>
                    This is a required field
                  </p>
                )}
                <div className='text-sm font-light text-gray-600 max-w-lg'>
                  <p>A unique identifier for your account.</p>
                  <p>Be creative with it.</p>
                </div>
              </div>

              <div className='mb-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xl font-bold'>Photo</p>
                    <div className='text-sm font-light text-gray-600 max-w-md mt-5'>
                      <p>
                        Your photo appears on your Profile page and with your
                        stories across Medium.
                      </p>
                      <p>
                        Recommended size: Square, at least{' '}
                        <span className='font-[600]'>1000</span> pixels per
                        side. File type: JPG, PNG or GIF.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start space-x-8'>
                    {isEditingProfile ? (
                      !newProfile ? (
                        uploading ? (
                          <Spinner message='' type='TailSpin' />
                        ) : (
                          <label>
                            <div className='h-24 w-24 rounded-full grid place-items-center border-2 border-slate-400 cursor-pointer'>
                              <ImUpload className='text-2xl hover:text-3xl transition-all duration-200' />
                            </div>
                            <input
                              type='file'
                              name='upload-image'
                              onChange={uploadImage}
                              className='w-0 h-0'
                            />
                          </label>
                        )
                      ) : (
                        <img
                          className='h-24 w-24 rounded-full border-2 object-cover border-slate-400'
                          src={newProfile?.url}
                          alt=''
                        />
                      )
                    ) : !newProfile ? (
                      <img
                        src={authorProfile}
                        className='h-24 w-24 rounded-full object-cover'
                        alt=''
                      />
                    ) : (
                      <img
                        className='h-24 w-24 rounded-full border-2 object-cover border-slate-400'
                        src={newProfile?.url}
                        alt=''
                      />
                    )}
                    {isEditingProfile ? (
                      <div>
                        <p
                          onClick={() => {
                            setIsEditingProfile(false);
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100 mb-1 text-center'
                        >
                          Done
                        </p>
                        <p
                          onClick={() => {
                            setIsEditingProfile(false);
                            setNewProfile(undefined);
                            setSaveAlert((prevAlerts) => ({
                              ...prevAlerts,
                              profile: false,
                            }));
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100 mb-1 text-center'
                        >
                          Cancel
                        </p>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center space-y-3'>
                        <div
                          onClick={() => {
                            setIsEditingProfile(true);
                          }}
                          className='py-1 px-4 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100'
                        >
                          Edit
                        </div>
                        {newProfile && (
                          <div
                            className='p-2 border-2 rounded-full border-slate-400 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setNewProfile(undefined);
                              setIsEditingProfile(false);
                              setWrongImageType(false);
                            }}
                          >
                            <AiFillDelete className='text-xl' />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {saved ? (
                <div className='py-1 w-fit px-4 border-2 border-slate-400 rounded-full flex items-center'>
                  <MdOutlineFileDownloadDone className='text-xl text-slate-600 mr-2' />{' '}
                  <p className='font-semibold'>Changes Saved</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {(isEditing.bio ||
                    isEditing.name ||
                    isEditing.username ||
                    isEditingProfile) && (
                    <button
                      onClick={saveChanges}
                      className='py-2 px-4 border-2 w-48 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center'
                    >
                      <MdOutlineFileUpload className='text-xl text-slate-600 mr-2' />
                      <p className='font-semibold'>Save Changes</p>
                    </button>
                  )}

                  {(saveAlert.name ||
                    saveAlert.bio ||
                    saveAlert.username ||
                    saveAlert.profile) && (
                    <div className='space-y-4'>
                      <p className='text-red-500 text-lg font-semibold'>
                        Don't forget to save your changes here!
                      </p>
                      <button
                        className='py-2 px-4 w-48 border-2 border-slate-400 cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center'
                        onClick={discardChanges}
                      >
                        <VscDiscard className='text-xl text-slate-600 mr-2' />
                        <p className='font-semibold'>Discard Changes</p>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

export default EditProfile;
