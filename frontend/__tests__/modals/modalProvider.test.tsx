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
    const openModal = () => {
        const openModalButton = screen.getByText('Open Modal');
        fireEvent.click(openModalButton);
    }
    const closeModal = () => {
        const closeModalButton = screen.getByText('Close Modal');
        fireEvent.click(closeModalButton);
    }

    describe('Render the providers children and modal container', () => {
        beforeEach(() => {
            render(<span data-testid="regular-body-content" />);
        })

        it('should render the children', () => {
            const content = screen.getByTestId('regular-body-content');
            expect(content).toBeInTheDocument();
        })
        it('should render the modal container', () => {
            const container = screen.getByTestId('modal-container');
            expect(container).toBeInTheDocument();
        })
    })
    describe('useModal hook functions', () => {
        beforeEach(() => {
            render(<CustomTest />)
        })

        it('should render the modal component when set using hook', () => {
            openModal();
    
            const modal = screen.getByTestId('modal');
            expect(modal).toBeInTheDocument();
        })
        it('should close the modal when closeModal function is called', () => {
            openModal();
    
            const closeButton = screen.getByText('Close Modal');
            fireEvent.click(closeButton);
    
            const modal = screen.queryByTestId('modal');
            expect(modal).not.toBeInTheDocument();
        })
    })
    describe('ModalProvider active state changes', () => {
        beforeEach(() => {
            render(<CustomTest />)
        })

        it('renders a backdrop when a modal is set', () => {
            openModal();
    
            const backdrop = screen.getByTestId('modal-backdrop');
            expect(backdrop).toBeInTheDocument();
        })
        it('closes the modal when the backdrop is clicked', () => {
            openModal();
    
            const backdrop = screen.getByTestId('modal-backdrop');
            fireEvent.click(backdrop);
    
            const modal = screen.queryByTestId('modal');
            expect(modal).not.toBeInTheDocument();
        })
        it('prevents scrolling when a modal is open', () => {
            openModal();
    
            const body = document.body;
            expect(body).toHaveStyle('overflow: hidden');
        })
        it('restores page scrolling when the modal is closed', () => {
            openModal();
    
            const closeButton = screen.getByTestId('modal-backdrop');
            fireEvent.click(closeButton);
    
            const body = document.body;
            expect(body).not.toHaveStyle('overflow: hidden');
        })
    })
    describe('Render without modal provider', () => {
        it('should throw an error if used outside of the provider', () => {
            jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
            expect(() => renderWithoutProviders(<CustomTest />)).toThrow('useModal must be used within a ModalProvider');
            jest.restoreAllMocks();
        })
    })
})