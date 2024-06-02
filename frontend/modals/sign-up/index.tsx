import { useTranslations } from "next-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";

export default function SignupModal() {
    const t = useTranslations('modal');
    
    return(
        <Modal>
            <ModalHeader>
                {t('signup.title')}
            </ModalHeader>
            <form 
                data-testid="signup-form"
                className="p-4 pt-0 grid gap-2"
            >
                <Input 
                    placeholder={t('signup.placeholder.username')}
                    className="bg-secondary text-base"
                />
                <Input 
                    placeholder={t('signup.placeholder.password')}
                    className="bg-secondary text-base"
                />
                <Input 
                    placeholder={t('signup.placeholder.confirmPassword')}
                    className="bg-secondary text-base"
                />
                <Button className="mt-1 py-4">
                    {t('signup.submit')}
                </Button>
            </form>
        </Modal>
    )
}