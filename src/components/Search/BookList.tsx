import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0px 0px 20px 0px;
  margin-bottom: 10px;
`;

const BookImgBox = styled.div`
  width: 100%;
  height: 80%;
`;

const BookImg = styled.img`
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  font-size: 19px;
  height: 10%;
  margin: 5px 5px 0px 5px;
`;
const Location = styled.div`
  height: 10%;
  font-size: 15px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.6);
`;

type ListProps = {
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

const Booklist = ({ list }: { list: ListProps }) => {
  const { id, title, content, img, locations } = list;
  const { address } = locations;
  return (
    <Container to={`${id}`}>
      <BookImgBox>
        <BookImg src={img} />
      </BookImgBox>
      <Title>{title}</Title>
      <Location>{address}</Location>
    </Container>
  );
};

export default Booklist;
