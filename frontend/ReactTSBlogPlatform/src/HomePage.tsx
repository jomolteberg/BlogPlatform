import BlogSection from "./BlogSection"
import HomePageHero from "./HomePageHero"
import DividerPlusIcon from "./DividerPlusIcon"
import PrettyCarousel from "./PrettyCarousel"

function HomePage(){

    return(
    <>
    <HomePageHero/>
    <PrettyCarousel/>
    <BlogSection/>
    <DividerPlusIcon/>
    </>
    );
}

export default HomePage;