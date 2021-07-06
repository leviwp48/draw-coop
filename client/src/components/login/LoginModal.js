import React from "react";
import "./LoginModal.css";

const Modal = ({ handleClose, modalType, submitRegister, submitLogin, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = modalType ? "Login" : "Register";
  const chooseSubmit = modalType ? submitLogin : submitRegister;

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-title"> 
          <h1> {makeTitle} </h1>
          <span className="close" onClick={handleClose}> &times; </span>
        </div>
        {children}
        <button className="modal-submit"  onClick={chooseSubmit}>submit</button>
      </section>
    </div>
  );
};

export default Modal;
