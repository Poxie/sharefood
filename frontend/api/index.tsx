export type FetchOptions = RequestInit;
export type FetchHeaders = Record<string, string>;
export type FetchArguments = Partial<{
    options: FetchOptions;
    headers: FetchHeaders;
}>

export default async function fetchFromAPI<T>(url: string, options: FetchOptions = {}) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
        ...options,
    })
        .then(async res => {
            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message);
            }

            return data as T;
        })
}