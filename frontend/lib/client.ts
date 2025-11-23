import { Client, cacheExchange, fetchExchange } from 'urql';

export const client = new Client({
    url: 'http://localhost:42069/graphql',
    exchanges: [cacheExchange, fetchExchange],
});
