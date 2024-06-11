import UserUtils from "@/utils/users/userUtils";
import { mockUser } from "../../../../test-utils";

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
})