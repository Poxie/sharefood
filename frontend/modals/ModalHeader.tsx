import CloseIcon from "@/assets/icons/CloseIcon";
import { useModal } from "@/contexts/modal";

export default function ModalHeader({ children }: {
    children: React.ReactNode;
}) {
    const { closeModal } = useModal();

    return(
        <div 
            data-testid="modal-header"
            className="p-4 flex items-center justify-between gap-4"
        >
            <h2 className="text-2xl font-semibold">
                {children}
            </h2>
            <button 
                aria-label="Close modal"
                onClick={closeModal}
                className="p-1.5 -m-1.5 hover:bg-tertiary rounded-md transition-colors"
            >
                <CloseIcon className="w-6" />
            </button>
        </div>
    )
}