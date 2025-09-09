// utils/api.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// export const Base_Url = `http://localhost:4505`
export const Base_Url = `http://91.108.111.17:4505`

interface ApiCallOptions {
    method?: HttpMethod;
    data?: any;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    next?: {
        revalidate?: number;
        tags?: string[];
    };

}

export const apiCall = async <T = any>(
    url: string,
    {
        method = 'GET',
        data,
        headers = {},
        credentials,
        next
    }: ApiCallOptions = {}
): Promise<T> => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials,
        next
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const res = await fetch(`${Base_Url}${url}`, options);
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || 'API call failed');
        }
        return result.data as T;
    } catch (error: any) {
        console.error(`API Error: ${method} ${url}`, error.message);
        throw error;
    }
};
