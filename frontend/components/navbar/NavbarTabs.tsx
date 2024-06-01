"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge";

const TABS = [
    { text: 'Home', path: '' },
    { text: 'Explore', path: 'explore' },
]
export default function NavbarTabs() {
    const path = usePathname();

    return(
        <ul className="flex gap-4">
            {TABS.map(tab => {
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