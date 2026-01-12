import { useContext, useState } from "react";
import { Link} from "react-router-dom";
import { useAxios } from "../api/axiosInterceptor";
import { AuthContext } from "../context/AuthProvider";

function LoginForm({openLogin}) {

  const api = useAxios();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    password: ""
  })


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("server-a/members/login", {
            username: form.username,
            password: form.password,
            });

            login(response.data.accessToken, response.data.refreshToken);

            console.log(response.data);
            alert("로그인 성공!");
            window.location.href = "/";

        } catch (error) {
            console.error(error);
            alert("로그인 실패: 아이디와 비밀번호를 확인해 주세요.");
        }
        };


  

  return (
    <>
    <div className="login">
        <div className="loginheader">로그인
          <img src="./images/cancel.png" alt="X" onClick={()=>{openLogin()}}></img>
        </div>
        <div className="logincontent">
          <form className="loginform" onSubmit={handleSubmit}>
              <p>아이디</p>
              <input 
              name="username"
              type="text" 
              placeholder="아이디를 입력해 주세요."
              value={form.username}
              onChange={handleChange} />
              <p>비밀번호</p>
              <input
              name="password"
              type="password" 
              placeholder="비밀번호를 입력해 주세요."
              value={form.password}
              onChange={handleChange} />
              <div className="findmyidpw" onClick={()=>{
                openLogin();
              }}>
                <Link to="/findid">
                아이디/비밀번호 찾기</Link>
              </div> 
              <div className="loginsignup">
              </div>
              <button type="submit" >확인</button>
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

