"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [modal, setModal] = useState<null | {
        id: string;
        modalElement: React.ReactNode;
    }>(null);

    const _setModal = (modal: React.ReactNode) => {
        setModal({
            id: Math.random().toString(),
            modalElement: modal,
        });
        document.body.style.overflow = 'hidden';
    }
    const closeModal = () => {
        setModal(null);
        document.body.style.overflow = '';
    }

    const value = {
        setModal: _setModal,
        closeModal,
    }
    return(
        <ModalContext.Provider value={value}>
            {children}
            <div 
                data-testid="modal-container"
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
            >
                {process.env.NODE_ENV === 'test' ? modal?.modalElement : (
                    <AnimatePresence>
                        <div key={modal?.id}>
                            {modal?.modalElement}
                        </div>
                    </AnimatePresence>
                )}
                <AnimatePresence mode="wait">
                    {modal && (
                        <motion.div 
                            data-testid="modal-backdrop"
                            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 pointer-events-auto"
                            onClick={closeModal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ bounce: false, duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </ModalContext.Provider>
    )
}