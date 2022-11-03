import Card from "./Card";
import Modal from "./Modal";
import React from "react";

const ErrorModal = (props) => {
    console.log('in error modal : props.onClose: ', props.onClose )
    
    return (
        <Modal onClose={props.onClose}>
            <Card >
                {props.error && (
                <div>
                    <div>Error name: {props.error.name}</div>
                    <div>Error message: {props.error.message}</div>
                </div>)}
                { props.empty && <div>Data Error: No Data</div>}
            </Card>
        </Modal>
    )
}
export default ErrorModal