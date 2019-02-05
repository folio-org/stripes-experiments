A simple webapp that lets you authenticate to Okapi and use [GraphiQL](https://github.com/graphql/graphiql) to explore its GraphQL endpoint (provided by [mod-graphql](https://github.com/folio-org/mod-graphql)).

Built with [create-react-app](https://github.com/facebook/create-react-app), this is a typical React/Webpack app that requires `nodejs` and `yarn` (or `npm`, probably).

Before running, you must install dependencies:
```
yarn install
```

You can run it on `http://localhost:3000` (or elsewhere if you set an [environment variable](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#advanced-configuration)) with:
```
yarn start
```

Or output optimized files to `./build` that you can host on another server:
```
yarn build
```

If you would like to change the default Okapi URL in the login form or the text that first populates GraphiQL's query box, that is currently conspicuously hardcoded in [src/App.js](src/App.js).