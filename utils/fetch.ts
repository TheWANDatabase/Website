/* eslint-disable no-console */

export async function fetcher(url: string, options: any = {}, retries: number = 3): Promise<any> {
  const cfg = useRuntimeConfig()

  const uri = `${cfg.public.api_base}/${url}`

  if (options.headers) {
    options.headers['Content-Type'] = 'application/json'
  }
  if (!options.headers) {
    options.headers = {'Content-Type': 'application/json'}
  }


  return fetch(uri, options)
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
    .then((res: any) => {
      return res;
    })
    .catch(error => console.error(error.message))
}
