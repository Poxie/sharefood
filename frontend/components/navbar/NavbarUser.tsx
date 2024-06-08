import { User } from "@/types"

export default function NavbarUser({ user }: {
    user: User;
}) {
    return(
        <span data-testid="navbar-user">
            {user.username}
        </span>
    )
}