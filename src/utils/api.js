import fetch from 'node-fetch'
import qs from 'querystring'
import urljoin from 'url-join'

const api = async (uri, options = {}) => {
  const {
    method = 'GET', body, headers = {}, query,
  } = options
  const url = query ? `${uri}?${qs.stringify(query)}` : uri
  const isFormData = body instanceof FormData

  const mergedHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  }
  if (isFormData) {
    delete mergedHeaders['Content-Type']
  }

  const response = await fetch(url, {
    headers: mergedHeaders,
    method,
    body: isFormData ? body : JSON.stringify(body),
  })

  if (!response.ok) {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  return response.json()
}

export const omnaeApi = (endpoint, options = {}) => {
  const url = process.env.API_URL
  const joinedUrl = urljoin(url, endpoint)

  return api(joinedUrl, options)
}

export default api
