import { useTranslations } from "use-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import Feedback, { FeedbackProps } from "@/components/feedback";
import useLoginUser from "@/hooks/users/useLoginUser";

export default function LoginModal() {
    const t = useTranslations();

    const { mutate, isPending, error } = useLoginUser();

    const [info, setInfo] = useState({
        username: '',
        password: '',
    })
    const [feedback, setFeedback] = useState<null | FeedbackProps>(null);

    const onChange = (key: keyof typeof info, value: string) => {
        setInfo(prev => ({
            ...prev,
            [key]: value,
        }))
    }
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { username, password } = info;

        if(!username || !password) {
            setFeedback({
                type: 'danger',
                message: t('error.emptyFields'),
            })
            return;
        }

        mutate({ username, password });
    }

    return(
        <Modal>
            <ModalHeader>
                {t('modal.login.title')}
            </ModalHeader>
            <form onSubmit={onSubmit}>
                <Input 
                    placeholder={t('modal.login.placeholder.username')}
                    onChange={text => onChange('username', text)}
                />
                <Input 
                    placeholder={t('modal.login.placeholder.password')}
                    onChange={text => onChange('password', text)}
                />
                {feedback && (
                    <Feedback {...feedback} />
                )}
                {error && (
                    <Feedback type="danger" message={error.message} />
                )}
                <Button disabled={isPending}>
                    {!isPending ? (
                        t('modal.login.submit')
                        ) : (
                        t('modal.login.submitting')
                    )}
                </Button>
            </form>
        </Modal>
    )
}