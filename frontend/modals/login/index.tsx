import { useTranslations } from "use-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";

export default function LoginModal() {
    const t = useTranslations('modal');

    return(
        <Modal>
            <ModalHeader>
                {t('login.title')}
            </ModalHeader>
            <form>
                <Input 
                    placeholder={t('login.placeholder.username')}
                />
                <Input 
                    placeholder={t('login.placeholder.password')}
                />
                <Button>
                    {t('login.submit')}
                </Button>
            </form>
        </Modal>
    )
}