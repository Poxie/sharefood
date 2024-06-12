declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            BCRYPT_SALT_ROUNDS: string;
            JWT_PRIVATE_KEY: string;
            CLIENT_URL: string;
        }
    }
    namespace Express {
        interface Locals {
            userId: string | undefined;
            isAdmin: boolean | undefined;
        }
    }
}

export {};