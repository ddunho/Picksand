function SignupForm({openSignup}) {
  return (
    <>
    <div className="signup">
        <div className="signupheader">회원가입
          <img src="/images/cancel.png" alt="X" onClick={()=>{openSignup()}}></img>
        </div>
        <div className="signupcontent">
          <form className="signupform">
              <div>
                <p>아이디</p>
                <button onClick={e => e.preventDefault()}>중복 확인</button>
              </div>
              <input type="text" placeholder="아이디를 입력해 주세요." />
              <p>비밀번호</p>
              <input type="password" placeholder="비밀번호를 입력해 주세요." />
              <p>비밀번호 확인</p>
              <input type="password" placeholder="비밀번호를 한번 더 입력해 주세요." />
              <p>닉네임</p>
              <input type="text" placeholder="닉네임을 입력해 주세요." />
              <p>휴대폰 번호</p>
              <input type="text" placeholder="휴대폰 번호를 입력해 주세요." />
              <div>
                <p>주소</p>
                <button onClick={e => e.preventDefault()}>주소 찾기</button>
              </div>
              <input type="text" placeholder="주소를 입력해 주세요." />
              <button type="submit">확인</button>
          </form>
        </div>
    </div>
    </>
  );
}

export default SignupForm;

