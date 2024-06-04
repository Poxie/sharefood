import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />
    },
}))