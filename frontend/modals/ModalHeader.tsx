import CloseIcon from "@/assets/icons/CloseIcon";
import { useModal } from "@/contexts/modal";

export default function ModalHeader({ children }: {
    children: React.ReactNode;
}) {
    const { closeModal } = useModal();

    return(
        <div 
            data-testid="modal-header"
        >
            {children}
            <button 
                aria-label="Close modal"
                onClick={closeModal}
            >
                <CloseIcon className="w-6" />
            </button>
        </div>
    )
}