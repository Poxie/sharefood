export default async function fetchFromAPI<T>(url: string, options: RequestInit = {}) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
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