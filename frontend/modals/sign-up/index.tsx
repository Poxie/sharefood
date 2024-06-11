import { useTranslations } from "next-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import Feedback, { FeedbackProps } from "../../components/feedback";
import useCreateUser from "@/hooks/users/useCreateUser";
import { useModal } from "@/contexts/modal";
import LoginModal from "../login";
import useRefetchQueries from "@/hooks/react-query/useRefetchQueries";

export default function SignupModal() {
    const t = useTranslations();

    const refetch = useRefetchQueries();

    const { setModal, closeModal } = useModal();

    const { isPending, mutateAsync, error } = useCreateUser();

    const [info, setInfo] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [feedback, setFeedback] = useState<null | FeedbackProps>(null);

    const switchToLogin = () => setModal(<LoginModal />);

    const updateInfo = (key: keyof typeof info, value: string) => {
        setFeedback(null);
        setInfo(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { username, password, confirmPassword } = info;

        if(!username || !password || !confirmPassword) {
            setFeedback({
                message: t('error.emptyFields'),
                type: 'danger',
            })
            return;
        }
        if(password !== confirmPassword) {
            setFeedback({
                message: t('error.passwordsDontMatch'),
                type: 'danger',
            })
            return;
        }

        try {
            await mutateAsync({ username, password });
            refetch(['current-user']);
            closeModal();
        } catch(error) {
            console.error(error);
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
                    type="password"
                />
                <Input 
                    placeholder={t('modal.signup.placeholder.confirmPassword')}
                    className="bg-secondary text-base"
                    onChange={text => updateInfo('confirmPassword', text)}
                    type="password"
                />
                {feedback && (
                    <Feedback {...feedback} />
                )}
                {error && (
                    <Feedback 
                        message={error.message}
                        type="danger"
                    />
                )}
                <Button 
                    className="mt-1 py-4"
                    disabled={isPending}
                >
                    {!isPending ? (
                        t('modal.signup.submit')
                    ) : (
                        t('modal.signup.submitting')
                    )}
                </Button>
            </form>
            <div className="p-5 flex justify-center bg-secondary rounded-b-lg">
                <button 
                    className="text-sm hover:underline"
                    onClick={switchToLogin}
                >
                    {t('modal.signup.switchToLogin')}
                </button>
            </div>
        </Modal>
    )
}