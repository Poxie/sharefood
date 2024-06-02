import '@testing-library/jest-dom';
import { render, screen } from '@/test-utils';
import ModalProvider from '../../contexts/modal';

describe('ModalProvider', () => {
    beforeEach(() => {
        render(
            <ModalProvider>
                <span data-testid="regular-body-content" />
            </ModalProvider>
        )
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