import * as fetchFromAPI from "@/api";
import { loginUser } from "@/api/user";
import mockUser from "@/test-constants";

describe('loginUser', () => {
    it('should log the user in', async () => {
        const user = mockUser();
        const password = 'password';

        const fetchSpy = jest.spyOn(fetchFromAPI, 'default').mockResolvedValue(user);

        const fetchData = { username: user.username, password };
        const response = await loginUser(fetchData);

        expect(response).toEqual(user);
        expect(fetchSpy).toHaveBeenCalledWith('/login', {
            method: 'POST',
            body: JSON.stringify(fetchData),
        });
    })
    it('should throw an error if the authentication fails', async () => {
        const error = new Error('Username or password is incorrect.');

        jest.spyOn(fetchFromAPI, 'default').mockRejectedValue(error);

        await expect(loginUser({ username: 'username', password: 'password' })).rejects.toThrow(error);
    })
})