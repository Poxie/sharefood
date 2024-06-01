import Image from "next/image";
import HomeHeroSection from "./HomeHeroSection";

export default function Home() {
    return(
        <main>
            <HomeHeroSection />
            <Image 
                data-testid="home-divider"
                width="1920"
                height="20"
                src="/home-divider.svg"
                className="w-full"
                alt=""
            />
        </main>
    )
}