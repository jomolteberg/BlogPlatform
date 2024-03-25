export default function HomePageHero() {
  const headerImage = "./src/assets/images/homepage-bg.jpg";

  return (
   
<div className="relative isolate overflow-hidden bg-gray-900 px-6 py-32 sm:py-56 lg:px-8 h-[450px] sm:h-[550px]">
      <img
        src={headerImage}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-50 -z-10"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-xl text-center z-10">
        <h2 className="font-hero font-medium text-4xl uppercase tracking-tight text-white sm:text-4xl">Explore the world together</h2>
        <p className="mt-6 text-lg font-medium leading-8 text-white">
          Welcome to our travel blog. We are a group of travel enthusiasts who love to explore the world. We are here to share our experiences and help you plan your next trip.
        </p>
      </div>
    </div>
  );
}
