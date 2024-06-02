import HomeSearch from "./HomeSearch";

export default function HomeRecipes() {
    return(
        <div 
            className="py-12 bg-secondary"
            data-testid="home-recipes-section"
        >
            <HomeSearch />
        </div>
    )
}