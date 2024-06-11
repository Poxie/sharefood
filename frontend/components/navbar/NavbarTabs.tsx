"use client";
import { useTranslations } from "next-intl";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge";

export default function NavbarTabs() {
    const t = useTranslations('navbar');

    const path = usePathname();

    const tabs = [
        { text: t('tabs.home'), path: '' },
        { text: t('tabs.explore'), path: 'explore' },
    ]
    return(
        <ul className="flex gap-4" data-testid="navbar-tabs">
            {tabs.map(tab => {
                const active = path.includes(tab.path);
                return(
                    <li key={tab.text}>
                        <Link 
                            href={`/${tab.path}`}
                            className={twMerge(
                                "text-sm text-muted",
                                active && "text-primary",
                            )}
                        >
                            {tab.text}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}