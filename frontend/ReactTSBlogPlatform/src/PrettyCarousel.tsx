import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";

// Definerer en interface for strukturen på et blogginnlegg
interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  publishedDate: string; // Anta denne er en string, juster etter faktisk format
}

function PrettyCarousel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeItem, setActiveItem] = useState<number>(6); // Startindeksen justert til 0 for tydelighet
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLUListElement>(null); // Spesifiserer at dette er en referanse til en ul-element
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Passer for NodeJS.Timeout, juster om nødvendig for nettleser

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Spesifiserer den forventede responsen som et array av BlogPost
        const response = await axios.get<BlogPost[]>('https://blogplatform.azurewebsites.net/BlogPost');
        const sortedPosts = response.data.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()); // Sorterer basert på dato
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Direkte manipulasjon av DOM-elementer bør unngås med React, men her er hvordan du kan type-sikre det
    wrapperRef.current.style.setProperty("--transition", "600ms cubic-bezier(0.22, 0.61, 0.36, 1)");

    timeoutRef.current = setTimeout(() => {
      wrapperRef.current?.style.removeProperty("--transition");
    }, 900);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeItem]);

  return (
    <>
      <div className="hidden md:flex h-full w-full items-center justify-center py-24">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900 sm:text-4xl">
          Latest posts
        </h2>
      </div>

      <div className="hidden md:flex h-full w-full items-center justify-center">
        <div className="w-[1200px] max-w-full">
          <ul
            ref={wrapperRef}
            className="group flex flex-col gap-3 md:h-[540px] md:flex-row md:gap-[1.5%] justify-center"
          >
            {posts.map((post, index) => (
              <li
                onClick={() => {
                  if (activeItem === index) {
                    // Using navigate for SPA navigation
                    navigate(`/blog/${post.id}`); // Adjust according to your routing and ID field
                  } else {
                    setActiveItem(index); // Set as active item if not already
                  }
                }}
                aria-current={activeItem === index ? "true" : "false"}
                className={classNames(
                  "relative cursor-pointer md:w-[8%] md:first:w-[0%] md:last:w-[0%] md:[&[aria-current='true']]:w-[48%]",
                  "md:[transition:width_var(--transition,200ms_ease-in)]",
                  "md:before-block before:absolute before:bottom-0 before:left-[-10px] before:right-[-10px] before:top-0 before:hidden before:bg-white",
                  "md:[&:not(:hover),&:not(:first),&:not(:last)]:group-hover:w-[7%] md:hover:w-[12%]",
                  "first:pointer-events-none last:pointer-events-none md:[&_img]:first:opacity-0 md:[&_img]:last:opacity-0"
                )}
                key={post.id} // Adjust according to your ID field
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#c9c6c7]">
                  <img
                    className="absolute right-0 top-1/2 h-auto w-24 max-w-none -translate-y-1/2 object-cover md:left-1/2 md:h-[640px] md:w-[590px] md:-translate-x-1/2"
                    src={post.imageUrl.startsWith('http') ? post.imageUrl : `https://blogplatform.azurewebsites.net${post.imageUrl}`}
                    alt={post.title}
                  />
                 <div
                    className={classNames(
                      "inset-0 opacity-25 duration-300 before:absolute before:bottom-0 before:left-[-546px] before:right-0 before:top-[-148px] before:z-10 before:bg-texture after:bottom-[28px] after:left-0 after:right-[-434px] after:top-0 after:z-10 after:bg-texture md:absolute md:transition-opacity",
                      activeItem === index ? "md:opacity-25" : "md:opacity-0"
                    )}
                  />
                  <div
                    className={classNames(
                      "left-8 top-8 w-[590px] p-4 transition-[transform,opacity] md:absolute md:p-0",
                      activeItem === index
                        ? "md:translate-x-0 md:opacity-100"
                        : "md:translate-x-4 md:opacity-0"
                    )}
                  >
                    <p className="font-heading text-sm uppercase text-primary md:text-lg">
                      {post.title}
                    </p>
                    <p className="font-heading text-lg font-bold md:text-4xl">
                      {post.title}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default PrettyCarousel;

