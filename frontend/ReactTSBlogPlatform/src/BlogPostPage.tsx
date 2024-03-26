import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CreateComment from "./CreateComment";
import Comments from "./Comments";
import { BlogPost } from "./types";


function BlogPostPage() {
  const { id } = useParams<{ id?: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`blogplatform.azurewebsites.net/BlogPost/${id}`);
        setPost(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <>
      <div className="bg-white px-6 mt-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <figure className="mt-16">
            <img
              className="aspect-video rounded-xl bg-gray-50 object-cover"
              src={post.imageUrl.startsWith('http') ? post.imageUrl : `blogplatform.azurewebsites.net${post.imageUrl}`}
              alt=""
            />
          </figure>
          <p className="mt-2 text-base font-semibold leading-7 text-orange-600">{post.category}</p>

          <h1 className="mt-20 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
          <p className="mt-6 text-xl leading-8">
            {post.content}
          </p>

          <div className="mt-20">
            <CreateComment blogPostId={Number(id)}/>
          </div>
          <div className="mt-20">
            <Comments blogPostId={Number(id)}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPostPage;
