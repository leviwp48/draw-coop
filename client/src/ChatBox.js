import React from "react";
import { Box, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ChatInput from "./ChatInput";
import "./styles/styles.css";

const MyContainer = styled(Container)({
  backgroundColor: "green",
  height: "90%"
});

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  textCallback = data => {
    this.setState({ message: data });
    console.log("data passed to the parent: " + data);
  };

  render() {
    return (
      <Box component="div" className="chatBox">
        <MyContainer className="chatContainer" maxWidth="xs">
          <h2> Chat Feed </h2>
          <div className="chatMessages">
            <p> {this.state.message} </p>
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

export default ChatBox;
