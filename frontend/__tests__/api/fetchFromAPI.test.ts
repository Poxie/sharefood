import fetchFromAPI from "@/api";
import nock from 'nock';

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
        spy = jest.spyOn(global, 'fetch');
    })
    afterEach(() => {
        nock.cleanAll();
        spy.mockRestore();
    })

    it('should fetch data from the API using GET request by default', async () => {
        const path = '/get-request';

        nock(process.env.NEXT_PUBLIC_API_URL)
            .get(path)
            .reply(200, data);

        const response = await fetchFromAPI(path);

        expect(response).toEqual(data);
        expect(spy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
            ...defaultOptions,
        });
    })
    it('should throw an error if the response is not ok', async () => {
        const path = '/error-response';
        const errorMessage = 'Something went wrong';
        
        nock(process.env.NEXT_PUBLIC_API_URL)
            .get('/test')
            .reply(400, { message: errorMessage });

        await expect(fetchFromAPI(path)).rejects.toThrow(new Error(errorMessage));
    })
    describe.each([
        { headers: { 'header': 'headervalue' } },
        { referrerPolicy: 'no-referrer' },
        { priority: 'high' },
        { mode: 'cors' },
    ] as const)('should add options to fetch request if provided', (options) => {
        it('should add different fetch options', async () => {
            const path = '/custom-options';

            nock(process.env.NEXT_PUBLIC_API_URL)
                .get(path)
                .reply(200, data);

            const response = await fetchFromAPI(path, options);

            expect(response).toEqual(data);
            expect(spy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
                ...defaultOptions,
                ...options,
            });
        })
    })
    describe.each([
        { method: 'put' },
        { method: 'post' },
        { method: 'patch' },
        { method: 'delete' },
    ] as const)('should send requests with different HTTP methods', (options) => {
        it(`should make a ${options.method} request`, async () => {
            const path = '/method-requests';

            nock(process.env.NEXT_PUBLIC_API_URL)
                [options.method](path)
                .reply(200, data);

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
        { method: 'put' },
        { method: 'post' },
        { method: 'patch' },
    ] as const)('should send body with update requests', (options) => {
        it(`${options.method} request`, async () => {
            const path = '/provide-body';

            nock(process.env.NEXT_PUBLIC_API_URL)
                [options.method](path)
                .reply(200, data);

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