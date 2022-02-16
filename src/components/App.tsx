import Routers from "./Routers";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

declare global {
  interface Window {
    kakao: any;
  }
}

const App = () => {
  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      // TODO: 서버에서 상태유지(keep) === false => 서버에다가 로그아웃 요청 보냄
    });
    return () => window.removeEventListener("beforeunload", () => alert("h"));
  }, []);

  return <Routers />;
};

export default App;
