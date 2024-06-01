import { useTranslations } from "next-intl"

export default function HomeHeroSection() {
    const t = useTranslations('home');

    return(
        <section data-testid="home-hero-section">
            <h1>
                {t('hero.title')}
            </h1>
            <p>
                {t('hero.description')}
            </p>
        </section>
    )
}