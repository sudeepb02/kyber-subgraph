import React, { useState } from "react";
import UserTable from "./UserTable"
import {
  TOP_USERS_BY_GAS,
  TOP_USERS_BY_TRADES,
  TOP_USERS_BY_VOLUME
} from "../queries/topUsers";
import { Query } from "react-apollo";
import "./TopUsers.css";

function TopUsers() {
  const TYPES = ["volume", "trades", "gas"];
  const QUERIES = [TOP_USERS_BY_VOLUME, TOP_USERS_BY_TRADES, TOP_USERS_BY_GAS];

  const [activeType, setActiveType] = useState(0);

  return (
    <div className="d-flex flex-column mt-5">
      <div className="d-flex top-users-headline">
        <div>top users by</div>
        <div className="d-flex user-types ml-2">
          {TYPES.map((type, i) => {
            const select = () => setActiveType(i);
            return (
              <div
                className={`user-type ${
                  TYPES[activeType] === type ? "active-type" : "inactive-type"
                }`}
                onClick={select}
                key={i}
              >
                {type}
              </div>
            );
          })}
        </div>
      </div>
      <div className="top-users-viz d-flex">
        <Query query={QUERIES[activeType]}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>...</div>;
            }

            console.log("data", data);
            return <UserTable userData={data.users} />
          }}
        </Query>
      </div>
    </div>
  );
}

export default TopUsers;
