import { User, UserCreateResponse } from "@/types";
import fetchFromAPI, { FetchOptions } from "..";

export async function getCurrentUser(options: FetchOptions = {}) {
    const user = await fetchFromAPI<User>('/users/me', options);
    return user;
}

export async function createUser({ username, password }: {
    username: string;
    password: string;
}) {
    const user = await fetchFromAPI<UserCreateResponse>('/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    })
    return user;
}