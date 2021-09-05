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
        <div className="button-submit">
          <button className="modal-submit"  onClick={chooseSubmit}>submit</button>
        </div>
        <div className="register-text">
          <p> Don't have an account? 
            <button
            className="register-btn"
            type="button"
            onClick={() => this.showModalLogin()}>Register</button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Modal;
