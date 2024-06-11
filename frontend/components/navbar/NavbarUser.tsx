import { User } from "@/types"
import Link from "next/link";

export default function NavbarUser({ user }: {
    user: User;
}) {
    return(
        <Link 
            data-testid="navbar-user"
            href={`/profile/${user.id}`}
        >
            {user.username}
        </Link>
    )
}