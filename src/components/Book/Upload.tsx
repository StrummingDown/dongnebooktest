import styled from "styled-components";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import {
  contentStorage,
  currentaddress,
  currentLatitude,
  currentLocationStorage,
  currentLongtitude,
  imageStorage,
  loginState,
  mapResultsStorage,
  searchLocation,
  titleStorage,
} from "../../state";
import Swal from "sweetalert2";
import Map from "./Map";
import { useEffect } from "react";
import { postContent } from "../../api";

declare global {
  interface Window {
    kakao: any;
  }
}

const DisplayRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DisplayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const Container = styled(DisplayColumn)`
  justify-content: center;
  width: 100%;
  padding-top: 66px;
  max-width: 1400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  height: 100%;
`;

const TitleBox = styled.div`
  width: 100%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const UploadInform = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 20px 0px;
`;

const InformBox = styled.div`
  display: flex;
  width: 20%;
`;

const InformTitle = styled.div`
  min-width: 100px;
  font-size: 18px;
  color: #363636f0;
  padding: 0px 0px 0px 10px;
`;

const Uploads = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
`;

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  width: 150px;
  height: 150px;
  border: 1px solid #dcdbe3;
  background-color: #fafafd;
  i {
    font-size: 30px;
    color: #dcdbe3;
  }
`;

const ImgFile = styled.input`
  text-decoration: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  font-size: 0;
  opacity: 0;
`;

interface ErrorProps {
  error: string | undefined;
}

const Input = styled.input<ErrorProps>`
  text-decoration: none;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  width: 100%;
  padding: 8px;
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const Errorbox = styled.div`
  color: red;
  font-weight: bold;
  font-size: 12px;
  padding-left: 5px;
`;

const TitleLength = styled(DisplayRow)`
  width: 8%;
  text-align: right;
  margin: 0px 10px 0px 20px;
`;

const Textarea = styled.textarea<ErrorProps>`
  height: 200px;
  width: 95%;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const ButtonBox = styled(DisplayRow)`
  width: 100%;

  /* border: 2px solid purple; */
`;

const BookImg = styled.img`
  /* margin: 15px; */
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* height: 150px; */
  /* border: 1px solid #dcdbe3; */
`;

const ImgTitle = styled.div`
  color: #b2b0b0;
`;

const Button = styled.button`
  min-width: 100px;
  width: 20%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  margin: 30px 30px;
`;

const RegisterButton = styled(Button)`
  background-color: #2f6218;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;
const CancelButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 100px;
  width: 20%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  margin: 30px 30px;
  background-color: #b2b0b0;
  &:hover {
    background-color: rgba(178, 176, 176, 0.8);
  }
`;

const Count = styled.div`
  margin-top: 10px;
`;

const CheckBox = styled.input`
  margin-right: 10px;
`;

const Checklabel = styled.label`
  margin-right: 10px;
  color: grey;
`;
const LocationWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: reltative;
`;

const SearchBar = styled.input`
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

const SearchContainer = styled.div`
  width: 100%;
  position: relative;
`;

const CheckBoxWrap = styled.div``;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
`;
const SearchResultBox = styled.div`
  position: absolute;
  width: 60%;
  z-index: 20;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const SearchResult = styled.div`
  background-color: white;
  padding: 2px;
  cursor: pointer;

  /* position: absolute; */
`;
//file받아오고 file수만큼 이미지를 만들어준다.
type FormData = {
  img: FileList;
  title: string;
  content: string;
  quality: string;
  location: string;
  latitude: number;
  longtitude: number;
};

const Upload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgList, setImgList] = useState<string[]>([]);
  const setTitle = useSetRecoilState(titleStorage);
  const setContent = useSetRecoilState(contentStorage);
  const setImg = useSetRecoilState(imageStorage);
  const setLocation = useSetRecoilState(searchLocation);
  const setCurrentLocation = useSetRecoilState(currentLocationStorage);
  const mapSearchResults = useRecoilValue(mapResultsStorage);
  const token = useRecoilValue(loginState);
  const latitude = useRecoilValue(currentLatitude);
  const longtitude = useRecoilValue(currentLongtitude);
  const address = useRecoilValue(currentaddress);

  const side = useRef<HTMLDivElement>(null);
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const { title } = watch();
  const { content } = watch();

  const postData = async () => {
    const { title, content, img, quality } = getValues();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", img[0]);
    formData.append("quality", quality);
    formData.append("lat", String(latitude));
    formData.append("lon", String(longtitude));
    formData.append("address", address);
    formData.append("token", String(token));

    postContent(formData);
  };

  const onSubmit = async () => {
    const { quality } = getValues();
    if (quality === null) {
      return Swal.fire({
        text: "상품 상태를 선택해주세요",
        confirmButtonText: "확인",
        confirmButtonColor: "#2f6218",
        icon: "warning",
      });
    }
    try {
      console.log("hi");
      await postData();
    } catch (e) {
      throw e;
    }

    console.log(quality);
    setTitle(title);
    setContent(content);
  };

  const searchPlace = async () => {
    setIsOpen(!isOpen);
    const { location } = getValues();
    setLocation(location);
  };

  const handleClickOutside = (event: CustomEvent<MouseEvent>) => {
    console.log("작동되냐");
    if (isOpen && !side?.current?.contains(event.target as Node)) {
      console.log("외않되");
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside as EventListener);
    return () => {
      window.removeEventListener("click", handleClickOutside as EventListener);
    };
  }, [isOpen]);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TitleBox>
          <Title>도서 등록</Title>
        </TitleBox>
        <UploadInform>
          <InformBox>
            <InformTitle>제목</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <Input
                type="text"
                placeholder="도서명을 입력해주세요."
                error={errors.title?.message}
                {...register("title", {
                  required: "제목을 입력해주세요",
                  maxLength: { value: 20, message: "최대 20자 이하로 입력해주세요" },
                })}
              />
              <Errorbox>{errors.title?.message}</Errorbox>
            </InputBox>
            <TitleLength>{title === undefined ? "0/20" : `${title.length}/20`}</TitleLength>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>상태</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <CheckBoxWrap>
                <CheckBox type="radio" id="new" value="새상품같음" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="new">새상품같음</Checklabel>
                <CheckBox type="radio" id="notnew" value="약간헌책" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="notnew">약간헌책</Checklabel>
                <CheckBox type="radio" id="dirty" value="많이헌책" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="dirty">많이헌책</Checklabel>
              </CheckBoxWrap>
              <Errorbox>{errors.quality?.message}</Errorbox>
            </InputBox>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>사진</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Label htmlFor="input_file">
                  <i className="fas fa-camera"></i>
                  <ImgTitle>이미지 업로드</ImgTitle>
                  <ImgFile
                    id="input_file"
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("img", {
                      required: "이미지를 업로드해주세요",
                      onChange: (event) => {
                        let files = event.target.files;
                        if (imgList.length >= 3) {
                          return Swal.fire({
                            text: "사진첨부는 최대 3장까지 가능합니다",
                            confirmButtonText: "확인",
                            confirmButtonColor: "#2f6218",
                            icon: "warning",
                          });
                        }
                        if (files && files.length) {
                          for (let i = 0; i < files.length; i++) {
                            let reader = new FileReader();
                            reader.onload = function () {
                              setImgList((prev) => [...prev, String(reader.result)]);
                            };
                            reader.readAsDataURL(files[i]); // loadre\\ //////// <><><><><><><<>
                          }
                        }
                      },
                    })}
                  />
                </Label>
                {imgList.map((url) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        border: "1px solid #dcdbe3",
                        width: "150px",
                        height: "150px",
                        padding: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "20px",
                        // margin: "10px",
                      }}
                    >
                      <BookImg src={url}></BookImg>
                    </div>
                  );
                })}
              </div>
              <Errorbox>{errors.img?.message}</Errorbox>
            </InputBox>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>설명</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <Textarea
                placeholder="상품 설명을 입력해주세요.(10글자이상)"
                error={errors.content?.message}
                {...register("content", {
                  required: "상품 설명을 입력해주세요.",
                  minLength: { value: 10, message: "상품 설명을 10자 이상 입력해주세요" },
                  maxLength: { value: 500, message: "상품 설명을 500자 이하 입력해주세요" },
                })}
              />
              <Wrap>
                <Errorbox>{errors.content?.message}</Errorbox>
                <Count>{content === undefined ? "0/200" : `${content.length}/500`}</Count>
              </Wrap>
            </InputBox>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>위치</InformTitle>
          </InformBox>
          <Uploads>
            <LocationWrap>
              <SearchContainer>
                <SearchBox>
                  <SearchBar type="text" placeholder="건물,지역 검색" {...register("location")}></SearchBar>
                  <SearchButton type="button" onClick={searchPlace}>
                    <i className="fas fa-search"></i>
                  </SearchButton>
                </SearchBox>
                {isOpen ? (
                  <SearchResultBox ref={side}>
                    {mapSearchResults.map((searchResult: { address_name: string }) => {
                      return (
                        <SearchResult
                          onClick={() => {
                            setIsOpen(!isOpen);
                            // alert(`${searchResult.address_name} 으로 이동`);
                            setCurrentLocation(searchResult);
                            // recoil에 searchResult 저장
                            /** searchResult 예
                             * address_name: "서울 강남구 신사동 668-33"
                             * category_group_code: "AT4"
                             * category_group_name: "관광명소"
                             * category_name: "여행 > 관광,명소 > 테마거리"
                             * distance: ""
                             * id: "7990409"
                             * phone: "02-3445-6402"
                             * place_name: "압구정로데오거리"
                             * place_url: "http://place.map.kakao.com/7990409"
                             * road_address_name: ""
                             * x: "127.039152029523"
                             * y: "37.5267558230172"
                             **/
                          }}
                        >
                          {searchResult?.address_name}
                        </SearchResult>
                      );
                    })}
                  </SearchResultBox>
                ) : null}
              </SearchContainer>
              <Map />
            </LocationWrap>
          </Uploads>
        </UploadInform>
        <ButtonBox>
          <CancelButton to="/search">취소</CancelButton>
          <RegisterButton type="submit">등록</RegisterButton>
        </ButtonBox>
      </Form>
    </Container>
  );
};

export default Upload;
