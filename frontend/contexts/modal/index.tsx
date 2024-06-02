import React, { useState } from 'react';

const ModalContext = React.createContext<null | {
    setModal: (modal: React.ReactNode) => void;
    closeModal: () => void;
}>(null);

export const useModal = () => {
    const context = React.useContext(ModalContext);
    if(!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export default function ModalProvider({ children }: {
    children: React.ReactNode;
}) {
    const [modal, setModal] = useState<null | React.ReactNode>(null);

    const closeModal = () => setModal(null);

    const value = {
        setModal,
        closeModal,
    }
    return(
        <ModalContext.Provider value={value}>
            {children}
            <div 
                data-testid="modal-container"
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
            >
                {modal}
                {modal && (
                    <div 
                        data-testid="modal-backdrop"
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
                        onClick={closeModal}
                    />
                )}
            </div>
        </ModalContext.Provider>
    )
}