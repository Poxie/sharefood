"use client";
import { useModal } from "@/contexts/modal";
import NavbarButtons from "./NavbarButtons";
import NavbarUser from "./NavbarUser";
import useCurrentUser from "@/hooks/users/useCurrentUser";

export default function NavbarOptions() {
    const { setModal } = useModal();

    const { data, isPending } = useCurrentUser();

    console.log(data, isPending);
    return(
        <div data-testid="navbar-options">
            {!isPending && !data && (
                <NavbarButtons />
            )}
            {!isPending && data && (
                <NavbarUser user={data} />
            )}
        </div>
    )
}