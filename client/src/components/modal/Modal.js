import React from "react";
import "./Modal.css";

const Modal = ({ 
  handleClose, 
  modalType, 
  submitRegister,
  submitLogin,
  changeModalType,
  show,
  children 
  }) => {

  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const makeTitle = modalType ? "Login" : "Register";
  const chooseSubmit = modalType ? submitLogin : submitRegister;
  const makeOption = modalType ? "Register" : "Login";
  const makeText = modalType ? "Don't have an account?" : "Already have an account?";

  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section className="modal-main" >
        <div className="modal-container">
          <div className="modal-title-container">         
            <div className="modal-title"> 
              <h1 className="title-text"> {makeTitle} </h1>
            </div>
          </div>
          {children}
          <button className="modal-submit" id="user" onClick={chooseSubmit}>Submit</button>
          <div className="option-container">
            <p className="modal-text"> {makeText}
              <button
              className="option-btn"
              type="button"
              onClick={() => changeModalType()}>{makeOption}</button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Modal;

