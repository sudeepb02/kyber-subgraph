import { gql } from "apollo-boost";

export const USER_ANALYSIS = gql`
  query UserAnalysis($id: String!) {
    user(id: $id) {
      id
      totalTrades
      totalVolumeInEth
      firstTx
      lastTx
      totalGasUsed
    }
  }
`;
