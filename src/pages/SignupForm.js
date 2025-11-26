function SignupForm() {
  return (
    <>
    <div className="login">
        <div className="loginheader">회원가입</div>
        <div className="logincontent">
          <form className="loginform">
              <p>아이디</p>
              <input type="text" placeholder="아이디를 입력해 주세요." />
              <p>비밀번호</p>
              <input type="password" placeholder="비밀번호를 입력해 주세요." />
              <p>비밀번호 확인</p>
              <input type="password" placeholder="비밀번호를 한번 더 입력해 주세요." />
              <p>닉네임</p>
              <input type="text" placeholder="닉네임을 입력해 주세요." />
              <p>휴대폰 번호</p>
              <input type="text" placeholder="휴대폰 번호를 입력해 주세요." />
              <button type="submit">확인</button>
          </form>
        </div>
    </div>
    </>
  );
}

export default SignupForm;

