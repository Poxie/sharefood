import { User } from "@/types"

export default function NavbarUser({ user }: {
    user: User;
}) {
    return(
        <span>
            {user.username}
        </span>
    )
}