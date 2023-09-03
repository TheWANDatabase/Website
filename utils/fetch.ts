/* eslint-disable no-console */
export function fetcher (url: string, options: any = {}, retries: number = 3): any {
  console.debug(`Fetching URL ${url} `)
  return fetch(url, options)
    .then((res: any) => {
      if (res.ok) {
        return res
      }
      console.warn(`Fetch failed for URL ${url} (Trying again in 250ms)`)
      if (retries > 0) {
        return new Promise(resolve => setTimeout(resolve, 250))
          .then(() => {
            return fetcher(url, options, retries - 1)
          })
      }
      throw new Error(res.status)
    })
    .catch(error => console.error(error.message))
}
