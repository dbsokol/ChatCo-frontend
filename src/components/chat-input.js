import styled from 'styled-components';


const ChatInputContainer = styled.div.attrs({
  className: 'ChatInputContainer'
})`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2em;

  max-height: 40px;
  @media (max-width: 480px) {
    gap 0.75em;
    font-size: smaller;
  }
`;

const ChatInputMessageContainer = styled.div.attrs({
  className: 'ChatInputMessage'
})`
`;

const SubmitButtonContainer = styled.div.attrs({
  className: 'ChatSubmitButtonContainer'
})`
`;

const StyledInput = styled.input.attrs({
  className: 'StyledInput'
})`
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  padding: 0 10px;
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text}; 
  box-shadow: ${({ theme }) => theme.boxShadow};
  &:focus {
    border: none;
    outline: none;
  }
`;

const StyledButton = styled.button.attrs({
  className: `StyledButton`,
})(
  ({ disabled, theme }) => `
    text-transform: uppercase;
    font-weight: 900;
    background-color: ${disabled ? theme.buttonDisabledBackground : theme.buttonBackground};
    color: ${disabled ? theme.buttonDisabledText : theme.buttonText};
    box-shadow: ${disabled ? 'none' : theme.boxShadow};
    width: -webkit-fill-available;
    height: 100%;
    cursor: ${disabled ? 'default' : 'pointer'};
    border: none;
    border-radius: 5px;
    &:hover {
      opacity: ${disabled ? 1 : 0.8};
    }
  `
);


export const ChatInput = ({ 
  message, 
  setMessage, 
  submitMessage, 
  sendMessage, 
  sender,
}) => {
  const handleOnChange = (event) => {
    setMessage(event.target.value);
    sendMessage(JSON.stringify({
      'type': 'typing_status',
      'isTyping': Boolean(message),
      'sender': sender,
    }));
  }
  return (
    <ChatInputContainer>
      <ChatInputMessageContainer>
        <StyledInput 
          placeholder='enter a message' 
          value={message} 
          onChange={(event) => handleOnChange(event)}
          onKeyDown={(event) => (event.key === 'Enter' ? submitMessage() : null)}
        />
      </ChatInputMessageContainer>
      <SubmitButtonContainer>
        <StyledButton 
          onClick={submitMessage}
          disabled={!message}
        >
          Send
        </StyledButton>
      </SubmitButtonContainer>
    </ChatInputContainer>
  );
}