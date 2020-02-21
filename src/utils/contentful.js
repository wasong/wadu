import { createClient } from 'contentful'

const contentful = createClient({
  space: process.env.CONTENTFUL.SPACE_ID,
  accessToken: process.env.CONTENTFUL.DELIVERY_API,
})

export default contentful
