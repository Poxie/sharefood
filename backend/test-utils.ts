import { User } from "@prisma/client";

export const mockUser: (excludedFields?: (keyof User)[]) => User = (excludedFields=[]) => {
    const user = {
        id: '1',
        username: 'test',
        password: 'password',
        createdAt: new Date().getTime().toString(),
        isAdmin: false,
    }
    return excludedFields.reduce((acc, field) => {
        delete acc[field];
        return acc;
    }, user);
};

export function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): Omit<User, Key> {
    return Object.fromEntries(
        Object.entries(user as { [k: string]: unknown }).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<User, Key>;
}