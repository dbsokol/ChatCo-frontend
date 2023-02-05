import styled from 'styled-components';

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

export const ChatHistory = ({ 
    textInput, 
    handleLoadMessagesOnClick,
    loadMessagesButtonEnabled,
    loadingMessagesResponse,
    messagesEndRef,
    setAtBottomOfMessages,
  }) => {
    const handleOnScroll = (event) => {
      if (event.currentTarget.scrollTop < 5) {
        setAtBottomOfMessages(false);
      } else setAtBottomOfMessages(true);
    };

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
          <div ref={messagesEndRef} />
        </ChatHistoryTextarea>
      </ChatHistoryContainer>
    )
  }
  