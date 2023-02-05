import styled from "styled-components";

const OptionsRow = styled.div.attrs({
  className: 'OptionsRow',
})`
  display: table;
  height: 100%;
`;

const OptionsContainer = styled.div.attrs({
  className: 'OptionsContainer',
})`
  verticalAlign: middle;
  display: table-cell;
  height: 100%;
`;

const ButtonsContainer = styled.div.attrs({
  className: 'ButtonsContainer',
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

export const Options = ({ setShowChat, theme, themeToggler}) => {

  return (
    <OptionsRow>
      <OptionsContainer>
        <ButtonsContainer>
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
        </ButtonsContainer>
      </OptionsContainer>
    </OptionsRow>
  );
}