import React ,{useState, useRef} from "react";
import { usersActions } from "../../store/users-slice";
import { FcRefresh } from "react-icons/fc";
import classes from "./MainHeader.module.css";
import { useDispatch } from "react-redux";
import { getUsersSearch } from "../../services/adminHttp";

const MainHeader = (props) => {
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [laidng, setLoading] = useState(false);
  const dispatch = useDispatch();
  const searchRef = useRef()
  const clickHandler = () => {
    console.clear();
    props.refresh();
  };
  const fetchData = async (searchVal)=> {
    try {
    setLoading(true)
    const res = await getUsersSearch(searchVal)
    const data = await res.list;
    console.log("Search data : ", data)
    if (data.length === 0) {
      console.log("data.length", data.length)
      setEmpty(true)
    }
    dispatch(usersActions.setDbUsers(res.list));
    setLoading(false);
    } catch (err)
    {
      setError(err)
    }  
  }  
  const submitHandler = ()=> {
    const search = searchRef.current.value;
    fetchData(search);
  }
  return (
    <header className={classes.header}>
      
      <div>
        <span onClick={clickHandler} className={classes.refreshbutton}>
          <FcRefresh />
        </span>

        {props.loading && (
          <span
            style={{ display: "inline-block", width: "40px", color: "red" }}
          >
            Loading...
          </span>
        )}
        {props.empty && (
          <span
            style={{ color: "blue", height: "10px", margin: "0", padding: "0" }}
          >
            Loading data returned empty{" "}
          </span>
        )}
        <span style={{position: "absolute", left: "400px"}}>
          <label>Search user: </label>
          <input ref={searchRef}></input>
          <input type="submit" onClick={submitHandler}></input>
        </span>
      </div>
    </header>
  );
};

export default MainHeader;
