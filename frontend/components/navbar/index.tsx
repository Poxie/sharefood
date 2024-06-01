import Image from "next/image";
import Link from "next/link";
import NavbarTabs from "./NavbarTabs";
import Button from "../button";
import NavbarOptions from "./NavbarOptions";

export default function Navbar() {
    return(
        <div className="border-b-[1px] border-b-tertiary">
            <nav className="w-main max-w-main mx-auto py-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link   
                        data-testid="navbar-logo" 
                        href={"/"}
                    >
                        <Image 
                            width={128}
                            height={14}
                            src="/logo.svg"
                            alt="Logo"
                        />
                    </Link>
                    <NavbarTabs />
                </div>
                <NavbarOptions />
            </nav>
        </div>
    )
}