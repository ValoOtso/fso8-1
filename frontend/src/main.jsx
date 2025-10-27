import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  split,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("book-user-token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionAckWaitTimeout: 5000,
    retryAttempts: Infinity,
    retryWait: async (attempt) =>
      new Promise((res) => setTimeout(res, 1000 * attempt)),
    on: {
      connected: () => console.log("✅ WS connected"),
      closed: () => console.log("❌ WS closed"),
      error: (err) => console.error("WS error", err),
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
