import styled from "styled-components";
import Booklist from "./BookList";

const Container = styled.section`
  padding: 0px 15px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
  height: 100vh;
`;

const BookListContainer = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 320px;
  width: 100%;
  display: grid;
  padding-left: 30px;
  grid-gap: 20px;
`;

type BookInfo = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  locations: {
    address: string;
  };
};

const BookList = ({ allProductList }: { allProductList: BookInfo[] }) => {
  return (
    <Container>
      <BookListContainer>
        {allProductList.map((list, idx) => {
          return <Booklist key={idx} list={list} />;
        })}
      </BookListContainer>
    </Container>
  );
};

export default BookList;
