import Image from "next/image";
import Link from "next/link";
import NavbarTabs from "./NavbarTabs";
import Button from "../button";

export default function Navbar() {
    return(
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
            <div className="flex gap-2">
                <Button 
                    type="transparent"
                    className="-my-3"
                >
                    Log in
                </Button>
                <Button 
                    className="-my-3"
                >
                    Sign up
                </Button>
            </div>
        </nav>
    )
}