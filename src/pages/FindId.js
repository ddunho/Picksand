import { useState } from "react";
import "../css/findid.css";
import FindPw from "./FindPw";

function FindId() {

  const [findId, setFindId] = useState(true);
  const [findPw, setFindPw] = useState(false);

  const handleFindId = () => {
    setFindId(prev => !prev);
    setFindPw(false);
  }

  const handleFindPw = () => {
    setFindPw(prev => !prev);
    setFindId(false);
  }

 
  

  return (
    <main>
      {findId &&
      <div className="findidwrapper">
        <div className="findid">
            <div className="findidheader">
                <div>아이디 찾기</div>
                <div onClick={handleFindPw}>비밀번호 찾기</div>
            </div>
            <div className="findidcontent">
              <form className="loginform">
                  <p>닉네임</p>
                  <input type="text" placeholder="닉네임을 입력해 주세요." />
                  <p>휴대폰 번호</p>
                  <input type="password" placeholder="비밀번호를 입력해 주세요." />
                  <div className="loginsignup">
                  </div>
                  <button type="submit">확인</button>
              </form>
            </div>
        </div>
      </div>
      }
      {findPw && <FindPw openLogin = {handleFindId}></FindPw>}
    </main>
  );
}

export default FindId;

