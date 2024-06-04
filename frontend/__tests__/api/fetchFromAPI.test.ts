import fetchFromAPI from "@/api";

global.fetch = jest.fn();

describe('fetchFromAPI', () => {
    const data = { message: 'Hello, world!' };
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    }

    let spy: jest.SpyInstance;
    beforeEach(() => {
        spy = jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(data),
            } as any)
        );
    })
    afterEach(() => {
        spy.mockRestore();
    })

    it('should fetch data from the API using GET request', async () => {
        const path = '/test';
        const response = await fetchFromAPI(path, {
            method: 'GET',
        });

        expect(response).toEqual(data);
        expect(spy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
            ...defaultOptions,
            method: 'GET',
        });
    })
    it('should throw an error if the response is not ok', async () => {
        const errorMessage = 'Something went wrong';
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: errorMessage }),
            } as any)
        );

        let error;
        try {
            await fetchFromAPI('/test', {
                method: 'GET',
            });
        } catch(err) {
            error = err;
        }

        expect(error).toEqual(new Error(errorMessage));
    })
    describe.each([
        { method: 'PUT' },
        { method: 'POST' },
        { method: 'PATCH' },
        { method: 'DELETE' },
    ])('should send requests with different HTTP methods', (options) => {
        it(`should make a ${options.method} request`, async () => {
            const path = '/test';
            const response = await fetchFromAPI(path, {
                method: options.method,
            });

            expect(response).toEqual(data);
            expect(spy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
                ...defaultOptions,
                method: options.method,
            });
        })
    })
    describe.each([
        { method: 'PUT' },
        { method: 'POST' },
        { method: 'PATCH' },
    ])('should send body with update requests', (options) => {
        it(`${options.method} request`, async () => {
            const path = '/test';
            const response = await fetchFromAPI(path, {
                method: options.method,
                body: JSON.stringify(data),
            });

            expect(response).toEqual(data);
            expect(spy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
                ...defaultOptions,
                method: options.method,
                body: JSON.stringify(data),
            });
        })
    })
})