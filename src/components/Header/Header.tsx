import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { loginState } from "../../state";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getUserInfo } from "../../api";
import { userState } from "../../state";

const Header = () => {
  const [click, setClick] = useState(false);
  const [login, setLogin] = useRecoilState(loginState);
  const setUser = useSetRecoilState(userState);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(await getUserInfo(token));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed top-0 left-0 bg-white header--shadow w-full z-50">
      <header className="flex justify-between max-w-screen-xl m-auto w-full p-2">
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="h-10" />
          </Link>
        </div>
        <nav className="md:flex hidden justify-center items-center">
          <Link
            to="/search"
            className="flex flex-col hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold text-center">검색</span>
          </Link>
          <Link
            to="/chat"
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">채팅</span>
          </Link>
          <Link
            to="/notice"
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">공지사항</span>
          </Link>
          <Link
            to={login ? "/myinfo" : "/signup"}
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">
              {login ? "내정보" : "회원가입"}
            </span>
          </Link>
          <Link
            to={login ? "/" : "/signin"}
            onClick={() => {
              if (login) {
                localStorage.removeItem("token");
                setLogin(null);
              }
            }}
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">
              {login ? "로그아웃" : "로그인"}
            </span>
          </Link>
        </nav>
        <i
          onClick={() => setClick((prev) => !prev)}
          className="md:hidden fas fa-bars text-2xl hover:text-green-600 cursor-pointer transition duration-200"></i>
        <nav
          className={`md: justify-center items-centerhidden absolute right-0 top-14 bg-white w-full header--shadow -z-50 p-3 ${
            click ? "sidebar--slide" : "hidden"
          }`}>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/search"
            className="flex flex-col hover:text-green-600 text-center cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">검색</span>
          </Link>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/chat"
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">채팅</span>
          </Link>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/notice"
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">공지사항</span>
          </Link>

          <Link
            onClick={() => setClick((prev) => !prev)}
            to={login ? "/myinfo" : "/signup"}
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">
              {login ? "내정보" : "회원가입"}
            </span>
          </Link>
          <Link
            onClick={() => {
              if (login) {
                localStorage.removeItem("token");
                setLogin(null);
                setUser({});
              }
              setClick((prev) => !prev);
            }}
            to={login ? "/" : "/signin"}
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">
              {login ? "로그아웃" : "로그인"}
            </span>
          </Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
