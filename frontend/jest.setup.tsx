jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />
    },
}))