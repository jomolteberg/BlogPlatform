import React, { useState } from 'react';
import axios from 'axios';

interface CreateCommentProps {
  blogPostId: number;
}

const CreateComment: React.FC<CreateCommentProps> = ({ blogPostId }) => {
  const [commentText, setCommentText] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Hent token fra localStorage
    if (!token) {
      console.error("No token found");
      return; // Avbryt operasjonen hvis ingen token er funnet
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Inkluder token i forespørselens headers
      }
    };

    try {
      await axios.post(`https://blogplatform.azurewebsites.net/Comments/${blogPostId}`, { text: commentText }, config);
      setCommentText(''); // Reset input field after submission
      
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <img
          className="inline-block h-10 w-10 rounded-full"
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </div>
      <div className="min-w-0 flex-1">
        <form action="#" onSubmit={handleSubmit} className="relative">
          <div className="overflow-hidden rounded-lg shadow ring-1 ring-inset ring-gray-300 focus-within:ring-2">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="pl-1 block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 focus:outline-none"
              placeholder="Add your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateComment;