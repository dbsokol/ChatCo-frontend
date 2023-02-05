import './App.css';
import useWebSocket from 'react-use-websocket';
import useAxios from 'axios-hooks';
import React, { useEffect, useState, useRef } from 'react';
import { lightTheme, darkTheme } from './constants';
import { ThemeProvider } from "styled-components";
import styled from 'styled-components';
import moment from 'moment';
import { ChatHistory } from './components/chat-history';
import { NameSetter } from './components/name-setter';

const Content = styled.div.attrs({
  className: 'Content'
})`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.contentBackgroundColor};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-rows: 2fr 1fr 11fr 1fr;
  gap 2em;
  padding 2em;

  @media (max-width: 480px) {
    padding: 0.75em;
    gap 0.75em;
    font-size: smaller;
    grid-template-rows: 1fr 1fr 3fr 1fr;
  }
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
    // padding-top: 50px;
    // margin-top: -20px;
  }
`;

const StyledH2 = styled.h2.attrs({
  className: 'StyledH2',
})`
  vertical-align: middle;
  display: table-cell;
`;

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

const OptionsContainer = styled.div.attrs({
  className: 'OptionsContainer',
})`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 2em;
height: 100%;
max-height: 40px;
@media (max-width: 480px) {
  gap 0.75em;
  font-size: smaller;
}

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

const Timestamp = styled.span.attrs({
  className: 'Timestamp',
})`
  font-family: monospace, monospace;
  white-space: pre-wrap;
`

const Sender = styled.span.attrs({
  className: 'Sender',
})`
  color: ${({ theme }) => theme.nameText};
`;

const TextLine = styled.div.attrs({
  className: 'TextLine',
})`
  overflow-wrap: anywhere;
  padding: 2px;
  &:nth-child(2n) {
    background-color: ${({ theme }) => theme.altLine};
  }
`;

function App() { 
  const messagesEndRef = useRef();
  const [showChat, setShowChat] = useState(false);
  const [atBottomOfMessages, setAtBottomOfMessages] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [loadMessagesButtonEnabled, setLoadMessagesButtonEnabled] = useState(true);
  const [, setOffset] = useState(10);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [{ data: messagesResponse, loading: loadingMessagesResponse }, getMessages] = 
    useAxios({
      url: 'https://api.chatco.danielbsokol.engineer/api/messages/',
      method: 'GET',
    });
  
  const textInput = [
    ...messageHistory.sort((a,b) => (a.timestamp > b.timestamp ? 1 : -1)), 
    ...data,
  ].map((message, index) => {
    const timestamp = moment(message.timestamp).format('h:mm A').padStart(8);
    const sender = <Sender>{message.sender}</Sender>;
    
    return (
      <TextLine key={index}>
        <Timestamp>{timestamp}</Timestamp> -{' '}
        <Sender>{sender}</Sender>:{' '} 
        <span>{message.content}</span>
      </TextLine>
    )
  });

  useEffect(() => {
    setMessageHistory((messageHistory) => (
      [
        ...messageHistory, 
        ...(messagesResponse?.results || []),
      ]
    ));
    setLoadMessagesButtonEnabled(Boolean(messagesResponse?.next));
  }, [messagesResponse]);

  // useEffect(() => {
  //   console.table(messageHistory);
  // }, [messageHistory]);

  const { sendMessage } = useWebSocket(`wss://api.chatco.danielbsokol.engineer/ws/chat/`, {
    onMessage: (e) => {
      const message = JSON.parse(e.data);
      setData((data) => [...data, message]);
      setOffset((offset) => offset + 1);
    },
    shouldReconnect: (closeEvent) => true,
  });
  
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  const submitMessage = () => {
    sendMessage(JSON.stringify({
      'sender': sender,
      'message': message
    }));
    setMessage('');
  }

  const handleLoadMessagesOnClick = () => {
    setOffset((offset) => {
      getMessages(
        `https://api.chatco.danielbsokol.engineer/api/messages/?limit=10&offset=${offset}`,
      );
      return offset + 10;
    })
    setAtBottomOfMessages(false);
  }

  useEffect(() => {
    if (atBottomOfMessages) scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (atBottomOfMessages) scrollToBottom();
  }, [atBottomOfMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setAtBottomOfMessages(true);
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      {showChat ? (
        <Content>
          <TitleContainer>
            <StyledH2>
              ChatCo | danielbsokol.engineer
            </StyledH2>
          </TitleContainer>
          <div style={{display: 'table', height: '100%'}}>
            <div style={{verticalAlign: 'middle', display: 'table-cell', height: '100%'}}>
              <OptionsContainer>
                <StyledButton
                  onClick={() => setShowChat(false)}
                >
                  Change Name
                </StyledButton>
                <StyledButton
                  onClick={themeToggler}
                >
                  {theme === 'light' ? 'Dark' : 'Light'} Mode
                </StyledButton>
              </OptionsContainer>
            </div>
          </div>
          <ChatHistory 
            textInput={textInput}
            handleLoadMessagesOnClick={handleLoadMessagesOnClick}
            loadMessagesButtonEnabled={loadMessagesButtonEnabled}
            loadingMessagesResponse={loadingMessagesResponse}
            messagesEndRef={messagesEndRef}
            setAtBottomOfMessages={setAtBottomOfMessages}
          />
          <ChatInputContainer>
            <ChatInputMessageContainer>
              <StyledInput 
                placeholder='enter a message' 
                value={message} 
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => (event.key === 'Enter' ? submitMessage() : null)}
              />
            </ChatInputMessageContainer>
            <SubmitButtonContainer>
              <StyledButton 
                onClick={submitMessage}
                disabled={!message || !sender}
              >
                Submit
              </StyledButton>
            </SubmitButtonContainer>
          </ChatInputContainer>
        </Content>
      ) : (
        <NameSetter
          sender={sender}
          setSender={setSender}
          setShowChat={setShowChat}
        />
      )
    }
    </ThemeProvider>
  );
}

export default App;
