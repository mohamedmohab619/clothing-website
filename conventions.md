# Conventions

## Data Fetching
- Use [**SWR**](https://vercel.com/oss/swr) for client fetching, not raw `fetch` in `useEffect`.

## API Endpoints
- ==get resource== and ==create resource== functions are at `/api/resource`
- ==get resource by Id==, ==update resource==, and ==delete resource== functions are at `/api/resource/[id]` since they need ID

### Guest VS User
- some endpoints allow guests, others don't
- guest allowing endpoints are under `/api` like `/api/orders`
- endpoints that does ==**NOT**== allow guests are under `/api/me` like `/api/me/addresses`

