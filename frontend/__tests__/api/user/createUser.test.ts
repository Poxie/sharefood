import * as fetchAPI from "@/api";
import { createUser } from "@/api/user";
import mockUser from "@/test-constants";

jest.mock('@/api');

describe('createUser', () => {
    it('should create a user', async () => {
        const password = 'password';
        const data = {
            user: mockUser(),
            accessToken: 'accesstoken',
        }
        const spy = jest.spyOn(fetchAPI, 'default').mockResolvedValue(data);

        const response = await createUser({
            username: data.user.username,
            password,
        });

        expect(response).toEqual(data);
        expect(spy).toHaveBeenCalledWith('/users', {
            method: 'POST',
            body: JSON.stringify({ username: data.user.username, password }),
        })
    })
})