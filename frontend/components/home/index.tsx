"use client";
import HomeHeroSection from "./HomeHeroSection";
import HomeRecipes from "./HomeRecipes";
import HomeDivider from "@/assets/illustrations/HomeDivider";

export default function Home() {
    return(
        <main>
            <HomeHeroSection />
            <HomeDivider />
            <HomeRecipes />
        </main>
    )
}