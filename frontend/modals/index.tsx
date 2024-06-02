export default function Modal({ children }: {
    children: React.ReactNode;
}) {
    return(
        <div 
            data-testid="modal"
            className="w-modal max-w-full z-10 fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-primary pointer-events-auto rounded-lg"
        >
            {children}
        </div>
    )
}