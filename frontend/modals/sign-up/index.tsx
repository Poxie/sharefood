import { useTranslations } from "next-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import Feedback, { FeedbackProps } from "../../components/feedback";

export default function SignupModal() {
    const t = useTranslations();

    const [info, setInfo] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [feedback, setFeedback] = useState<null | FeedbackProps>(null);

    const updateInfo = (key: keyof typeof info, value: string) => {
        setFeedback(null);
        setInfo(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!info.username || !info.password || !info.confirmPassword) {
            setFeedback({
                message: t('error.emptyFields'),
                type: 'danger',
            })
            return;
        }
        if(info.password !== info.confirmPassword) {
            setFeedback({
                message: t('error.passwordsDontMatch'),
                type: 'danger',
            })
            return;
        }
    }
    
    return(
        <Modal>
            <ModalHeader>
                {t('modal.signup.title')}
            </ModalHeader>
            <form 
                data-testid="signup-form"
                className="p-4 pt-0 grid gap-2"
                onSubmit={handleSubmit}
            >
                <Input 
                    placeholder={t('modal.signup.placeholder.username')}
                    className="bg-secondary text-base"
                    onChange={text => updateInfo('username', text)}
                />
                <Input 
                    placeholder={t('modal.signup.placeholder.password')}
                    className="bg-secondary text-base"
                    onChange={text => updateInfo('password', text)}
                />
                <Input 
                    placeholder={t('modal.signup.placeholder.confirmPassword')}
                    className="bg-secondary text-base"
                    onChange={text => updateInfo('confirmPassword', text)}
                />
                {feedback && (
                    <Feedback {...feedback} />
                )}
                <Button className="mt-1 py-4">
                    {t('modal.signup.submit')}
                </Button>
            </form>
        </Modal>
    )
}