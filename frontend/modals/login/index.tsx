import { useTranslations } from "use-intl";
import Modal from "..";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import Feedback, { FeedbackProps } from "@/components/feedback";
import useLoginUser from "@/hooks/users/useLoginUser";
import { useModal } from "@/contexts/modal";
import SignupModal from "../sign-up";
import useRefetchQueries from "@/hooks/react-query/useRefetchQueries";
import EyeIcon from "@/assets/icons/EyeIcon";
import EyeOffIcon from "@/assets/icons/EyeOffIcon";

export default function LoginModal() {
    const t = useTranslations();

    const refetchQuery = useRefetchQueries();

    const { setModal, closeModal } = useModal();

    const { mutateAsync, isPending } = useLoginUser();

    const [showPassword, setShowPassword] = useState(false);
    const [info, setInfo] = useState({
        username: '',
        password: '',
    })
    const [feedback, setFeedback] = useState<null | FeedbackProps>(null);

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    const switchToSignup = () => setModal(<SignupModal />);

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

        try {
            await mutateAsync({ username, password });
            refetchQuery(['current-user']);
            closeModal();
        } catch(error) {
            setFeedback({
                type: 'danger',
                message: (error as Error).message,
            })
        }
    }

    return(
        <Modal>
            <ModalHeader>
                {t('modal.login.title')}
            </ModalHeader>
            <form 
                onSubmit={onSubmit}
                className="p-4 pt-0 grid gap-2"
            >
                <Input 
                    placeholder={t('modal.login.placeholder.username')}
                    onChange={text => onChange('username', text)}
                />
                <Input 
                    onButtonClick={togglePasswordVisibility}
                    buttonIcon={showPassword ? <EyeOffIcon className="w-6" /> : <EyeIcon className="w-6" />}
                    placeholder={t('modal.login.placeholder.password')}
                    onChange={text => onChange('password', text)}
                    type={showPassword ? 'text' : 'password'}
                />
                {feedback && (
                    <Feedback {...feedback} />
                )}
                <Button 
                    disabled={isPending}
                    className="mt-1 py-4"
                >
                    {!isPending ? (
                        t('modal.login.submit')
                        ) : (
                        t('modal.login.submitting')
                    )}
                </Button>
            </form>
            <div className="p-5 flex justify-center bg-secondary rounded-b-lg">
                <button 
                    className="text-sm hover:underline"
                    onClick={switchToSignup}
                >
                    {t('modal.login.switchToSignup')}
                </button>
            </div>
        </Modal>
    )
}