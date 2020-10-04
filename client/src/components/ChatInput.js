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

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  };

  handleKeyPress = e => {
    // put send input in here maybes
    // there will eventually be a request call that happens here
    if (e.key === "Enter") {
      this.props.sendMessage(this.state.message)
      this.setState({message: ""})
    }
  };

  render() {
    return (
      <Box component="div" className="chatInput">
        <MyInput
          type="text"
          fullWidth={true}
          value={this.state.message}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </Box>
    );
  }
}

export default ChatInput;

