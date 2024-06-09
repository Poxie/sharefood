import useCreateUser from "@/hooks/users/useCreateUser"
import { act, renderHook, waitFor } from '@/test-utils';
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import * as UserAPI from '@/api/user';
import mockUser from "@/test-constants";

jest.mock('@/api/user', () => ({
    createUser: jest.fn(),
}))

describe('useCreateUser', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;
    
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                }
            }
        });
    
        wrapper = ({ children }: {
            children: React.ReactNode;
        }) => {
            return(
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            )
        }
    });
    afterEach(() => {
        queryClient.clear();
        jest.resetAllMocks();
    });

    it('updates the user on success', async () => {
        const data = {
            user: mockUser(),
            accessToken: 'accesstoken',
        }

        jest.spyOn(UserAPI, 'createUser').mockResolvedValue(data);

        const { result } = renderHook(() => useCreateUser(), { wrapper });

        await act(async () => {
            result.current.createUser({ 
                username: data.user.username,
                password: 'password',
            })
        })

        await waitFor(() => {
            return result.current.isSuccess;
        })

        expect(result.current.data).toEqual(data);
    })
    it('handles errors', async () => {
        const error = new Error('An error occurred');
        jest.spyOn(UserAPI, 'createUser').mockRejectedValue(error);

        const { result } = renderHook(() => useCreateUser(), { wrapper });

        await act(async () => {
            result.current.createUser({ 
                username: 'test',
                password: 'password',
            })
        })

        await waitFor(() => {
            return result.current.isError;
        })

        expect(result.current.error).toEqual(error);
    })
})