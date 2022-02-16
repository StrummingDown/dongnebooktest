import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Upload from "../pages/Book";
import Chat from "../pages/Chat";
import Main from "../pages/Main";
import Search from "../pages/Search";
import { headerState } from "../state";
import ChatRoom from "./Chat/ChatRoom";
import Detail from "./Search/Detail";
import Header from "./Header/Header";
import Mypage from "./Header/Mypage";
import Signin from "./Header/Signin";
import Signup from "./Header/Signup";

const Routers = () => {
  const check = useRecoilValue<boolean>(headerState);
  return (
    <BrowserRouter>
      {!check && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/myinfo" element={<Mypage />} />
        <Route path="/search/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
