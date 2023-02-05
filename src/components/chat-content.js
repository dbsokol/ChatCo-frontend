import styled from "styled-components";
import { ChatHistory } from './chat-history';
import { Title } from './title';
import { Options } from './options';
import { ChatInput } from './chat-input';


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

export const ChatContent = ({
  setShowChat,
  theme,
  themeToggler,
  handleLoadMessagesOnClick,
  loadMessagesButtonEnabled,
  loadingMessagesResponse,
  messagesEndRef,
  setAtBottomOfMessages,
  atBottomOfMessages,
  scrollToBottom,
  message,
  setMessage,
  submitMessage,
  messageHistory,
  data,
  sendMessage, 
  sender,
  otherTypingUsers,
}) => {

  return (
    <Content>
      <Title/>
      <Options 
        setShowChat={setShowChat}
        theme={theme}
        themeToggler={themeToggler}
      />
      <ChatHistory 
        data={data}
        messageHistory={messageHistory}
        handleLoadMessagesOnClick={handleLoadMessagesOnClick}
        loadMessagesButtonEnabled={loadMessagesButtonEnabled}
        loadingMessagesResponse={loadingMessagesResponse}
        messagesEndRef={messagesEndRef}
        setAtBottomOfMessages={setAtBottomOfMessages}
        atBottomOfMessages={atBottomOfMessages}
        scrollToBottom={scrollToBottom}
        otherTypingUsers={otherTypingUsers}
      />
      <ChatInput
        message={message}
        setMessage={setMessage}
        submitMessage={submitMessage}
        sendMessage={sendMessage}
        sender={sender}
      />
    </Content>
  );
}