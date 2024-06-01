import { useTranslations } from "next-intl";
import Button from "../button";

export default function HomeHeroOptions() {
    const t = useTranslations('home');
    
    return(
        <div 
            data-testid="home-hero-options"
            className="flex items-center gap-3"
        >
            <Button 
                href="/explore"
                className="py-4 px-5 text-base"
            >
                {t('hero.buttons.primary')}
            </Button>
            <Button 
                href="/share"
                className="py-4 px-5 text-base"
            >
                {t('hero.buttons.secondary')}
            </Button>
        </div>
    )
}