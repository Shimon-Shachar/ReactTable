import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTable, useFilters, useSortBy } from "react-table";

const TableNested = (props) => {
  console.log("<NestedTable>");
  
  const [isLoadingNestedTable, setIsLodingNestedTable] = useState(false);

  const acc = useSelector((state) => state.users.users[props.index].accountInfo);
  console.log(acc);
  const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
    const count = preFilteredRows.length;
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  };

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const data = useMemo(() => acc, [acc]);
  const columns = useMemo(
    () => [
      {
        Header: "Bank",
        accessor: "bank",
      },
      {
        Header: "Account Name",
        accessor: "accountName",
      },
      {
        Header: "Default Account",
        accessor: "isDefaultAccount",
        Cell: (props)=> {
          const bool = props.row.original.isDefaultAccount.toString()
          console.log("is default cell",)
          return <span>{bool}</span>
        }
      },
      {
        Header: "Account Type",
        accessor: "accountType",
      },
      {
        Header: "Branch",
        accessor: "branch",
      },
      {
        Header: "Account Number",
        accessor: "account",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

  return (
    <React.Fragment>
      {isLoadingNestedTable && <h2 style={{ color: "red" }}>Loading...</h2>}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <React.Fragment key={headerGroup.headers.length + "_hfrag"}>
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <React.Fragment key={i + "_frag"}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
};
export default TableNested;
