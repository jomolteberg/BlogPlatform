
import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests

interface UserProfileFormData {
  firstName: string;
  lastName: string;
  profileImage?: File;
}

const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState<UserProfileFormData>({ firstName: '', lastName: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

  // Add state for the image preview URL
const [imagePreviewUrl, setImagePreviewUrl] = useState('');

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl); // Update state with the new URL
    }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    if (formData.profileImage) {
      data.append('ProfileImage', formData.profileImage);
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Specify your API endpoint for the profile update
    const apiEndpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/User/UpdateProfile`;

    try {
      // Using Axios for the HTTP request
      const response = await axios.post(apiEndpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token as a Bearer token
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      console.log('Profile updated successfully:', response.data);
      // Optionally, navigate user or give feedback
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle errors here, such as displaying a message to the user
    }
  };


    return(
        <>
        <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={handleSubmit}>
                {/* Profile section */}
                <div className="px-4 py-6 sm:p-6 lg:pb-8">
                  <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      This information will be displayed publicly so be careful what you share.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="flex-grow space-y-6">
                     

                      <div>
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                          About
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                            defaultValue={''}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description for your profile. URLs are hyperlinked.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                      <p className="text-sm font-medium leading-6 text-gray-900" aria-hidden="true">
                        Photo
                      </p>
                      <div className="mt-2 lg:hidden">
                        <div className="flex items-center">
                          <div
                            className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                            aria-hidden="true"
                          >
                            <img className="h-full w-full rounded-full" src={imagePreviewUrl}  alt="" />
                          </div>
                          <div className="relative ml-5">
                            <input
                              id="profileImage"
                              name="profileImage"
                              type="file"
                              className="peer absolute h-full w-full rounded-md opacity-0"
                              onChange={handleFileChange}
                            />
                            <label
                              htmlFor="profileImage"
                              className="pointer-events-none block rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-sky-500"
                            >
                              <span>Change</span>
                              <span className="sr-only"> user photo</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="relative hidden overflow-hidden rounded-full lg:block">
                        <img className="relative h-40 w-40 rounded-full" src={imagePreviewUrl} alt="" />
                        <label
                          htmlFor="profileImage"
                          className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                        >
                          <span>Change</span>
                          <span className="sr-only"> user photo</span>
                          <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                      <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="first-name"
                        autoComplete="given-name"
                        className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="last-name"
                        autoComplete="family-name"
                        className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                </div>
                   {/* Submit Button */}
        <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
          <button type="submit" className="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">
            Save
          </button>
        </div>
                </form>
        </>
    )
}

export default SettingsPage;
