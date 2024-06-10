import mockUser from "@/test-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as UserAPI from '@/api/user';
import { act, renderHook, waitFor } from "@/test-utils";
import useLoginUser from "@/hooks/users/useLoginUser";

describe('useLoginUser', () => {
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

    it('logs in the user on success', async () => {
        const user = mockUser();
        const password = 'correctpassword';

        const loginSpy = jest.spyOn(UserAPI, 'loginUser').mockResolvedValue(user);

        const { result } = renderHook(() => useLoginUser(), { wrapper });

        const mutateData = { username: user.username, password };
        await act(async () => {
            result.current.mutate(mutateData)
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(user);
        expect(loginSpy).toHaveBeenCalledWith(mutateData);
    })
    it('throws an error if the login fails', async () => {
        const error = new Error('Username or password is incorrect.');

        jest.spyOn(UserAPI, 'loginUser').mockRejectedValue(error);

        const { result } = renderHook(() => useLoginUser(), { wrapper });

        await act(async () => {
            result.current.mutate({ username: 'username', password: 'incorrectpassword' });
        })

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(error);
    })
})