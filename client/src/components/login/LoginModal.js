import React from "react";
import "./LoginModal.css";

const Modal = ({ handleClose, modalType, submitRegister, submitLogin, onEnter, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = modalType ? "Login" : "Register";
  const chooseSubmit = modalType ? submitLogin : submitRegister;

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1> {makeTitle} </h1>
        <button className="modal-close" onClick={handleClose} />
        {children}
        <button className="modal-submit" onKeyPress={onEnter} onClick={chooseSubmit}>submit</button>
      </section>
    </div>
  );
};

export default Modal;
