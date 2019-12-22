import React, { useState } from "react";
import Highlight from "./Highlight";
import { USER_ANALYSIS } from "../queries/userAnalysis";
import { Query } from "react-apollo";
import Web3 from "web3";

const web3 = new Web3();

function UserAnalysis() {
  const [address, setAddress] = useState("");
  const [showAnalysis, toggleShowAnalysis] = useState(false);

  const useExample = () => {
    changeAddress("0x85c5c26dc2af5546341fc1988b9d178148b4838b");
  };

  const changeAddress = val => {
    setAddress(val);

    if (web3.utils.isAddress(val)) {
      toggleShowAnalysis(true);
    } else {
      toggleShowAnalysis(false);
    }
  };

  return (
    <div className="d-flex flex-column user-analysis mt-5 pb-4">
      <div className="d-flex my-2 analysis-header">
        <div className="address-analysis mr-2">address analysis</div>
        <input
          className="address-input"
          value={address}
          onChange={e => changeAddress(e.target.value)}
        />
        <div className="position-relative">
          <div className="position-absolute example-link" onClick={useExample}>
            use example address
          </div>
        </div>
      </div>
      <div className="d-flex mt-5 flex-wrap">
        {showAnalysis && (
          <Query
            query={USER_ANALYSIS}
            variables={{
              id: address
            }}
          >
            {({ loading, error, data }) => {
              if (loading) {
                return <div>...</div>;
              }

              const obj = data.user;
              const items = [
                {
                  label: "total trades",
                  value: obj["totalTrades"]
                },
                {
                  label: "total volume in eth",
                  value: Math.round(Number(obj["totalVolumeInEth"]) / 10 ** 18)
                },
                {
                  label: "total gas used",
                  value: obj["totalGasUsed"]
                }
              ];
              return items.map((item, i) => {
                return (
                  <Highlight label={item.label} value={item.value} key={i} />
                );
              });
            }}
          </Query>
        )}
      </div>
    </div>
  );
}

export default UserAnalysis;
