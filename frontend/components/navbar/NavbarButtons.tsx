import SignupModal from "@/modals/sign-up";
import Button from "../button";
import { useModal } from "@/contexts/modal";

export default function NavbarButtons() {
    const { setModal } = useModal();

    return(
        <>
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
    </>    
    )
}