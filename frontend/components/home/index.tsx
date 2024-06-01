import Image from "next/image";
import HomeHeroSection from "./HomeHeroSection";
import Input from "../input";

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
            <div className="w-main max-w-main mx-auto p-5">
                <Input placeholder="Search for ‘lasagna’" />
            </div>
        </main>
    )
}