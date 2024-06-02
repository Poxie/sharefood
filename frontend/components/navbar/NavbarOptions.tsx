import { useModal } from "@/contexts/modal";
import Button from "../button";
import SignupModal from "@/modals/sign-up";

export default function NavbarOptions() {
    const { setModal } = useModal();

    return(
        <div className="flex gap-2" data-testid="navbar-options">
            <Button 
                type="transparent"
                className="-my-3"
            >
                Log in
            </Button>
            <Button 
                className="-my-3"
                onClick={() => setModal(<SignupModal />)}
            >
                Sign up
            </Button>
        </div>
    )
}