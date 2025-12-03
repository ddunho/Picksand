import { Link } from "react-router-dom";

function LoginForm({openLogin}) {

  

  return (
    <>
    <div className="login">
        <div className="loginheader">로그인
          <img src="./images/cancel.png" alt="X" onClick={()=>{openLogin()}}></img>
        </div>
        <div className="logincontent">
          <form className="loginform">
              <p>아이디</p>
              <input type="text" placeholder="아이디를 입력해 주세요." />
              <p>비밀번호</p>
              <input type="password" placeholder="비밀번호를 입력해 주세요." />
              <div className="findmyidpw" onClick={()=>{
                openLogin();
              }}>
                <Link to="/findid">
                아이디/비밀번호 찾기</Link>
              </div> 
              <div className="loginsignup">
              </div>
              <button type="submit">확인</button>
          </form>
          <div className="loginline"></div>
          <div className="notuser">
          <p>계정이 없으신가요?</p> 
          <p onClick={()=>{
            openLogin();
          }}>
            <Link to="/signup">회원가입</Link>
          </p>
        </div>
        </div>
    </div>
    </>
  );
}

export default LoginForm;

