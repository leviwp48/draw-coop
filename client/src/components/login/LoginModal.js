import React from "react";
import "./LoginModal.css";

const Modal = ({ handleClose, type, submit, onEnter, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = type ? "Login" : "Register";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1> {makeTitle} </h1>
        <button className="modal-close" onClick={handleClose} />
        {children}
        <button className="modal-submit" onKeyPress={onEnter} onClick={submit}>submit</button>
      </section>
    </div>
  );
};

export default Modal;
