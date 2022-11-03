import { useDispatch } from "react-redux";
import React, { useState, useRef, Fragment } from "react";
import { usersActions } from "../store/users-slice";
import classes from "./AddUpdate.module.css";
import Modal from "./UI/Modal";

const _date = Date();

const AddUpdate = (props) => {
  console.log("in <AddUpdate.>");
  const both = props.addAndUpdate;
  let { firstName, lastName, organizationCode, userId, email } = props.formId;
  if (props.isAddUser) {
    firstName= "";
    lastName="";
    organizationCode="";
    email="";
  }
  
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const organizationCodeRef = useRef();
  const emailRef = useRef();
  const saveRef = useRef();
  const dateRef = useRef();
  // const [form, setForm] = useState({
  //   firstName: "",
  //   lastName: "",
  //   organizationCode: "",
  //   lastLoginDate: "",
  //   userId: "",
  //   email: "",
  //   status: "",
  //   accountInfo: [
  //     {
  //       bank: "",
  //       accountName: "",
  //       isDefaultAccount: "",
  //       accountType: "",
  //       branch: "",
  //       account: "",
  //     },
  //   ],
  // });
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const addHandler = () => {
   
    const newUser = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      organizationCode: organizationCodeRef.current.value,
      //editing the lastLoginDate for a new user or cuurent is nonsensicle from any way you decide to look at it
      lastLoginDate: dateRef.current.value,
      userId: "",
      email: emailRef.current.value,
      status: "",
      accountInfo: [
        {
          bank: "",
          accountName: "",
          isDefaultAccount: "",
          accountType: "",
          branch: "",
          account: "",
        },
      ],
    };

    dispatch(usersActions.addNewUser({newUser, userId}));
    setSubmitted(true);
  };
  const updateHandler = () => {
    const save = saveRef.current.value;
    if (save) {
      dispatch(usersActions.saveOldVal(props.index));
    }

    const update = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      organizationCode: organizationCodeRef.current.value,
      lastLoginDate: _date,
      userId: "",
      email: emailRef.current.value,
      status: "",
      accountInfo: [
        {
          bank: "",
          accountName: "",
          isDefaultAccount: "",
          accountType: "",
          branch: "",
          account: "",
        },
      ],
    };

    dispatch(usersActions.updateUser({ userId: userId, update, save }));
    setSubmitted(true);
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={addHandler}>
        {/* {submitted && (
          <div>{`First Name: ${form.firstName} Last Name: ${form.lastName}`}</div>
        )} */}
        <div className={classes["form-control"]}>
          <div>
            <label htmlFor="save">Save current user info?</label>
            <input ref={saveRef} id="save" type="checkbox" value="true" className={classes.savechkBox}></input>
          </div>
          <div>
            <label htmlFor="fname">First Name</label>
            <input
              ref={firstNameRef}
              id="fname"
              type="text"
              defaultValue={firstName}
            ></input>
          </div>
          <div>
            <label htmlFor="lname">Last Name</label>
            <input
              ref={lastNameRef}
              id="lname"
              type="text"
              defaultValue={lastName}
            ></input>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              ref={dateRef}
              id="date"
              type="date"
              defaultValue={_date}
            ></input>
          </div>

          <div>
            <label htmlFor="organizationCode">Organization Code</label>
            <input
              ref={organizationCodeRef}
              id="organizationCode"
              type="text"
              defaultValue={organizationCode}
            ></input>
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              defaultValue={email}
            ></input>
          </div>
          <div className={classes["form-actions"]}>
            {(props.isAddUser || both) && <button
              style={{ margin: "15px" }}
              className={classes.addUserbtn}
              type="button"
              onClick={() => {
                addHandler();
                props.onClose();
              }}
            >
              Add new User
            </button>}
            {(!props.isAddUser || both) && <button
              style={{ margin: "15px" }}
              className={classes.changeUserbtn}
              type="button"
              onClick={() => {
                updateHandler();
                props.onClose();
              }}
            >
              Submit changes for User: {userId}
            </button>}
            <button
              style={{ margin: "15px" }}
              className={classes.closebtn}
              onClick={() => {
                props.onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default AddUpdate;
