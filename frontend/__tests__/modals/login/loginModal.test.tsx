import '@testing-library/jest-dom';
import LoginModal from '@/modals/login';
import { fireEvent, render, screen } from '@/test-utils';
import messages from '@/messages/en.json';
import * as useLoginUser from '@/hooks/users/useLoginUser';
import { UseMutationResult } from '@tanstack/react-query';
import { User } from '@/types';

describe('LoginModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    describe('Structure and validation', () => {
        beforeEach(() => {
            jest.spyOn(useLoginUser, 'default').mockReturnValue({} as any);
            render(<LoginModal />);
        })

        it('should render the login modal', () => {
            const modal = screen.getByTestId('modal');
            expect(modal).toBeInTheDocument();
        })
        it('should render the header text', () => {
            const header = screen.getByText(messages.modal.login.title);
            expect(header).toBeInTheDocument();
        })
        it('should render the login form inputs', () => {
            const username = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
            const password = screen.getByPlaceholderText(messages.modal.login.placeholder.password);
    
            expect(username).toBeInTheDocument();
            expect(password).toBeInTheDocument();
        })
        it('should render the login button', () => {
            const button = screen.getByRole('button', { name: messages.modal.login.submit });
            expect(button).toBeInTheDocument();
        })
        describe.each([
            { username: '', password: '' },
            { username: '', password: 'password' },
            { username: 'username', password: '' },
        ])('should show an error if the form is submitted with empty fields', ({ username, password }) => {
            it('should show an error', () => {
                const usernameInput = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
                const passwordInput = screen.getByPlaceholderText(messages.modal.login.placeholder.password);
    
                fireEvent.change(usernameInput, { target: { value: username } });
                fireEvent.change(passwordInput, { target: { value: password } });
    
                const button = screen.getByRole('button', { name: messages.modal.login.submit });
                fireEvent.click(button);
    
                const error = screen.getByText(messages.error.emptyFields);
    
                expect(error).toBeInTheDocument();
            })
        })
    })

    describe('Mutations', () => {
        it('should call the login mutation on form submission', async () => {
            const mutateFn = jest.fn();
            jest.spyOn(useLoginUser, 'default').mockReturnValue({
                mutate: mutateFn,
            } as any);

            render(<LoginModal />)

            const usernameInput = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
            const passwordInput = screen.getByPlaceholderText(messages.modal.login.placeholder.password);
    
            const username = 'username';
            const password = 'password';

            fireEvent.change(usernameInput, { target: { value: username } });
            fireEvent.change(passwordInput, { target: { value: password } });
    
            const button = screen.getByRole('button', { name: messages.modal.login.submit });
            fireEvent.click(button);
    
            expect(mutateFn).toHaveBeenCalledWith({ username, password });
        })
    })
})