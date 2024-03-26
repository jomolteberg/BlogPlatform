import React, { useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { CommentType } from "./types";
import { EditCommentModal } from "./EditCommentModal";

interface CommentProps {
  blogPostId: number;
}

const Comments: React.FC<CommentProps> = ({ blogPostId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCommentText, setCurrentCommentText] = useState('');
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<CommentType[]>(
          `blogplatform.azurewebsites.net/Comments/ByBlogPost/${blogPostId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("blogplatform.azurewebsites.net/commentHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startSignalRConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to SignalR hub");

        connection.on("ReceiveComment", (receivedComment: CommentType) => {
          if (receivedComment.blogPostId === blogPostId) {
            setComments((prevComments) => [...prevComments, receivedComment]);
          }
        });
      } catch (err) {
        console.error("SignalR Connection Error:", err);
      }
    };

    startSignalRConnection();

    return () => {
      connection.stop();
    };
  }, [blogPostId]);

  const handleDelete = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token"); // Hent token fra localStorage
      if (!token) {
        console.error("No token found");
        return; // Avbryt operasjonen hvis ingen token er funnet
      }

      await axios.delete(`blogplatform.azurewebsites.net/Comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Inkluder token i forespørselens headers
        },
      });
      // Oppdater kommentarlisten ved å filtrere bort den slettede kommentaren
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditClick = (comment: CommentType) => {
    setCurrentCommentId(comment.id);
    setCurrentCommentText(comment.text);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (newText: string) => {
    if (currentCommentId == null) return;
  
    const token = localStorage.getItem('token'); // Anta at token er lagret i localStorage
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      // Oppdater kommentaren på serveren
      await axios.put(`blogplatform.azurewebsites.net/Comments/${currentCommentId}`, { text: newText }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Oppdater kommentarene i tilstanden
      setComments(comments.map(comment => {
        if (comment.id === currentCommentId) {
          return { ...comment, text: newText };
        }
        return comment;
      }));
  
      setIsEditModalOpen(false); // Lukk modalen
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  

  // Funksjon for å vise dropdown-menyen for en spesifikk kommentar
  const toggleDropdown = (commentId: number) => {
    setOpenDropdownId(openDropdownId === commentId ? null : commentId);
  };

  return (
    <div className="bg-white px-6 my-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
          Discussion ({comments.length})
        </h2>
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="p-6 text-base bg-white rounded-lg shadow mt-4"
          >
            <footer className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                  <img
                    className="mr-2 w-6 h-6 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                    alt={comment.userName}
                  />
                  {comment.userName}
                </p>
                <p className="text-sm text-gray-600">
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </p>
              </div>
              {/* Dropdown-meny for redigering og sletting */}
              <div>
                {/* Button trigger for dropdown */}
                <button
                  onClick={() => toggleDropdown(comment.id)}
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                  type="button"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 3"
                  >
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  </svg>
                  <span className="sr-only">Comment settings</span>
                </button>
                {/* Dropdown meny innhold */}
                {openDropdownId === comment.id && (
                  <div className="absolute mt-2 w-36 bg-white rounded divide-y divide-gray-100 shadow">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <button
                          className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                          onClick={() => handleEditClick(comment)}
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Remove
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </footer>

            <p className="text-gray-500">{comment.text}</p>
          </article>
        ))}
      </div>
      <EditCommentModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        commentText={currentCommentText}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Comments;
