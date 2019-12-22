import { gql } from "apollo-boost";

export const TOP_USERS_BY_TRADES = gql`
  query TopUsers {
    users(orderBy: totalTrades, orderDirection: desc, first: 10) {
      id
      totalTrades
      totalVolumeInEth
      totalGasUsed
      firstTx
      lastTx
    }
  }
`;

export const TOP_USERS_BY_VOLUME = gql`
  query TopUsers {
    users(orderBy: totalVolumeInEth, orderDirection: desc, first: 10) {
      id
      totalTrades
      totalVolumeInEth
      totalGasUsed
      firstTx
      lastTx
    }
  }
`;

export const TOP_USERS_BY_GAS = gql`
  query TopUsers {
    users(orderBy: totalGasUsed, orderDirection: desc, first: 10) {
      id
      totalTrades
      totalVolumeInEth
      totalGasUsed
      firstTx
      lastTx
    }
  }
`;
