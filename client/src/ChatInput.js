import React from "react";
import Input from "@material-ui/core/Input";
import { Box, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

const MyInput = styled(Input)({
  height: "100%",
  paddingLeft: "5px",
  paddingRight: "5px",
  backgroundColor: "#000000",
  color: "#FFFFFF"
});

const SendInput = () => {};

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textValue: "" };
  }

  handleChange = e => {
    this.setState({ textValue: e.target.value });
  };

  handleKeyPress = e => {
    // put send input in here maybes
    // there will eventually be a request call that happens here
    if (e.key === "Enter") {
      console.log("Your input: " + this.state.textValue);
      this.props.callbackFromParent(e.target.value);
      this.setState({ textValue: "" });
      e.preventDefault();
    }
  };

  render() {
    return (
      <Box component="div" className="chatInput">
        <MyInput
          type="text"
          fullWidth={true}
          value={this.state.textValue}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </Box>
    );
  }
}

export default ChatInput;

/*
<Box component="div" className="textInput">
      <MyContainer maxWidth="xs">
          <ChatInput callbackFromParent={this.textCallback} />
      </MyContainer>
      </Box>
      */
