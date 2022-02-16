import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  width: 100%;
  padding: 66px 0px 20px 0px;
  max-width: 1400px;
  position: relative;
`;

const TitleBox = styled.div`
  width: 80%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const SearchBox = styled.div`
  margin-top: 30px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SearchInput = styled.input`
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* border-radius: 10px; */
  width: 60%;
  padding: 8px;
  &:focus {
    outline-color: green;
    /* border-bottom: 2px solid rgba(0, 0, 0, 0.2); */
  }
`;
const SearchButton = styled.button`
  /* height: 40px; */
  cursor: pointer;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
  font-size: 15px;
  transition: 0.3s;
  padding: 0 15px;
  i {
    color: white;
    font-size: 18px;
  }
`;

const IconBox = styled(Link)`
  width: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  i {
    font-size: 35px;
    &:hover {
      color: rgba(47, 98, 24);
    }
  }
`;

const SearchBar = () => {
  return (
    <Container>
      <TitleBox>
        <Title>도서 검색</Title>
      </TitleBox>
      <SearchBox>
        <SearchInput type="text" placeholder="찾고싶은 도서를 검색해보세요"></SearchInput>
        <SearchButton type="button">
          <i className="fas fa-search"></i>
        </SearchButton>
        <IconBox to="/upload">
          <i className="fas fa-plus-circle"></i>
        </IconBox>
      </SearchBox>
    </Container>
  );
};

export default SearchBar;
