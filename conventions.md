# Conventions

## Data Fetching
- Use [**SWR**](https://vercel.com/oss/swr) for client fetching, not raw `fetch` in `useEffect`.

## API Endpoints
- some endpoints allow guests, others don't
- guest allowing endpoints are under `/api` like `/api/orders`
- endpoints that does ==**NOT**== allow guests are under `/api/me` like `/api/me/addresses`

