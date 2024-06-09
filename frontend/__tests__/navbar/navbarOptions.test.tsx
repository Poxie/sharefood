import '@testing-library/jest-dom';
import NavbarOptions from '@/components/navbar/NavbarOptions'
import mockUser from '@/test-constants';
import { render, screen, waitFor } from '@/test-utils'
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { User } from '@/types';
import * as useCurrentUser from '@/hooks/users/useCurrentUser';

describe('NavbarOptions', () => {
    const renderNavbarOptions = () => {
        const queryClient = new QueryClient();
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        render(
            <Wrapper>
                <NavbarOptions />
            </Wrapper>
        )
    }
    const mockUseCurrentUser = ({ data=undefined, isPending=false }: {
        data?: User | null;
        isPending?: boolean;
    }) => {
        jest.spyOn(useCurrentUser, 'default').mockReturnValue({
            data,
            isPending,
        } as UseQueryResult<User>)
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