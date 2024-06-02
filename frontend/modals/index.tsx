import { motion } from 'framer-motion';

export default function Modal({ children }: {
    children: React.ReactNode;
}) {
    return(
        <motion.div 
            data-testid="modal"
            initial={{ scale: 0.95, opacity: 0, translateY: '-40%', translateX: '-50%' }}
            animate={{ scale: 1, opacity: 1, translateY: '-50%', translateX: '-50%' }}
            exit={{ scale: 0.95, opacity: 0, translateY: '-40%', translateX: '-50%' }}
            transition={{ bounce: false, duration: 0.2 }}
            className="w-modal max-w-full z-10 fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-primary pointer-events-auto rounded-lg"
        >
            {children}
        </motion.div>
    )
}