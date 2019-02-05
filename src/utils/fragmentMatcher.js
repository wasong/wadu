import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

const FragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'Features',
          possibleTypes: [
            { name: 'BooleanFeature' },
            { name: 'EnumFeature' },
          ],
        },
      ],
    },
  },
})

export default FragmentMatcher
