import * as UserAPI from '@/api/user';
import useCurrentUser from '@/hooks/users/useCurrentUser';
import mockUser from "@/test-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from '@testing-library/react';

describe('useCurrentUser', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode; }>

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                }
            }
        });
        wrapper = ({ children }: { children: React.ReactNode; }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    it('returns the current user on success', async () => {
        const user = mockUser();
        
        jest.spyOn(UserAPI, 'getCurrentUser').mockResolvedValue(user);

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(user);
    })
    it('returns an error on request failure', async () => {
        const error = new Error('usernotloggedinerror');
        jest.spyOn(UserAPI, 'getCurrentUser').mockRejectedValue(error);

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(error);
    })
    it('shows a pending state while fetching the user', async () => {
        jest.spyOn(UserAPI, 'getCurrentUser').mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        expect(result.current.isPending).toBe(true);
    })
})