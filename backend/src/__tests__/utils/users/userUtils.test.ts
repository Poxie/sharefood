import UserUtils from "@/utils/users/userUtils";
import { mockUser } from "../../../../test-utils";
import { USER_ID_LENGTH } from "@/utils/users/userConstants";
import { prismaMock } from "../../../../singleton";
import UserQueries from "@/utils/users/userQueries";

describe('userUtils', () => {
    describe('excludeProperties', () => {
        it('should return the original user object as is if no properties are excluded', () => {
            const user = mockUser();

            const result = UserUtils.excludeProperties(user, []);

            expect(result).toEqual(user);
        })
        describe.each([
            [['username']],
            [['password']],
            [['isAdmin']],
            [['username', 'isAdmin']],
        ] as const)('excludes properties from the user object', (excludedProperties) => {
            it(`should return a user object without ${excludedProperties.join(', ')}`, () => {
                const user = mockUser();

                const result = UserUtils.excludeProperties(user, Array.from(excludedProperties));

                excludedProperties.forEach(property => {
                    expect(result).not.toHaveProperty(property);
                })
            })
        })
    })

    describe('generateUserId', () => {
        it(`returns a random string of ${USER_ID_LENGTH} characters`, async () => {
            const id = await UserUtils.generateUserId();

            expect(typeof id).toBe('string');
            expect(id).toHaveLength(USER_ID_LENGTH);
        })
        it('returns a different id each time it is called', async () => {
            const id1 = await UserUtils.generateUserId();
            const id2 = await UserUtils.generateUserId();

            expect(id1).not.toEqual(id2);
        })
        it('reruns the function if the generated id already exists', async () => {
            const spy = jest.spyOn(UserQueries, 'getUserById').mockResolvedValueOnce(mockUser());

            const id = await UserUtils.generateUserId();

            expect(typeof id).toBe('string');
            expect(id).toHaveLength(USER_ID_LENGTH);
            
            // To have been called twice, the first time the id already exists, the second time it doesn't
            expect(spy).toHaveBeenCalledTimes(2);
        })
    })
})