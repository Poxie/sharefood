import Users, { generateUserId } from '@/utils/users';
import { prismaMock } from '../../../singleton';
import { User } from '@prisma/client';
import { ID_LENGTH } from '@/utils/constants';

// Mock data
const mockUser: (excludedFields?: (keyof User)[]) => User = (excludedFields=[]) => {
    const user = {
        id: '1',
        username: 'test',
        password: 'password',
        createdAt: new Date().getTime().toString(),
    }
    return excludedFields.reduce((acc, field) => {
        delete acc[field];
        return acc;
    }, user);
};

describe('Users Utils', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('generateUserId', () => {
        it('should generate a random user ID', async () => {
            const id = await generateUserId();
            expect(typeof id).toBe('string');
            expect(id.length).toBe(ID_LENGTH);
        })
        it('should check if ID already exists', async () => {
            const spy = jest.spyOn(Users, 'getUserById');

            await generateUserId();
            
            expect(spy).toHaveBeenCalledTimes(1);
        })
        it('should generate a new ID if ID already exists', async () => {
            const spy = jest.spyOn(Users, 'getUserById')
                .mockResolvedValueOnce(mockUser())
                .mockResolvedValueOnce(null);

            await generateUserId();
            
            expect(spy).toHaveBeenCalledTimes(2);
        })
    })
})