import { useTranslations } from "next-intl"
import HomeHeroButtons from "./HomeHeroButtons";

export default function HomeHeroSection() {
    const t = useTranslations('home');

    return(
        <section 
            className="w-main max-w-main mx-auto py-40"
            data-testid="home-hero-section"
        >
            <h1 className="mb-4 text-5xl font-bold">
                {t('hero.title')}
            </h1>
            <p className="mb-6 text-lg text-muted lg:w-3/5">
                {t('hero.description')}
            </p>
            <HomeHeroButtons />
        </section>
    )
}