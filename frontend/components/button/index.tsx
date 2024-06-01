import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Button({ children, className, onClick, href, type='primary' }: {
    children?: React.ReactNode;
    className?: string;
    type?: "primary" | "transparent";
    onClick?: () => void;
    href?: string;
}) {
    className = twMerge(
        "py-3 px-4 text-sm rounded-lg transition-colors",
        type === 'primary' && 'bg-c-primary hover:bg-c-accent text-light font-bold',
        type === 'transparent' && 'text-primary hover:bg-secondary',
        className,
    )

    const props = {
        onClick,
        className,
    }

    if(href) {
        return(
            <Link 
                href={href}
                {...props}
            >
                {children}
            </Link>
        )
    }
    
    return(
        <button {...props}>
            {children}
        </button>
    )
}