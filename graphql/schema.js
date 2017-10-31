export default `
  type Query {
    hello: String
    users(cql: String):[User]
  }

  type Mutation {
    updateUser (
      id: ID!
      personal: PersonalInput
    ): User
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

  # This is a bit silly isn't it?
  input PersonalInput {
    lastName: String
    firstName: String
    email: String
  }
`;
