import './App.css';
import useWebSocket from 'react-use-websocket';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const Content = styled.div.attrs({
  className: 'Content'
})`
  display: grid;
  grid-template-rows: 2fr 1fr 17fr 1fr;
  gap 2em;
  height: 70vh;
  padding 2em;
`;

const TitleContainer = styled.div.attrs({
  className: 'TitleContainer'
})`
  background-color: darkblue;
  text-align: center;
  color: white;
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

const ChatHistoryTextarea = styled.textarea.attrs({
  className: 'ChatHistoryTextarea'
})`
  width: 100%;
  height: 100%;
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
  grid-template-columns: 3fr 1fr 3fr;
  gap: 2em;
`;

const ChatHistory = ({ textInput, getMessages }) => {

  return (
    <ChatHistoryContainer>
      <ChatHistoryTextarea value={textInput} readOnly={true}></ChatHistoryTextarea>
    </ChatHistoryContainer>
  )
}


function App() {
  const [loadMessagesButtonEnabled, setLoadMessagesButtonEnabled] = useState(true);
  const [offset, setOffset] = useState(10);
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
  ].map((message) => 
    `${moment(message.timestamp).format('h:mm A')} - ${message.sender}: ${message.content}`).join('\n');

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
    <Content>
      <TitleContainer>
        <h2>
          ChatCo | danielbsokol.engineer
        </h2>
      </TitleContainer>
      <LoadMessagesButtonContainer>
        <span></span>
        <StyledButton 
          onClick={handleLoadMessagesOnClick}
          disabled={!loadMessagesButtonEnabled}
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
  );
}

export default App;
