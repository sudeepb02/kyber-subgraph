import { gql } from "apollo-boost";

export const KYBERS = gql`
  query Kybers {
    kybers(first: 1) {
      id
      totalTrades
      totalEthToToken
      totalTokenToEth
      totalTokenToToken
      reservesCount
    }
  }
`;
