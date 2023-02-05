import './App.css';
import useWebSocket from 'react-use-websocket';
import useAxios from 'axios-hooks';
import React, { useEffect, useState, useRef } from 'react';
import { lightTheme, darkTheme } from './constants';
import { ThemeProvider } from "styled-components";
import { NameSetterContent } from './components/name-setter-content';
import { ChatContent } from './components/chat-content';

function App() { 
  const firstRender = useRef(true);
  const messagesEndRef = useRef();
  const [showChat, setShowChat] = useState(false);
  const [atBottomOfMessages, setAtBottomOfMessages] = useState(true);
  const [theme, setTheme] = useState('light');
  const [loadMessagesButtonEnabled, setLoadMessagesButtonEnabled] = useState(true);
  const [, setOffset] = useState(10);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [otherTypingUsers, setOtherTypingUsers] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [{ data: messagesResponse, loading: loadingMessagesResponse }, getMessages] = 
    useAxios({
      url: 'https://api.chatco.danielbsokol.engineer/api/messages/',
      method: 'GET',
    });    
  const { sendMessage } = useWebSocket(`ws://localhost:8000/ws/chat/`, {
  // const { sendMessage } = useWebSocket(`wss://api.chatco.danielbsokol.engineer/ws/chat/`, {
    onMessage: (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'message_content') {
        setData((data) => [...data, message]);
        setOffset((offset) => offset + 1);
      }
      else if (message.type === 'typing_status' && sender !== message.sender ) {
        console.log(message);
        setOtherTypingUsers((otherTypingUsers) => (
          [
            ...otherTypingUsers.filter((typingUser) => typingUser.sender !== message.sender),
            { sender: message.sender, isTyping: message.isTyping },
          ]
        ));
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    console.table(otherTypingUsers);
  }, [otherTypingUsers])

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
    if (data && atBottomOfMessages) scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (atBottomOfMessages) scrollToBottom();
  }, [atBottomOfMessages]);
  
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  const submitMessage = () => {
    sendMessage(JSON.stringify({
      'type': 'message_content',
      'sender': sender,
      'message': message
    }));
    sendMessage(JSON.stringify({
      'type': 'typing_status',
      'isTyping': false,
      'sender': sender,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setAtBottomOfMessages(true);
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      {showChat ? (
        <ChatContent
          handleLoadMessagesOnClick={handleLoadMessagesOnClick}
          loadMessagesButtonEnabled={loadMessagesButtonEnabled}
          loadingMessagesResponse={loadingMessagesResponse}
          messagesEndRef={messagesEndRef}
          setAtBottomOfMessages={setAtBottomOfMessages}
          message={message}
          setMessage={setMessage}
          submitMessage={submitMessage}
          messageHistory={messageHistory}
          data={data}
          themeToggler={themeToggler}
          setShowChat={setShowChat}
          theme={theme}
          sendMessage={sendMessage}
          sender={sender}
          otherTypingUsers={otherTypingUsers}
        />
      ) : (
        <NameSetterContent
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
