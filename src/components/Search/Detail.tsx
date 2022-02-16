import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getSingleBookInfo, timeForToday } from "../../api";

const Container = styled.div`
  max-width: 1400px;
  height: 100%;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 66px 15px 0px 15px;
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

const KeyInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 400px;
  border: 1px solid green;
  margin: 30px;
`;

const BookImg = styled.img`
  width: 35%;
  height: 100%;
  object-fit: fill;
`;

const KeyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 60%;
  height: 100%;
  border: 2px solid green;
`;

const BookTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;
  font-size: 25px;
  font-weight: bold;
  padding: 20px;
  border: 1px solid red;
`;

const LocandDateBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 10%;
  border: 1px solid green;
  padding: 20px;
`;

const Loc = styled.div`
  color: grey;
  border: 1px solid pink;
  margin-right: 10px;
`;
const Date = styled.div`
  color: grey;
`;

type BookInfo = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userNickname: string;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  locations: {
    id: number;
    lat: number;
    lon: number;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
};

const Details = () => {
  let { id } = useParams();

  const [bookDetailInfo, setBookDetailInfo] = useState<BookInfo | {}>({});

  const { title, img, content, quality, exchanged, userNickname, createdAt, locations } = bookDetailInfo as BookInfo;

  const date = timeForToday(createdAt);

  const getSingleData = async () => {
    const data = await getSingleBookInfo(Number(id));
    setBookDetailInfo(data);
  };

  useEffect(() => {
    getSingleData();
  }, []);

  return (
    <Container>
      <TitleBox>
        <Title>상세보기</Title>
      </TitleBox>
      <KeyInfoBox>
        <BookImg src={img} />
        <KeyInfo>
          <BookTitle>{title}</BookTitle>
          <LocandDateBox>
            <Loc>{locations?.address}</Loc>
            <Date>{date}</Date>
          </LocandDateBox>
        </KeyInfo>
      </KeyInfoBox>
    </Container>
  );
};

export default Details;
