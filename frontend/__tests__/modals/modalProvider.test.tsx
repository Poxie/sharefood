import '@testing-library/jest-dom';
import { render as renderWithoutProviders } from '@testing-library/react';
import { fireEvent, render, screen } from '@/test-utils';
import ModalProvider, { useModal } from '../../contexts/modal';
import Modal from '@/modals';

const CustomTest = () => {
    const { setModal, closeModal } = useModal();

    return(
        <div>
            <button onClick={() => setModal(<Modal>modal content</Modal>)}>Open Modal</button>
            <button onClick={closeModal}>Close Modal</button>
        </div>
    )
}

describe('ModalProvider', () => {
    it('should render the children', () => {
        render(<span data-testid="regular-body-content" />)

        const content = screen.getByTestId('regular-body-content');
        expect(content).toBeInTheDocument();
    })
    it('should render the modal container', () => {
        render(<span data-testid="regular-body-content" />)

        const container = screen.getByTestId('modal-container');
        expect(container).toBeInTheDocument();
    })
    it('should throw an error if used outside of the provider', () => {
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
        expect(() => renderWithoutProviders(<CustomTest />)).toThrow('useModal must be used within a ModalProvider');
        jest.restoreAllMocks();
    })
    it('should render the modal component when set using hook', () => {
        render(<CustomTest />)

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        const modal = screen.getByTestId('modal');
        expect(modal).toBeInTheDocument();
    })
    it('should render a backdrop when the modal is open', () => {
        render(<CustomTest />)

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        const backdrop = screen.getByTestId('modal-backdrop');
        expect(backdrop).toBeInTheDocument();
    })
    it('should close the modal when click on backdrop', () => {
        render(<CustomTest />)

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        const backdrop = screen.getByTestId('modal-backdrop');
        fireEvent.click(backdrop);

        const modal = screen.queryByTestId('modal');
        expect(modal).not.toBeInTheDocument();
    })
    it('should close the modal when closeModal function is called', () => {
        render(<CustomTest />)

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        const closeButton = screen.getByText('Close Modal');
        fireEvent.click(closeButton);

        const modal = screen.queryByTestId('modal');
        expect(modal).not.toBeInTheDocument();
    })
})