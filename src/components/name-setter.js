import styled from 'styled-components';

const Content = styled.div.attrs({
  className: 'Content'
})`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.contentBackgroundColor};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-rows: 2fr 2fr 2fr 1fr;

  gap 12em;
  padding 2em;

  @media (max-width: 480px) {
    padding: 0.75em;
    gap 3em;
    font-size: smaller;
  }
`;


const ChatInputSenderContainer = styled.div.attrs({
  className: 'ChatInputSenderContainer'
})`
  text-align: center;
`;

const StyledInput = styled.input.attrs({
  className: 'StyledInput'
})`
  /* width: -webkit-fill-available; */
  /* height: -webkit-fill-available; */
  padding: 0 10px;
  width: 50vw;
  padding: 0 10px;
  height: 10vh;
  max-height: 35px;
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text}; 
  box-shadow: ${({ theme }) => theme.boxShadow};
  &:focus {
    border: none;
    outline: none;
  }
  text-align: center;
`;

const TitleContainer = styled.div.attrs({
  className: 'TitleContainer'
})`
  width: 100%;
  display: table;
  text-align: center;
  background-color: ${({ theme }) => theme.titleBackground};
  color: ${({ theme }) => theme.titleTextColor};

  padding: 15px;
  border-radius: 5px;
  // margin-bottom: 15px;

  @media (max-width: 480px) {
    // padding-top: 20px;
    // margin-top: -20px;
  }
`;

const StyledH2 = styled.h2.attrs({
  className: 'StyledH2',
})`
  vertical-align: middle;
  display: table-cell;
`;

const StartButtonContainer = styled.div.attrs({
  className: 'StartButtonContainer',
})`
  margin-top: 50px;
  text-align: center;
`;

const StartChatButton = styled.button.attrs({
  className: 'StartChatButton',
})(
  ({ disabled, theme }) => `
    padding: 20px;
    cursor: ${disabled ? 'default' : 'pointer'};
    text-transform: uppercase;
    font-weight: 900;
    background-color: ${disabled ? theme.buttonDisabledBackground : theme.buttonBackground};
    color: ${disabled ? theme.buttonDisabledText : theme.buttonText};
    box-shadow: ${disabled ? 'none' : theme.boxShadow};
    // width: -webkit-fill-available;
    height: 100%;
    cursor: ${disabled ? 'default' : 'pointer'};
    border: none;
    border-radius: 5px;
    &:hover {
      opacity: ${disabled ? 1 : 0.8};
    }
  `,
);

export const NameSetter = ({ sender, setSender, setShowChat }) => {

  return (
    <Content>
      <TitleContainer>
        <StyledH2>
          ChatCo | danielbsokol.engineer
        </StyledH2>
      </TitleContainer>
      <ChatInputSenderContainer>
        <StyledInput 
          placeholder='set your name to start chatting' 
          value={sender} 
          onChange={(event) => setSender(event.target.value)}
          onKeyDown={(event) => (event.key === 'Enter' ? setShowChat(Boolean(sender)) : null)}
        />
        <StartButtonContainer>
          <StartChatButton
            disabled={sender ? false : true}
            onClick={() => setShowChat(true)}
          >
            Start Chatting
          </StartChatButton>
        </StartButtonContainer>
      </ChatInputSenderContainer>
    </Content>
  );
}