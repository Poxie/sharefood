"use client";
import { useModal } from "@/contexts/modal";
import NavbarButtons from "./NavbarButtons";
import NavbarUser from "./NavbarUser";
import useCurrentUser from "@/hooks/users/useCurrentUser";

export default function NavbarOptions() {
    const { setModal } = useModal();

    const { data, isPending } = useCurrentUser();

    return(
        <div data-testid="navbar-options">
            {!data && (
                <NavbarButtons />
            )}
            {!isPending && data && (
                <NavbarUser user={data} />
            )}
        </div>
    )
}