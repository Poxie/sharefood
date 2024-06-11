import '@testing-library/jest-dom';
import NavbarOptions from '@/components/navbar/NavbarOptions'
import mockUser from '@/test-constants';
import { QueryWrapper, render, screen, waitFor } from '@/test-utils'
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { User } from '@/types';
import * as useCurrentUser from '@/hooks/users/useCurrentUser';

type MutationOverrides = UseQueryResult<User, Error>;

describe('NavbarOptions', () => {
    const renderNavbarOptions = () => {
        render(
            <QueryWrapper>
                <NavbarOptions />
            </QueryWrapper>
        )
    }

    const mockUseCurrentUser = (overrides: Partial<MutationOverrides>) => {
        jest.spyOn(useCurrentUser, 'default').mockReturnValue({
            ...overrides,
        } as MutationOverrides);
    }

    it('should render tHe NavbarOptions component', () => {
        mockUseCurrentUser({});
        renderNavbarOptions();

        expect(screen.getByTestId('navbar-options')).toBeInTheDocument();
    })

    it('should render the NavbarButtons if the user is not logged in', () => {
        mockUseCurrentUser({ data: undefined });
        renderNavbarOptions();

        expect(screen.getByTestId('navbar-buttons')).toBeInTheDocument();
    })
    it('should render the NavbarButtons if the request for logged in user is pending', () => {
        mockUseCurrentUser({ isPending: true });
        renderNavbarOptions();

        expect(screen.getByTestId('navbar-buttons')).toBeInTheDocument();
    })
    it('should render the NavbarUser if the user is logged in', () => {
        const user = mockUser();

        mockUseCurrentUser({ data: user });
        renderNavbarOptions();
        
        expect(screen.getByTestId('navbar-user')).toBeInTheDocument();
    })
})