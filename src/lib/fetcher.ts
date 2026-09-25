// src/lib/fetcher.ts

//use this since fetch doesn't throw on 4xx/5xx and SWR only sets error when the fetcher throws.
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}
