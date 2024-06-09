import * as fetchAPI from "@/api";
import mockUser from "@/test-constants";
import { createUser } from '@/api/user';

describe('createUser', () => {
    const user = mockUser();
    const password = 'password';

    const requestBody = { username: user.username, password };

    it('should return the user data & access token when request is successful', async () => {
        const user = mockUser();
        const data = {
            user: mockUser(),
            accessToken: 'accesstoken',
        }
        
        jest.spyOn(fetchAPI, 'default').mockResolvedValue(data);

        const response = await createUser(requestBody);

        expect(response).toEqual(data);
    })
    it('should throw an error if the request is not successful', async () => {
        const error = new Error('An error occurred');
        
        jest.spyOn(fetchAPI, 'default').mockRejectedValue(error);

        await expect(createUser(requestBody)).rejects.toThrow(error);
    })
})