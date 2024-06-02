import { useTranslations } from "next-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";

export default function SignupModal() {
    const t = useTranslations('modal');
    
    return(
        <Modal>
            <ModalHeader>
                {t('signup.title')}
            </ModalHeader>
        </Modal>
    )
}