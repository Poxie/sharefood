declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            BCRYPT_SALT_ROUNDS: string;
        }
    }
}

export default {};