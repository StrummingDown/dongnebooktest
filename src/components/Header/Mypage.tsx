import { useRecoilValue } from "recoil";
import { userState } from "../../state";

const Mypage = () => {
  const user = useRecoilValue(userState);
  console.log(user);
  return (
    <div className="flex">
      <div>
        <img
          src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2885&q=80"
          alt="people"
        />
      </div>
      <div></div>
    </div>
  );
};

export default Mypage;
