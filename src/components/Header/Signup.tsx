import { useState } from "react";
import styled from "styled-components";
import { useForm, ValidationRule } from "react-hook-form";
import lock from "../../img/lock.png";
import lockcheck from "../../img/lockcheck.png";
import { postEmailcheck, postNickcheck, postSignup } from "../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DaumPostCode from "react-daum-postcode";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 360px;
  margin: auto;
  padding-top: 66px;
  padding-bottom: 10px;
`;

const SignupBox = styled.div`
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 10px;
`;

const SignupTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: white;
`;

interface ErrorProps {
  error: string | undefined;
}

const Input = styled.input<ErrorProps>`
  text-decoration: none;
  border: none;
  padding: 20px 20px;
  font-size: 15px;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const NarrowInput = styled(Input)`
  width: 80%;
`;

const WideInput = styled(Input)`
  width: 100%;
`;

const Label = styled.label`
  width: 100%;
  display: flex;
  margin-bottom: 3px;
  color: grey;
  font-weight: bold;
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  height: 60px;
  cursor: pointer;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;

const NarrowButton = styled(Button)`
  font-size: 15px;
  transition: 0.3s;
  padding: 0 5px;
`;

const SignupButton = styled(Button)`
  width: 100%;
  font-size: 20px;
  transition: 0.3s;
`;

interface Nickprops {
  nickValid?: boolean;
}

const Errorbox = styled.div<Nickprops>`
  color: ${(props) => (props.nickValid ? "green" : "red")};
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 12px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Img = styled.img`
  position: absolute;
  top: 15px;
  right: 3px;
  width: 38px;
  height: 38px;
`;

type FormData = {
  nickname: string;
  email: string;
  certification: string | undefined;
  password: string;
  password2: string;
  address: string;
};

const Signup = () => {
  const [nickCheck, setNickCheck] = useState("");
  const [nickValid, setNickValid] = useState(false);
  const [certificationNum, setCertificationNum] = useState<string | undefined>("");
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const onSubmit = async (data: FormData) => {
    if (nickCheck === "") {
      Swal.fire({
        text: "닉네임 중복확인이 필요합니다",
        confirmButtonText: "확인",
        confirmButtonColor: "#2f6218",
        icon: "warning",
      });
    } else if (!nickValid) {
      Swal.fire({
        text: "이미 사용중인 닉네임입니다",
        confirmButtonText: "확인",
        confirmButtonColor: "#2f6218",
        icon: "error",
      });
      return;
    } else {
      const { email, password, nickname } = getValues();
      await postSignup({ email, password, nickname });
      navigate("/signin");
    }
  };

  const myPattern: ValidationRule<RegExp> = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "이메일 형식으로 입력해주세요",
  };

  const nickPattern: ValidationRule<RegExp> = {
    value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/,
    message: "숫자, 영어, 한글만 입력해주세요",
  };

  const passwordPattern: ValidationRule<RegExp> = {
    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    message: "8자이상 / 영문 / 숫자 / 특수문자를 조합해주세요",
  };

  const getNick = async () => {
    let formVerified = await trigger("nickname");
    if (formVerified) {
      const { nickname } = getValues();
      //현시간 동기화가 안된다. 빠깥에 선언해주면 안된다.
      // TODO: 아래 부분은 실제 API call로 대체 해야함
      let valid = await postNickcheck({ nickname });
      if (valid) {
        setNickValid(true);
        setNickCheck("사용 가능한 닉네임입니다");
      } else {
        setNickValid(false);
        setNickCheck("이미 사용중인 닉네임입니다");
      }
    }
  };
  //useState는 비동기적으로 실행이된다.

  const postEmail = async () => {
    let formVerified = await trigger("email");
    if (formVerified) {
      const { email } = getValues();
      const certificationNumber = await postEmailcheck({ email });
      setCertificationNum(certificationNumber);
      if (!certificationNumber) {
        Swal.fire({
          text: "이미 가입된 회원입니다",
          confirmButtonText: "확인",
          confirmButtonColor: "#2f6218",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "인증메일이 발송되었습니다",
          text: "기입하신 메일로 인증메일이 발송되며, 메일을 확인하셔야 가입이 완료됩니다. 메일 확인 후 인증번호를 기입해주세요.",
          confirmButtonText: "확인",
          confirmButtonColor: "#2f6218",
          icon: "success",
        });
      }
    }
  };

  return (
    <Container>
      <SignupBox>
        <SignupTitle>회원가입</SignupTitle>
      </SignupBox>
      <SignupForm onSubmit={handleSubmit(onSubmit)}>
        <Label>닉네임</Label>
        <Wrap>
          <NarrowInput
            type="text"
            error={errors.nickname?.message}
            {...register("nickname", {
              required: "닉네임을 입력해주세요",
              pattern: nickPattern,
              minLength: { value: 2, message: "최소 2자 이상 입력해주세요" },
              maxLength: { value: 8, message: "최대 8자 이하로 입력해주세요" },
              onChange: () => {
                setNickValid(false);
                setNickCheck("");
              },
              shouldUnregister: true,
            })}
          />
          <NarrowButton type="button" onClick={getNick}>
            중복확인
          </NarrowButton>
        </Wrap>
        <Errorbox nickValid={nickValid}>{errors.nickname?.message ? errors.nickname.message : nickCheck}</Errorbox>
        <Label>이메일</Label>
        <Wrap>
          <NarrowInput
            type="text"
            error={errors.email?.message}
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: myPattern,
            })}
          />
          <NarrowButton type="button" onClick={postEmail}>
            인증요청
          </NarrowButton>
        </Wrap>
        <Errorbox>{errors.email?.message}</Errorbox>
        <Label>인증번호</Label>
        <InputContainer>
          <WideInput
            type="text"
            error={errors.certification?.message}
            {...register("certification", {
              required: "인증번호를 입력해주세요",
              validate: {
                matchPassword: (value: string | undefined) => {
                  return certificationNum === value || "인증번호가 일치하지 않습니다.";
                },
              },
            })}
          />
        </InputContainer>
        <Errorbox>{errors.certification?.message}</Errorbox>
        <Label>비밀번호</Label>
        <InputContainer>
          <WideInput
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              pattern: passwordPattern,
            })}
          />
          <Img src={lock} />
        </InputContainer>
        <Errorbox>{errors.password?.message}</Errorbox>
        <Label>비밀번호 재확인</Label>
        <InputContainer>
          <WideInput
            type="password"
            error={errors.password2?.message}
            {...register("password2", {
              required: "비밀번호를 입력해주세요",
              validate: {
                matchPassword: (value) => {
                  const { password } = getValues();
                  return password === value || "비밀번호가 일치하지 않습니다.";
                },
              },
            })}
          />
          <Img src={lockcheck} />
        </InputContainer>
        <Errorbox>{errors.password2?.message}</Errorbox>
        <SignupButton type="submit">가입하기</SignupButton>
      </SignupForm>
    </Container>
  );
};
export default Signup;
