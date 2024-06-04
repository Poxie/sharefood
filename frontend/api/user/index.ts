import { UserCreateResponse } from "@/types";
import fetchFromAPI from "..";

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