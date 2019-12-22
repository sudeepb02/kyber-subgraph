import React, { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";
import NumberFormat from "react-number-format";

function UserTable({ userData }) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const td = buildData();
    setTableData(td);
  }, [userData]);

  const buildData = () => {
    return userData.map(user => {
      let vol = <NumberFormat>{user.totalVolumeInEth / 10 ** 18}</NumberFormat>;
      vol = vol.props.children;
      vol = Math.round(vol);

      let gas = <NumberFormat>{user.totalGasUsed / 1000000}</NumberFormat>;
      gas = gas.props.children;
      gas = Math.round(gas);

      return {
        address: user.id,
        volume: vol + " ETH",
        gasUsage: gas + " mil",
        trades: (
          <NumberFormat value={user.totalTrades} thousandSeparator={true} />
        )
      };
    });
  };

  const columns = useMemo(() => [
    {
      Header: "Users",
      columns: [
        {
          Header: "address",
          accessor: "address"
        },
        {
          Header: "volume",
          accessor: "volume"
        },
        {
          Header: "gas usage",
          accessor: "gasUsage"
        },
        {
          Header: "trades",
          accessor: "trades"
        }
      ]
    }
  ]);
  const TheadComponent = props => null;

  return (
    <div className="d-flex mt-3">
      <Table
        columns={columns}
        data={tableData}
      />
    </div>
  );
}

function Table({ columns, data, setDaoFocusAddress }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()} className="mx-auto">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);

          const addr = row.cells[0].render("Cell").props.data[0].address;

          return (
            <tr
              {...row.getRowProps()}
              className="table-row-content"
              onClick={() => setDaoFocusAddress(addr)}
            >
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserTable;
