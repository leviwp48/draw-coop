import React from "react";
import { Box, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ChatInput from "./ChatInput";
import "../styles/styles.css";

const MyContainer = styled(Container)({
  height: "90%",
  backgroundColor: "green"
});

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: "",
      messages: [{
        text: "hello" 
      },
      {
        text: "bye"
      }      
     ],
     odd: false
     };
  }

  textCallback = data => {
    this.setState({ message: data });
    console.log("data passed to the parent: " + data);
  };

  insertText = () => {
    
  }

  render() {
    return (
      <Box component="div" className="chatBox">
        <MyContainer className="chatContainer" >
          <h2> Chat Feed </h2>
          <div className="chatMessages">
            {this.state.messages.map(message => {
                            this.setState({odd: false})     

              if(!this.state.odd){
                return (
                  <p className="chat-message-even" key={message.id}>                
                    <div>
                      {message.text}
                    </div>
                  </p>
                )
              }
              else{
                return (
                  <p className="chat-message-odd" key={message.id}>                
                    <div>
                      {message.text}
                    </div>
                  </p>
                  )
              }       
            })}            
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

export default ChatBox;
