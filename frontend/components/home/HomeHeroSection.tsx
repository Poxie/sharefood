import { useTranslations } from "next-intl"
import HomeHeroOptions from "./HomeHeroOptions";

export default function HomeHeroSection() {
    const t = useTranslations('home');

    return(
        <section 
            className="w-main max-w-main mx-auto py-32"
            data-testid="home-hero-section"
        >
            <h1 className="mb-4 text-5xl font-bold">
                {t('hero.title')}
            </h1>
            <p className="mb-6 text-lg text-muted lg:w-3/5">
                {t('hero.description')}
            </p>
            <HomeHeroOptions />
        </section>
    )
}