import "../css/findpw.css";

function FindPw({openLogin}) {

  

  return (
    <main>
      <div className="findpwwrapper">
        <div className="findpw">
            <div className="findpwheader">
                <div onClick={()=>{openLogin()}}>아이디 찾기</div>
                <div>비밀번호 찾기</div>
            </div>
            <div className="findpwcontent">
              <form className="loginform">
                  <p>아이디</p>
                  <input type="text" placeholder="아이디를 입력해 주세요." />
                  <p>휴대폰 번호</p>
                  <input type="password" placeholder="비밀번호를 입력해 주세요." />
                  <div className="loginsignup">
                  </div>
                  <button type="submit">확인</button>
              </form>
            </div>
        </div>
      </div>
    </main>
  );
}

export default FindPw;

