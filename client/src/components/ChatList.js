import React from "react";
import { Box, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ChatInput from "./ChatInput";
import "../styles/styles.css";

const MyContainer = styled(Container)({
  height: "90%",
  backgroundColor: "green"
});

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [],
      tracker: true
     };
  }

  isEven = () => {
    if(this.state.tracker === true){
      return ".chat-message-even";
    }
    else{
      return "";
    }
  }
  
  render() {
    return (
      <Box component="div" className="chatBox">
      <MyContainer className="chatContainer" >
        <ul className="message-list">                 
          {this.props.messages.map(message => {
            return (
              <div>
                {message}
              </div>
            )
          })}
        </ul>
      </MyContainer>
      </Box>  
    )
  }
}

export default ChatList;