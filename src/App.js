import './App.css';
import useWebSocket from 'react-use-websocket';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { lightTheme, darkTheme } from './constants';
import {ThemeProvider} from "styled-components";
import styled from 'styled-components';
import moment from 'moment';

const Content = styled.div.attrs({
  className: 'Content'
})`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.contentBackgroundColor};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-rows: 2fr 1fr 17fr 1fr;
  gap 2em;
  padding 2em;
`;

const TitleContainer = styled.div.attrs({
  className: 'TitleContainer'
})`
  display: table;
  text-align: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.titleTextColor};
`;

const StyledH2 = styled.h2.attrs({
  className: 'StyledH@',
})`
  vertical-align: middle;
  display: table-cell;
`;

const ChatHistoryContainer = styled.div.attrs({
  className: 'ChatHistoryContainer'
})`
  background-color: red;
`;

const ChatInputContainer = styled.div.attrs({
  className: 'ChatInputContainer'
})`
  display: grid;
  grid-template-columns: 1fr 7fr 1fr;
  gap: 2em;
`;

const ChatHistoryTextarea = styled.div.attrs({
  className: 'ChatHistoryTextarea'
})`
  width: 100%;
  height: 100%;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const ChatInputSenderContainer = styled.div.attrs({
  className: 'ChatInputSenderContainer'
})`
  background-color: red;
`;

const ChatInputMessageContainer = styled.div.attrs({
  className: 'ChatInputMessage'
})`
  background-color: blue;
`;

const SubmitButtonContainer = styled.div.attrs({
  className: 'ChatSubmitButtonContainer'
})`
  // background-color: blue;
`;

const StyledInput = styled.input.attrs({
  className: 'StyledInput'
})`
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  padding: 0 10px;
`;

const StyledButton = styled.button.attrs({
  className: `StyledButton`,
})(
  ({ disabled }) => `
    width: -webkit-fill-available;
    height: 100%;
    cursor: ${disabled ? 'default' : 'pointer'};
  `
);

const LoadMessagesButtonContainer = styled.div.attrs({
  className: 'LoadMessagesButtonContainer',
})`
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 1fr 6fr;
  gap: 2em;
`;

const Timestamp = styled.span.attrs({
  className: 'Timestamp',
})`
  font-family: monospace, monospace;
  white-space: pre-wrap;
`

const Sender = styled.span.attrs({
  className: 'Sender',
})`
  color: ${({ theme }) => theme.nameText};;
`;

const ChatHistory = ({ textInput, getMessages }) => {

  return (
    <ChatHistoryContainer>
      <ChatHistoryTextarea >
        {textInput}
      </ChatHistoryTextarea>
    </ChatHistoryContainer>
  )
}


function App() { 
  const [theme, setTheme] = useState('dark');
  const [loadMessagesButtonEnabled, setLoadMessagesButtonEnabled] = useState(true);
  const [, setOffset] = useState(10);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [{ data: messagesResponse, loading: loadingMessagesResponse }, getMessages] = 
    useAxios({
      url: 'http://api.chatco.danielbsokol.engineer/api/messages/',
      method: 'GET',
    });
  
  const textInput = [
    ...messageHistory.sort((a,b) => (a.timestamp > b.timestamp ? 1 : -1)), 
    ...data,
  ].map((message, index) => {
    const timestamp = moment(message.timestamp).format('h:mm A').padStart(8);
    const sender = <Sender>{message.sender}</Sender>;
    return (
      <div key={index}>
        <Timestamp>{timestamp}</Timestamp> -{' '}
        <Sender>{sender}</Sender>:{' '} 
        <span>{message.content}</span>
      </div>
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

  useEffect(() => {
    console.table(messageHistory);
  }, [messageHistory]);

  const { sendMessage } = useWebSocket(`ws://api.chatco.danielbsokol.engineer/ws/chat/`, {
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
        `http://api.chatco.danielbsokol.engineer/api/messages/?limit=10&offset=${offset}`,
      );
      return offset + 10;
    })
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Content>
        <TitleContainer>
          <StyledH2>
            ChatCo | danielbsokol.engineer
          </StyledH2>
        </TitleContainer>
        <LoadMessagesButtonContainer>
          <StyledButton
            onClick={themeToggler}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </StyledButton>
          <StyledButton 
            onClick={handleLoadMessagesOnClick}
            disabled={!loadMessagesButtonEnabled || loadingMessagesResponse}
          >
            Load 10 More Messages
          </StyledButton>
          <span></span>
        </LoadMessagesButtonContainer>
        <ChatHistory 
          textInput={textInput}
          getMessages={getMessages} 
        />
        <ChatInputContainer>
          <ChatInputSenderContainer>
            <StyledInput 
              placeholder='sender' 
              value={sender} 
              onChange={(event) => setSender(event.target.value)}
            />
          </ChatInputSenderContainer>
          <ChatInputMessageContainer>
            <StyledInput 
              placeholder='message' 
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
    </ThemeProvider>
  );
}

export default App;
