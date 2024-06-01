declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            BCRYPT_SALT_ROUNDS: string;
            JWT_PRIVATE_KEY: string;
        }
    }
    namespace Express {
        interface Locals {
            userId: string;
            isAdmin: boolean;
        }
    }
}

export {};