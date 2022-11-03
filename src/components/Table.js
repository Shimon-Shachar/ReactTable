import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import classes from "./Table.module.css";
import TableNested from "./TableNested";
import AddUpdate from "./AddUpdate";
import ErrorModal from "./UI/ErrorModal";


const Table = ({ open,openRowId,columns, getPage ,toggleForm, openForm, formId,error,empty,  onClose, isAddUser, addAndUpdate}) => {
  
  const currentDBPage = useSelector((state) => state.users.currentPage);
  const data1 = useSelector((state) => state.users.users);
  const data = useMemo(()=> data1, [data1]);
  useEffect(()=> {
    setRecords(data)
  }, [data])
  
  
  const [records, setRecords] = useState(data);
  
  
  //const [dataLength ,setDataLength] = useState(0);
  console.log({ records });
  
  
  const getRowId = useCallback((row) => {
    return row.userId;
  }, []);

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
  const defaultColumn = { Filter: DefaultColumnFilter };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { loading, pageIndex, pageSize=5, expanded },
  } = useTable(
    {
      data: records,
      columns,
      defaultColumn,
      initialState: { pageIndex: 0 },
      getRowId,
    },
    useFilters,
    useSortBy,
    usePagination
  );
  console.log({ rows });
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
     {(error || empty) && <ErrorModal error={error} onClose={onClose} empty={empty}/>}
      {openForm && <AddUpdate formId={formId} onClose={toggleForm} isAddUser={isAddUser} addAndUpdate={addAndUpdate} />}
      <table {...getTableProps()} className={classes.table}>
        <thead className={classes.header}>
          {headerGroups.map((headerGroup) => (
            <Fragment key={headerGroup.headers.length + "_hfrag"}>
              <tr {...headerGroup.getHeaderGroupProps()} className={classes.tr}>
                <th></th>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                    <span style={{display: "inline"}}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            </Fragment>
          ))}
          <tr colSpan={11} className={classes.rowcount}>
            rows: {rows.length}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, index) =>
              prepareRow(row) || (
                <Row
                  index={index}
                  row={row}
                  moveRow={moveRow}
                  {...row.getRowProps()}
                  open={open}
                  openRowId={openRowId}
                />
              )
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() =>{ if (!canNextPage){getPage(currentDBPage+1)} else { nextPage()}}} >
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          | Showing page{" "}
          <strong>
            {pageIndex+1} of {pageOptions.length} 
          </strong>{" | "}
        </span>
        <select
          
          defaultValue={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20].map((_rows) => (
            <option key={_rows} value={_rows}>
              Show {_rows} rows
            </option>
          ))}
        </select>
        <span>
         Current page in DB: {currentDBPage} | Load DB page: {""}
          <input
            min={1}
            type="number"
            defaultValue={currentDBPage+1}
            onChange={(e) => {
              const getpageNum = e.target.value ? Number(e.target.value) - 1 : 0;
              if (getpageNum < 1) { return}
              getPage(getpageNum);
              gotoPage(getpageNum);
            }}
            style={{ width: "40px" }}
          />
        </span>
      </div>
    </DndProvider>
  );
};
export default Table;

const DND_ITEM_TYPE = "row";

const Row = ({ row, index, moveRow, open, openRowId }) => {
  const [clickedRow, setClickedRow] = useState([]);
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      console.log({ dragIndex });
      const hoverIndex = index;
      console.log({ hoverIndex });
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);
  
  const userId = row.original.userId;
            
  let _bool;
  clickedRow.forEach(row => {
    if (row === userId){_bool = true}
  })
  
  const clickedClass = _bool ? "clicked" : "";
  return (
    <React.Fragment key={index + "_frag"}>
      <tr 
        className={classes[clickedClass]} 
        ref={dropRef} 
        style={{ opacity }}
        onClick={() => {
          if (!clickedRow.includes(userId)) {
            setClickedRow(prev => [...prev, userId]);
          } else {
            setClickedRow(prev => prev.filter(_userId => _userId !== userId ));
          }  
        }}
      >
        <td ref={dragRef} className={classes.move}>move</td>
        {row.cells.map((cell) => {
          return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
        })}
      </tr>
      {open && openRowId === row.id && (
        
        <tr colSpan={7}>
          <td colSpan={7}>
            <TableNested index={index} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
