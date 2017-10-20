export default `
  type Query {
    hello: String
    users(cql: String):[User]
  }

  type User {
    id: ID!
    username: String!
    barcode: String
    patronGroup: String
    active: Boolean
    personal: Personal!
  }

  type Personal {
    lastName: String!
    firstName: String
    email: String
  }
`;
