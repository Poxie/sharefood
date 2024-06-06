import nock from 'nock';
import mockUser from "@/test-constants";
import { createUser } from '@/api/user';

describe('createUser', () => {
    const user = mockUser();
    const password = 'password';

    const requestBody = { username: user.username, password };
    const nockRequest = (reply: {
        status: number,
        body: any,
    }) => {
        nock(process.env.NEXT_PUBLIC_API_URL)
            .post('/users', requestBody)
            .reply(reply.status, reply.body);
    }

    it('should return the user data & access token when request is successful', async () => {
        const user = mockUser();
        const data = {
            user: mockUser(),
            accessToken: 'accesstoken',
        }
        
        nockRequest({ status: 200, body: data });

        const response = await createUser(requestBody);

        expect(response).toEqual(data);
    })
    it('should throw an error if the request is not successful', async () => {
        const errorMessage = 'An error occurred';
        
        nockRequest({ status: 400, body: { message: errorMessage } });

        await expect(createUser(requestBody)).rejects.toThrow(new Error(errorMessage));
    })
})