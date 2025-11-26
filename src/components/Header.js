import styled from "styled-components";
import "../css/modal.css";
import LoginForm from "../pages/LoginForm.js";
import { useState } from "react";
import SignupForm from "../pages/SignupForm.js";

const HeaderWrapper = styled.div`
    display : flex;
    justify-content : center;
    width : 100%;
    height : 104px;
    display : flex;
    justify-content : center;
    background-color : #FFFEFB;
    position : relative;

    & > div{
        display : flex;
        justify-content : space-between;
        align-items : center;
        width : calc(100vw - 100px);
        height : 104px;
    }

    & > div > div:first-child{
        display : flex;
        gap : 4px;
        & > img{
            width : 60px;
            height : 60px;
        }

        & > div{
            margin-top : 6px;

            & > p:first-child{
                font-size : 24px;
                color : #7C290C;
                margin-bottom : 4px;
            }

            & > p:last-child{
                font-size : 18px;
                color : #F54A00;
            }
        }
}
    & > div > div > button{
        border-radius:8px;
        border : none;
        padding:0; 
        overflow:visible; 
        cursor:pointer;
        width : 60px;
        height : 40px;
        background-color : #FF8904;
        opacity : 0.9;
        & > p{
            color : #7C290C;
        }
    }
`

function Header(){

    const [isSignup, setIsSignup] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const handleIsLogin = () => {setIsLogin(true)}
    const handleIsSignup = () => {setIsSignup(true)}
    const handleOverlay = () => {
        setIsLogin(false);
        setIsSignup(false)
    }
    

    return(
        <header>
            <HeaderWrapper>
                <div>
                    <div>
                        <img src="/images/sandwichlogo.png" alt="로고"></img>
                        <div>
                            <p>픽샌</p>
                            <p>원하는 재료로 직접 만들어 보세요</p>
                        </div>
                    </div>
                    <div className="logincontainer">
                    <button onClick={handleIsLogin}>
                        <p>로그인</p>
                    </button>
                    <button onClick={handleIsSignup}>
                        <p>회원가입</p>
                    </button>
                    </div>
                </div>
            </HeaderWrapper>
<<<<<<< HEAD
            {isLogin &&
                <div className="loginmodal">
                    <LoginForm></LoginForm>
                </div>
            }
            {isSignup &&
                <div className="loginmodal">
                    <SignupForm></SignupForm>
                </div>
            }
            {(isLogin || isSignup) &&
            <div className="overlay" onClick={handleOverlay}></div>
            }
=======

>>>>>>> 1f8e5180a7b68e66ede93b052526c3448e6a1664
        </header>
    );
}

export default Header;