import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Definer en interface for strukturen på et blogginnlegg
interface BlogPost {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  category: string;
  imageUrl: string;
  authorImageUrl: string;
  authorEmail: string;
  authorRole: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/BlogPost`
        );
        console.log(response.data);
        console.log(import.meta.env.VITE_REACT_APP_API_URL);
        setPosts(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  function extractFirstParagraph(htmlString: string) {
    // Attempt to extract the first <p> tag's content
    const match = htmlString.match(/<p>(.*?)<\/p>/);
    if (match && match[1]) {
      return match[1]; // Returns the content of the first <p> tag
    }
    return ''; // Return an empty string if no <p> tag is found
  }
  

  if (isLoading)
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold  tracking-tight text-gray-900 sm:text-4xl">
            Featured posts
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between cursor-pointer"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="relative w-full">
                <img
                  src={
                    post.imageUrl.startsWith("http")
                      ? post.imageUrl
                      : `${import.meta.env.VITE_REACT_APP_API_URL}/${
                          post.imageUrl
                        }`
                  }
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.publishedDate} className="text-gray-500">
                    {new Date(post.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </time>

                  <a
                    href={""}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {post.category}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href={""}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
               

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {extractFirstParagraph(post.content)}
                    </p>
                
                    </div>

                <div className="relative mt-8 flex items-center gap-x-4">
                  <img
                    src={post.authorImageUrl}
                    alt=""
                    className="h-10 w-10 rounded-full bg-gray-100"
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <a href={""} onClick={(e) => e.stopPropagation()}>
                        {post.authorEmail}
                      </a>
                    </p>
                    <p className="text-gray-600">{post.authorRole}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
