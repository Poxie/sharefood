export type User = {
    id: string;
    username: string;
    createdAt: string;
    isAdmin: boolean;
}
export type UserCreateResponse = {
    user: User;
    accessToken: string;
}