import SignupModal from "@/modals/sign-up";
import Button from "../button";
import { useModal } from "@/contexts/modal";
import LoginModal from "@/modals/login";
import { useTranslations } from "next-intl";

export default function NavbarButtons() {
    const t = useTranslations('navbar');

    const { setModal } = useModal();

    return(
        <div className="flex gap-2" data-testid="navbar-buttons">
            <Button 
                type="transparent"
                className="-my-3"
                onClick={() => setModal(<LoginModal />)}
            >
                {t('buttons.login')}
            </Button>
            <Button 
                className="-my-3"
                onClick={() => setModal(<SignupModal />)}
            >
                {t('buttons.signup')}
            </Button>
        </div>   
    )
}