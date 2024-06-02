import '@testing-library/jest-dom';
import ModalHeader from '@/modals/ModalHeader';
import { fireEvent, render, screen } from '@/test-utils';
import ModalProvider, * as ModalContext from '@/contexts/modal';

describe('ModalHeader', () => {
    const closeMock = jest.fn();
    jest.spyOn(ModalContext, 'useModal')
        .mockImplementation(() => ({ 
            setModal: jest.fn(),
            closeModal: closeMock,
        }));

    beforeEach(() => {
        render(
            <ModalProvider>
                <ModalHeader>
                    header text
                </ModalHeader>
            </ModalProvider>
        );
    })
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the header text', () => {
        const header = screen.getByText('header text');
        expect(header).toBeInTheDocument();
    })
    it('should render the close button', () => {
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Close modal');
    })
    it('should call the close function when the close button is clicked', () => {
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(closeMock).toHaveBeenCalled();
    })
})