import styled from 'styled-components';
import moment from "moment";
import { useEffect } from 'react';


const ChatHistoryTextarea = styled.div.attrs({
  className: 'ChatHistoryTextarea'
})`
  height: 100%;
  overflow-y: auto;
`;

const ChatHistoryContainer = styled.div.attrs({
  className: 'ChatHistoryContainer'
})`
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.background};
  padding: 5px;
  position: relative;
`;

const LoadMessagesButtonContainer = styled.div.attrs({
  className: 'LoadMessagesButtonContainer',
})`
  position: absolute;
  width: -webkit-fill-available;
  text-align: center;

  @media (max-width: 480px) {
    width: 100%;
    left: 0;
    padding 0 5px;
  }
`;

const StyledRelativeButton = styled.button.attrs({
  className: `StyledRelativeButton`,
})(
  ({ disabled }) => `
    padding: 2px;
    height: 100%;
    display: ${disabled ? 'none' : 'default'};
    cursor: ${disabled ? 'default' : 'pointer'};
    opacity: 0.75;

    @media (max-width: 480px) {
      width: -webkit-fill-available;
    }
  `
);

const Timestamp = styled.span.attrs({
  className: 'Timestamp',
})`
  font-family: monospace, monospace;
  white-space: pre-wrap;
  margin-left: 5px;
  margin-right: 5px;
`

const Sender = styled.span.attrs({
  className: 'Sender',
})`
  color: ${({ theme }) => theme.nameText};
  margin-left: 3px;
`;

const Message = styled.span.attrs({
  className: 'Message',
})`
  margin-left: 3px;
`;

const TextLine = styled.div.attrs({
  className: 'TextLine',
})`
  // display: flex;
  overflow-wrap: anywhere;
  padding: 2px;
  &:nth-child(2n) {
    background-color: ${({ theme }) => theme.altLine};
  }
  -webkit-transition: height .3s ease;
`;

const ThreeDotsContainer = styled.span.attrs({
  className: 'ThreeDotsContainer',
})`
  margin-left: 3px;
  width: 60px;
`;

const ThreeDots = styled.div.attrs({
  className: 'ThreeDots loader',
})`
  display: inline-block;
`;

export const ChatHistory = ({ 
  data,
  messageHistory, 
  handleLoadMessagesOnClick,
  loadMessagesButtonEnabled,
  loadingMessagesResponse,
  messagesEndRef,
  setAtBottomOfMessages,
  atBottomOfMessages,
  scrollToBottom,
  otherTypingUsers,
}) => {      
  const textInput = [
    ...messageHistory.sort((a,b) => (a.timestamp > b.timestamp ? 1 : -1)), 
    ...data,
  ].map((message, index) => {
    const timestamp = moment(message.timestamp).format('h:mm A').padStart(8);
    const sender = <Sender>{message.sender}</Sender>;
    return (
      <TextLine key={index}>
        <Timestamp>{timestamp}</Timestamp> -
        <Sender>{sender}</Sender>:
        <Message>{message.content}</Message>
      </TextLine>
    )
  });

  const typingInput = otherTypingUsers
    ?.filter((typingUser) => typingUser.isTyping)
    ?.map((typingUser, index) => (
      <TextLine key={index}>
        <Timestamp>{' '}typing{' '}</Timestamp> -{' '}
        <Sender>{typingUser.sender}</Sender>:{' '}
        <ThreeDotsContainer>
          <ThreeDots/>
        </ThreeDotsContainer>
      </TextLine>
    ));

  const handleOnScroll = (event) => {
    if (event.currentTarget.scrollTop < 5) {
      setAtBottomOfMessages(false);
    } else setAtBottomOfMessages(true);
  };

  useEffect(() => {
    // console.log(atBottomOfMessages);
    if (!atBottomOfMessages) return;
    scrollToBottom();
  }, [typingInput]);

  return (
    <ChatHistoryContainer>
      <LoadMessagesButtonContainer>
        <StyledRelativeButton 
          onClick={handleLoadMessagesOnClick}
          disabled={!loadMessagesButtonEnabled}
        >
          Load 10 More Messages
        </StyledRelativeButton>
      </LoadMessagesButtonContainer>
      <ChatHistoryTextarea 
        onScroll={(event) => handleOnScroll(event)}
      >
        {textInput}
        {typingInput}
        <div ref={messagesEndRef} />
      </ChatHistoryTextarea>
    </ChatHistoryContainer>
  )
}
  