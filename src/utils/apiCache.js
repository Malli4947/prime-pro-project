/**
 * Lightweight in-memory API cache with TTL.
 * Prevents duplicate fetches across components and page navigations.
 */

const cache = new Map();
const DEFAULT_TTL = 60_000; // 1 minute

export async function cachedFetch(url, ttl = DEFAULT_TTL) {
  const now = Date.now();
  const hit = cache.get(url);

  // Return cached value if still fresh
  if (hit && now - hit.ts < ttl) {
    return hit.data;
  }

  // If a request is already in-flight for this URL, wait for it
  if (hit?.promise) {
    return hit.promise;
  }

  // Start new request and store the promise so parallel callers share it
  const promise = fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      cache.set(url, { data, ts: Date.now(), promise: null });
      return data;
    })
    .catch(err => {
      // Remove failed entry so next call retries
      cache.delete(url);
      throw err;
    });

  cache.set(url, { data: null, ts: 0, promise });
  return promise;
}

/** Manually invalidate a cached URL (e.g. after a mutation) */
export function invalidateCache(url) {
  cache.delete(url);
}

/** Clear the entire cache */
export function clearCache() {
  cache.clear();
}
