# Wadu

Single Page Web Application using ReactJS

### Features
- React, React-Router, Redux
- Webpack
- Emotion v9
- Hot Module Reloading
- Babel v7 + plugins
- ApolloClient for GraphQL queries
- and more!

### Requirements

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/lang/en/)

### Development Setup

Run **app** on port 8080:
```bash
$ yarn install
$ yarn start
```

Usually after code changes, the hot reloader will update the app for you.
In some cases, you may require a refresh.

### Guide

#### Connecting Component to Redux
- if a component needs to access the Redux state and actions, there are 3 ways to do it

1. Traditional `connect` and `bindActionCreators`
2. Wrapping component with `Connector` with function as a child
  - the function as a child will receive args as `{ state, actions }` for you to use
  ```
    ...
    <Connector>
      {
        ({ state, actions }) => {
          ...
          return <MyComponent />
        }
      }
    </Connector>
    ...
  ```
3. (2.5) If your component needs props (`Connector` does not currently pass on props to child), wrap the component in a functional component that uses `Connector`
  ```
    // some unconnected component Foo
    .
    .
    .
    const ConnectedFoo = props => (
      <Connector>
        {
          ({ state, actions }) => (
            <Foo
              state={state}
              actions={actions}

              // can increase specificity
              // user={state.app.user}
              // logout={actions.app.logout}

              {...props}
            />
          )
        }
      </Connector>

      // export the connected component
      export default ConnectedFoo
    )
  ```
