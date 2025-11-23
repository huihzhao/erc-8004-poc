import { Client, cacheExchange, fetchExchange } from 'urql';

export const client = new Client({
    url: 'http://localhost:42069/graphql',
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }),
    // Force POST requests (urql uses GET by default for queries)
    preferGetMethod: false,
});
