import styled from 'styled-components';

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

export const Title = () => (
  <TitleContainer>
    <StyledH2>
      ChatCo | danielbsokol.engineer
    </StyledH2>
  </TitleContainer>
);