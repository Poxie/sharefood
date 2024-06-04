import { User } from "./types";

export default function mockUser<T extends string>(excludeFields?: (keyof User)[]) {
    const user = {
        id: '1',
        username: 'test',
        createdAt: Date.now().toString(),
        isAdmin: false,
    };
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !excludeFields?.includes(key as keyof User))
    ) as T extends keyof User ? Omit<User, T> : User;
}