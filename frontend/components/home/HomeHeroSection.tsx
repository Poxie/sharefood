import { useTranslations } from "next-intl"

export default function HomeHeroSection() {
    const t = useTranslations('home');

    return(
        <section 
            className="w-main max-w-main mx-auto py-32"
            data-testid="home-hero-section"
        >
            <h1 className="text-5xl font-bold mb-4">
                {t('hero.title')}
            </h1>
            <p className="text-lg text-muted lg:w-3/5">
                {t('hero.description')}
            </p>
        </section>
    )
}