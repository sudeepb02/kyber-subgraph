import React from "react";
import Highlight from "./Highlight";
import { KYBERS } from "../queries/kybers";
import { Query } from "react-apollo";
import "./Highlights.css";

function Highlights() {
  return (
    <div className="d-flex mt-5 flex-wrap">
      <Query query={KYBERS}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>...</div>;
          }

          const obj = data.kybers[0];
          const items = [
            {
              label: "total trades",
              value: obj["totalTrades"]
            },
            {
              label: "eth to token trades",
              value: obj["totalEthToToken"]
            },
            {
              label: "token to eth trades",
              value: obj["totalTokenToEth"]
            },
            {
              label: "token to token trades",
              value: obj["totalTokenToToken"]
            },
            {
              label: "reserves count",
              value: obj["reservesCount"]
            }
          ];

          return items.map((item, i) => {
            return <Highlight label={item.label} value={item.value} key={i} />;
          });
        }}
      </Query>
    </div>
  );
}

export default Highlights;
