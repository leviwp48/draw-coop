import React from "react";
import { Box, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ChatInput from "./ChatInput";
import "../styles/styles.css";

const MyContainer = styled(Container)({
  height: "90%",
  backgroundColor: "green"
});

/*
-- was a function to update state in the mapping 
function addText(state, props) {
  if (state == false) {
    return null;
  }

  return {
    odd: !state.odd,
  }
}
*/

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: "",
      messages: [],
      tracker: 0
     };
  }
  render() {
    return (
      <ul className="message-list">                 
        {this.props.messages.map(message => {
          return (
            <li key={message.id}>
              <div>
                {message.senderId}
              </div>
              <div>
                {message.text}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  

  /*
  defineText = (data) => {
    console.log("deffining...")
    console.log(data)

    let tracker = this.state.tracker;
    let name = "";
    if(tracker % 2 === 0){
      console.log(data)
      name = "chat-message-even";
    }
    else{
      name = "chat-message-odd";
    }
    const newText = 
      <p className={name}>                
        <div>
          {data}
        </div>
      </p>
    
    insertText

  }

  insertText = (tracker, html) => {
    console.log("inserting...")

  }
  textCallback = (data) => {
    //this.setState(previousState => ({ messages: [...previousState.messages, data]}));
    this.setState({ messages: [...this.state.messages, data]});

  };

  insertOldText = (state) => {
    let tracker = state.tracker;
    let name = "";
    return this.state.messages.map(message => {
      if(tracker % 2 === 0){
        console.log(message)
        name = "chat-message-even";
        return (
          <p className={name} key={message.id}>                
            <div>
              {message.text}
            </div>
          </p>
        )
      }
      else{
        name = "chat-message-odd";
        return (
          <p className={name} key={message.id}>                
            <div>
              {message.text}
            </div>
          </p>
          )
      }
      tracker++;  
    }) 
  }
 
  // okay somewhere in here setState is being called way too much. It was n the mapping function. Too many asysc calls with setState
  render() {
    return (
      <Box component="div" className="chatBox">
        <MyContainer className="chatContainer" >
          <h2> Chat Feed </h2>
          <div className="chatMessages">
            {this.insertText(this.state.messages)}
          </div>
        </MyContainer>
        <ChatInput
          className="chatInput"
          callbackFromParent={this.textCallback}
        />
      </Box>
    );
  }
}
*/

/*
<div className="chatBox">
        <div className="chatContainer">
          <div className="chatTitle">
            <h2> Chat Feed </h2>
          </div>         
          <div className="chatMessages">
            <p> {this.state.message} </p>
          </div>
        </div>
        <ChatInput
          className="chatInput"
          callbackFromParent={this.textCallback}
        />
      </div>
*/
}
export default ChatList;
