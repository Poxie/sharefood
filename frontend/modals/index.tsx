export default function Modal({ children }: {
    children: React.ReactNode;
}) {
    return(
        <div data-testid="modal">
            {children}
        </div>
    )
}