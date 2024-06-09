import * as fetchAPI from "@/api";
import { getCurrentUser } from "@/api/user"
import mockUser from "@/test-constants";

describe('getCurrentUser', () => {
    it('should get the user', async () => {
        const mockedUser = mockUser();

        const spy = jest.spyOn(fetchAPI, 'default').mockResolvedValue(mockedUser);

        const user = await getCurrentUser();

        expect(user).toEqual(mockedUser);
    })
    it('should throw an error if the user is not logged in', async () => {
        const expectedError = new Error('notloggedinerror');
        
        jest.spyOn(fetchAPI, 'default').mockRejectedValue(expectedError);

        await expect(getCurrentUser()).rejects.toThrow(expectedError);
    })
})