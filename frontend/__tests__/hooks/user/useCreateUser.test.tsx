import useCreateUser from "@/hooks/users/useCreateUser"
import { QueryWrapper, act, renderHook, waitFor } from '@/test-utils';
import * as UserAPI from '@/api/user';
import mockUser from "@/test-constants";

describe('useCreateUser', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('updates the user on success', async () => {
        const data = {
            user: mockUser(),
            accessToken: 'accesstoken',
        }
        jest.spyOn(UserAPI, 'createUser').mockResolvedValue(data);

        const { result } = renderHook(() => useCreateUser(), { wrapper: QueryWrapper });

        await result.current.mutateAsync({ 
            username: data.user.username,
            password: 'password',
        })

        await waitFor(() => {
            return result.current.isSuccess;
        })

        expect(result.current.data).toEqual(data);
    })
    it('handles errors', async () => {
        const error = new Error('An error occurred');
        jest.spyOn(UserAPI, 'createUser').mockRejectedValue(error);

        const { result } = renderHook(() => useCreateUser(), { wrapper: QueryWrapper });

        expect(result.current.mutateAsync({ 
            username: 'test',
            password: 'password',
        })).rejects.toThrow(error);
    })
})