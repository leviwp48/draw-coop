import React from "react";
import "./LoginModal.css";

const Modal = ({ handleClose, type, submit, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = type ? "Register" : "Login";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1> {makeTitle} </h1>
        <button className="modal-close" onClick={handleClose} />
        {children}
        <button className="modal-submit">submit</button>
      </section>
    </div>
  );
};

export default Modal;
