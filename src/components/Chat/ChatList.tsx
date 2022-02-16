import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { headerState } from "../../state";

interface ChatListObj {
  id: number;
  img: string;
  nickName: string;
  content: string;
  createdAt: string;
  count: number;
}

const chats: ChatListObj = {
  id: 1,
  img: "https://images.unsplash.com/photo-1644594717864-74fe64380d58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80",
  nickName: "머규",
  content: "안녕하십니까",
  createdAt: `${`${
    new Date().getHours() < 10
      ? `0${new Date().getHours()}`
      : new Date().getHours()
  }:${
    new Date().getMinutes() < 10
      ? `0${new Date().getMinutes()}`
      : new Date().getMinutes()
  }`}`,
  count: 2,
};

const ChatList = () => {
  const setHeader = useSetRecoilState(headerState);
  return (
    <div className="pt-14 max-w-md w-full m-auto text-center font-bold">
      <h1 className="text-2xl">채팅목록</h1>
      <ul>
        <Link
          to={`${chats.id}`}
          onClick={() => setHeader((prev: boolean) => !prev)}>
          <li className="flex cursor-pointer hover:bg-green-200 transition duration-300 p-5">
            <img
              src={`${chats.img}`}
              alt={`${chats.nickName}`}
              className="w-14 h-14 rounded-2xl mr-3"
            />
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h1 className="text-lg">{chats.nickName}</h1>
                <span className="text-xs">{chats.createdAt}</span>
              </div>
              <p className="w-full flex justify-between">
                <span>{chats.content}</span>
                <span className="flex justify-center items-center font-light w-6 h-6 rounded-full bg-red-500 text-white text-sm">
                  {chats.count}
                </span>
              </p>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default ChatList;

// 채팅방 목록에서 프론트로 줄 객체는[{img,nickName,content,createdAt,count},  ]

// 채팅방
// [{img,nickName,content,createdAt},  ]
