import React from 'react';
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import Headline from "./components/Headline";
import Highlights from "./components/Highlights";
import TopUsers from "./components/TopUsers";
import UserAnalysis from "./components/UserAnalysis";
import './App.css';

const cache = new InMemoryCache();

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/id/QmXpwPGunhabtrpteHU7dBSguuwTRiB131GAeqx97FxWyf",
  // uri: "https://api.thegraph.com/subgraphs/name/sudeepb02/kyber-subgraph",
  cache
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Headline />
        <Highlights />
        <UserAnalysis />
        <TopUsers />
      </div>
    </ApolloProvider>
  );
}

export default App;
