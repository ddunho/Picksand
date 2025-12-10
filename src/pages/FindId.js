import { useState } from "react";
import "../css/findid.css";
import axios from "axios";
import FindPw from "./FindPw";

function FindId() {

  const [findId, setFindId] = useState(true);
  const [findPw, setFindPw] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleFindId = () => {
    setFindId(true);
    setFindPw(false);
  };

  const handleFindPw = () => {
    setFindPw(true);
    setFindId(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8080/members/find-id", {
      phoneNumber: phoneNumber
    })
    .then(() => {
      alert("입력하신 번호로 아이디를 전송했습니다.");
    })
    .catch(() => {
      alert("일치하는 회원 정보가 없습니다.");
    });
  };

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
              <form className="loginform" onSubmit={handleSubmit}>
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
      }

      {findPw && <FindPw openLogin={handleFindId} />}
    </main>
  );
}

export default FindId;
