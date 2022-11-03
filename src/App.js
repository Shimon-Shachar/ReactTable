import Table from "./components/Table";
import Layout from "./components/Layout/Layout";
import AddUpdate from "./components/AddUpdate";
import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAccounInfo, getUsers } from "./services/adminHttp";
import { usersActions } from "./store/users-slice";
import ErrorModal from "./components/UI/ErrorModal";
import { FcExpand, FcDeleteRow } from "react-icons/fc";
import classes from "./components/Table.module.css";

const App = () => {
  console.log("APP");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [addAndUpdate, setAddandUpdate] = useState(false);
  const [openRowId, setOpenRowId] = useState("");
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formId, setFormId] = useState({
    firstName: "",
    lastName: "",
    organizationCode: "",
    email: "",
  });
  const dispatch = useDispatch();
  
  const fetchData = async ()=> {
    try {
    const res = await getUsers()
    const data = await res.list;
    if (data.length === 0) {
      console.log("data.length", data.length)
      setEmpty(true)
    }
    dispatch(usersActions.setDbUsers(res.list));
    const res2 = await getUserAccounInfo();
    
    dispatch(usersActions.dbAccountInfo(res2.list))
    console.log(res2)
    } catch (err)
    {
      setError(err)
    }  
  }  
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=> {
      fetchData();
    setLoading(false)
    }, 500)
    
  },[])

  
  useEffect(() => {
    const interval = setInterval(() => {
      
      setRefresh((prev) => !prev);
    }, 1000 * 30000);
    return () => {
      clearInterval(interval);
      setLoading(false)
      setEmpty(false)
    };
  }, [refresh]);
 
  const columns = useMemo(
    () => [
      {
        Header: "Expand",
        Cell: (pros) => {
          return (
            <span
              type="button"
              onClick={() => {
                toggleRowOpen(pros.row.index, pros.row.id)
                console.log("Expand clickFunc : row.id",pros.row);
              }}
            >
              <FcExpand />
            </span>
          );
        },
      },
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Last Login",
            accessor: "lastLoginDate",
          },
          {
            Header: "Organization Code",
            accessor: "organizationCode",
          },
          {
            Header: "User Id",
            accessor: "userId",
            Cell: (props) => {
              if (props.value > 100) {
                return <div className={classes.special}> {props.value}</div>;
              } else {
                return <div>{props.value}</div>;
              }
            },
          },

          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "E-mail",
            accessor: "email",
          },
        ],
      },
      {
        Header: "Buttons",
        columns: [
          {
            Header: "Add/Update",
            Cell: (props) => {
              return (
                <div className={classes.columnbutton}>
                  <span
                    className={classes.rowupdatebutton}
                    onClick={() => {
                      console.log("ADD UPDATEFORM CLICK");
                      toggleForm({ ...props.row.original },"both");
                    }}
                  >
                  <FcExpand />  
                  </span>
                </div>
              );
            },
          },
          {
            Header: "Delete",
            id: "delete",
            Cell: (pros) => (
              <div className={classes.columnbutton}>
                <span 
                className={classes.rowdeletebutton}
                  onClick={() => {
                    console.log("DELETE");
                    console.log("pros", pros)
                    dispatch(usersActions.deleteUser(pros.row.index));
                  }}
                >
                <FcDeleteRow />
                </span>
              </div>
            ),
          },
          {
            Header: "Menu",
            Cell: (props) => {
              return (
                <Fragment>
                  <div class={classes.dropdown}>
                    <span>
                      <FcExpand />
                    </span>
                    <div className={classes.dropdowncontent}>
                      <p
                        className={classes.dropdownp}
                        onClick={() => {
                          console.log("UPDATE INFO CLICKED");
                          toggleForm({ ...props.row.original }, true);
                        }}
                      >
                        Add User
                      </p>
                      <p
                        className={classes.dropdownp}
                        onClick={() => {
                          console.log("UPDATE INFO CLICKED");
                          toggleForm({ ...props.row.original });
                        }}
                      >
                        Update Info
                      </p>
                      <p
                        className={classes.dropdownpdelete}
                        onClick={() => {
                          console.log("DELETE USER CLICKED");
                          dispatch(usersActions.deleteUser(props.row.index));
                        }}
                      >
                        Delete User
                      </p>
                    </div>
                  </div>
                </Fragment>
              );
            },
          },
        ],
      },
    ],
    []
  );

  const toggleRowOpen = (index, id) => {
    setOpenRowId( id);
    setOpen((prev) => !prev);
    console.log("ONCLICK open state", open);
    dispatch(usersActions.setUserAccountInfo(index));
  };
  const getPage = (pageNum) => {
    console.log("GET PAGE", pageNum);
    const res = getUsers(pageNum)
      .then((res) => {
        if (res.list.length === 0) {
          setEmpty(true)
        }
        dispatch(usersActions.setDbUsers(res.list));
      })
      .catch((err) => {
        setError(err);
        console.log(
          "AJAX ERROR: ",
          err.message,
          err.name,
          err.customErrorMessage
        );
      });
  };
  const toggleForm = (formUser, _bool) => {
    if (_bool === "both"){
    setAddandUpdate(true)}
    setIsAddUser(_bool);
    setOpenForm((prev) => !prev);
    setFormId((prev) => prev = {...formUser});  
  };
  const errorModalcloseHandler = () => {
    setError(false);
    setEmpty(false);
  };
  const refreshFunc = () => {
    setLoading(true)
    console.log("In refreshFunc")
    setRefresh((prev) => !prev);
  };
  const propsToTable = {
    open,
    openRowId,
    openForm,
    formId,
    columns,
    onClose: errorModalcloseHandler,
    error,
    empty,
    getPage,
    toggleForm,
    isAddUser,
    addAndUpdate
  };
  return (
    <Fragment>
      <Layout refresh={refreshFunc} loading={loading} empty={empty}></Layout>
      <Table {...propsToTable} />;
    </Fragment>
  );
};
export default App;


// useEffect(() => {
//   const res = getUsers()
//     .then((res) => {
//       dispatch(usersActions.setDbUsers(res.list));
//       setLoading(false);
//     })
//     .catch((err) => {
//       setError(prev=> prev ={...err});
//       console.log(
//         "AJAX ERROR: ",
//         err.message,
//         err.name,
//         err.customErrorMessage
//       );
//     });
//   const res2 = getUserAccounInfo().then((res) =>
//     dispatch(usersActions.dbAccountInfo(res.list))
//     );
// }, [data, refresh]);

// useEffect(() => {
//   setLoading(true);
// }, []);

// useEffect(() => {
//   const interval = setInterval(() => {
//     setRefresh((prev) => !prev);
//   }, 1000 * 30);
//   return () => {
//     clearInterval(interval);
//   };
// }, [refresh]);