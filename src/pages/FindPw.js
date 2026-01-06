import { useState } from "react";
import "../css/findpw.css";
import axios from "axios";

function FindPw({ openLogin }) {

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_URL}/server-a/members/find-pw`, {
      username: username,
      phoneNumber: phoneNumber
    })
    .then(() => {
      alert("입력하신 번호로 임시 비밀번호를 전송했습니다. 로그인 후 비밀번호 재설정 해주세요.");
    })
    .catch(() => {
      alert("일치하는 회원 정보가 없습니다.");
    });
  };

  return (
    <main>
      <div className="findpwwrapper">
        <div className="findpw">
          <div className="findpwheader">
            <div onClick={() => openLogin()}>아이디 찾기</div>
            <div>비밀번호 찾기</div>
          </div>

          <div className="findpwcontent">
            <form className="findidform" onSubmit={handleSubmit}>

              <p>아이디</p>
              <input
                type="text"
                placeholder="아이디를 입력해 주세요."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <p>휴대폰 번호</p>
              <input
                type="text"
                placeholder="휴대폰 번호를 입력해 주세요."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <button type="submit">확인</button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

export default FindPw;
