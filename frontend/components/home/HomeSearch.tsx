import Input from "../input";
import SearchIcon from "@/assets/icons/SearchIcon";
import SendIcon from "@/assets/icons/SendIcon";
import { useTranslations } from "next-intl";

export default function HomeSearch() {
    const t = useTranslations('home');

    return(
        <div 
            className="w-main max-w-main mx-auto p-6 bg-primary rounded-lg"
            data-testid="home-search-section"
        >
            <h2 className="mb-2 text-2xl font-bold">
                {t('search.title')}
            </h2>
            <Input 
                className="text-lg"
                placeholder={t('search.placeholder')}
                icon={<SearchIcon className="w-5" />}
                submitIcon={<SendIcon className="w-7" />}
            />
        </div>
    )
}