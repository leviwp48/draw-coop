import React from "react";
import "./LoginModal.css";

const Modal = ({ handleClose, modalType, submitRegister, submitLogin, changeModalType, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = modalType ? "Login" : "Register";
  const chooseSubmit = modalType ? submitLogin : submitRegister;
  const makeOption = modalType ? "Register" : "Login";
  const makeText = modalType ? "Don't have an account?" : "Already have an account?";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-title"> 
          <h1> {makeTitle} </h1>
          <span className="close" onClick={handleClose}> &times; </span>
        </div>
        {children}
        <div className="button-submit">
          <button className="modal-submit" id="user" onClick={chooseSubmit}>Submit</button>
        </div>
        <div className="option-box">
          <p> {makeText}
            <button
            className="option-btn"
            type="button"
            onClick={() => changeModalType()}>{makeOption}</button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Modal;
