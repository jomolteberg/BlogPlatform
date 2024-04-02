import React, { useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArticleEditor from "./ArticleEditor";

type FormData = {
  title: string;
  articleContent: string;
  image: File | null;
};

export default function CreatePost() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    articleContent: "",
    image: null,
  });
  const [fileName, setFileName] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.title || !formData.articleContent) {
      alert("Please fill out all fields.");
      return;
    }

    const apiEndpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/BlogPost`;

    // Prepare FormData for submission
    const submissionData = new FormData();
    submissionData.append("Title", formData.title); // Ensure this matches the DTO field name
    submissionData.append("Content", formData.articleContent); // Ensure this matches the DTO field name
    if (formData.image) submissionData.append("ImageFile", formData.image); // Assuming your API handles file uploads with this field name

    const token = localStorage.getItem("token");
    console.log(token); // Check if the token is retrieved correctly

    try {
      // Send POST request to your API endpoint
      const response = await axios.post(apiEndpoint, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`, // Make sure this is included
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle response
      console.log(response.data);

      // Optionally, clear form or redirect user
      setFormData({ title: "", articleContent: "", image: null }); // Clear form
      setFileName(""); // Clear file name

      // Redirect user to the home page
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <div className="m-5">
        <form onSubmit={handleSubmit} className="relative">
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full border-0 p-2.5 text-lg font-medium placeholder-gray-400 focus:ring-0"
              placeholder="Title"
              required
            />
            <ArticleEditor
              content={formData.articleContent}
              onContentChange={(content: string) =>
                setFormData({ ...formData, articleContent: content })
              }
              
            />
          </div>

          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center space-x-3">
              <span className="text-sm italic">
                {fileName || "No file selected"}
              </span>
              <button
                type="button"
                className="inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400 hover:text-gray-500"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <PaperClipIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="text-sm italic">Attach a file</span>
              </button>
            </div>
            <button
              type="submit"
              className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
