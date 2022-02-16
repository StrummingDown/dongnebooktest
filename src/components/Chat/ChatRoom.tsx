import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { headerState } from "../../state";

type chatsType = {
  id: number;
  content: any;
};

const ChatRoom = () => {
  const setHeader = useSetRecoilState(headerState);
  const params = useParams<string>();
  const [chats, setChats] = useState<chatsType[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (params.id) {
      setHeader(true);
    }
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative max-w-md w-full m-auto bg-green-50 h-full md:h-[600px] overflow-hidden">
        <nav className="flex justify-between text-xl p-3">
          <Link
            to="/chat"
            onClick={() => setHeader((prev: boolean) => !prev)}
            className="cursor-pointer">
            <i className="fas fa-arrow-left "></i>
          </Link>
          <h1 className="font-bold mb-4">사용자 닉네임</h1>
          <div></div>
        </nav>
        <div className="h-32 flex items-center chatroom--shadow p-3">
          <img
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80"
            alt="book"
            className="h-full mr-4"
          />
          <h1 className="text-xs">어린 왕자 백과사전</h1>
        </div>
        <ul className="overflow-y-scroll h-[65%] p-3">
          {chats.map((chat: { id: number; content: string }, i: number) => (
            <li key={chat.id} className={i % 2 === 0 ? "text-right" : ""}>
              {chat.content}
            </li>
          ))}
        </ul>
        <input
          type="text"
          className="bg-slate-400 absolute bottom-0 left-0 right-0"
          onChange={(e) => setContent(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setChats((prev) => [...prev, { id: Date.now(), content }]);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
