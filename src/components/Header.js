import styled from "styled-components";
import "../css/LoginModal.css";
import LoginForm from "../pages/LoginForm.js";
import "../css/SignupModal.css";
import { useContext, useState } from "react";
import SignupForm from "../pages/SignupForm.js";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider.js";
import { useAxios } from "../api/axiosInterceptor.js";


const HeaderWrapper = styled.div`
    display : flex;
    justify-content : center;
    width : 100%;
    height : 104px;
    display : flex;
    justify-content : center;
    background-color : #FFFEFB;
    position : relative;

    @media(max-width : 426px){
        padding : 0px 8px;
        box-sizing : border-box;
        height : 60px;
    }

    & > div{
        display : flex;
        justify-content : space-between;
        align-items : center;
        width : calc(100vw - 100px);
        height : 104px;

        @media (max-width : 426px){
            width : 100%;
            height : 60px;
        }
    }

    & > div > a{
        display : flex;
        gap : 4px;
        cursor : pointer;
        text-decoration : none;

        & > img{
            width : 60px;
            height : 60px;

            @media (max-width : 426px){
                width : 24px;
                height : 24px;
            }
        }

        & > div{
            margin-top : 6px;

            & > p:first-child{
                font-size : 24px;
                color : #7C290C;
                margin-bottom : 4px;

                @media (max-width : 426px){
                    font-size : 16px;
                }
            }

            & > p:last-child{
                font-size : 18px;
                color : #F54A00;

                @media (max-width : 426px){
                    font-size : 12px;
                    margin-left : -26px;
                }

            }
        }
}
    & > div > div > a > button{
        border-radius:8px;
        border : none;
        padding:0; 
        overflow:visible; 
        cursor:pointer;
        width : 90px;
        height : 36px;
        background : linear-gradient(90deg, #FF6B00 0%, #FE9800 100%);
        opacity : 0.9;

        @media (max-width : 426px){
            width : 50px;
            height : 30px;
            font-size : 12px;
        }

        & > p{
            color : white;
        }
    }

    & > div > div > button{
        border-radius:8px;
        border : none;
        padding:0; 
        overflow:visible; 
        cursor:pointer;
        width : 90px;
        height : 36px;
        background : linear-gradient(90deg, #FF6B00 0%, #FE9800 100%);
        opacity : 0.9;

        @media (max-width : 426px){
            width : 50px;
            height : 30px;
            font-size : 12px;
        }


        & > p{
            color : white;
        }
    }


    & > div > div > a{
        
    }
`

function Header(){
    const api = useAxios();

    const { accessToken, logout } = useContext(AuthContext);

    
    const location = useLocation();
    const [isSignup, setIsSignup] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const handleIsLogin = () => {setIsLogin(prev => !prev); setIsSignup(false)}
    const handleIsSignup = () => {setIsLogin(false); setIsSignup(prev => !prev)}
    const handleOverlay = () => {
        setIsLogin(false);
        setIsSignup(false)
    }

    const handleLogout = async () => {
        const response = await api.post("members/logout", {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        console.log(response.data);
        alert("로그아웃 성공!");
        logout();
        window.location.href = "/";
    
};
    
    if (location.pathname === "/signup") {
    return null;
  }
  if (location.pathname === "/OrderList") {
    return null;
  }
  if (location.pathname === "/ItemManage") {
    return null;
  }
  if (location.pathname === "/Review") {
    return null;
  }

    return(
        <header>
            <HeaderWrapper>
                <div>
                    <Link to="/" className="headermainlogo">
                        <img src="/images/sandwichlogo.png" alt="로고"></img>
                        <div>
                            <p>픽샌</p>
                            <p>원하는 재료로 직접 만들어 보세요</p>
                        </div>
                    </Link>
                    <div className="logincontainer">
                        {accessToken ? (
                            <div>
                                <div onClick={() => window.location.href = "/mypage"}>내 정보</div>
                                <div onClick={handleLogout}>로그아웃</div>
                            </div>
                            ) : (
                            <>
                                <button onClick={handleIsLogin} className="signupbutton">로그인</button>
                                <button onClick={() => window.location.href = "/signup"} className="signupbutton">회원가입</button>
                            </>
                            )}
                    </div>
                </div>
            </HeaderWrapper>
            {isLogin &&
                <div className="loginmodal">
                    <LoginForm
                        openLogin = {handleIsLogin}
                        openSignup = {handleIsSignup}
                    ></LoginForm>
                </div>
            }
            {isSignup &&
                <div className="signupmodal">
                    <SignupForm
                    openSignup={handleIsSignup}></SignupForm>
                </div>
            }
            {(isLogin || isSignup) &&
            <div className="overlay" onClick={handleOverlay}></div>
            }
        </header>
    );
}

export default Header;