import * as fetchAPI from "@/api";
import { getMyUser } from "@/api/user"
import mockUser from "@/test-constants";

describe('getMyUser', () => {
    it('should get the user', async () => {
        const mockedUser = mockUser();

        const spy = jest.spyOn(fetchAPI, 'default').mockResolvedValue(mockedUser);

        const user = await getMyUser();

        expect(user).toEqual(mockedUser);
    })
    it('should throw an error if the user is not logged in', async () => {
        const expectedError = new Error('notloggedinerror');
        jest.spyOn(fetchAPI, 'default').mockRejectedValue(expectedError);

        let error;
        try {
            await getMyUser();
        } catch(err) {
            error = err;
        }
        expect(error).toEqual(expectedError);
    })
})