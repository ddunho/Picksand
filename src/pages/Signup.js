import { Link } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import { useState } from "react";
import "../css/SignupModal.css";


function Signup(){

    const [modalState, setModalState] = useState(false);
    const [inputAddressValue, setInputAddressValue] = useState('');
    
    const postCodeStyle = {
        width: '400px',
        height: '400px',
        display: modalState ? 'block' : 'none',
  };        

    const onCompletePost = (data) => {
        setModalState(false);
        setInputAddressValue(data.address);
    };

    const handleModalState = () => {
        setModalState(false)
    }

    


    return(
        <main>
            {modalState &&
            <div className="overlay" onClick={handleModalState}></div>
            }
            <div className="signupwrapper">
                <div className="signup">
                    <div className="signupheader">
                        <img src="/images/sandwichlogo.png" alt="로고"></img>
                        회원가입</div>
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
                            <button 
                                className="addressfindbutton"
                                onClick={(e) => { 
                                e.preventDefault(); 
                                setModalState(true); 
                            }}>주소 찾기</button>
                        </div>
                        <input 
                        type="text"
                        value={inputAddressValue}
                        placeholder="주소 찾기 시 자동으로 입력됩니다."
                        readOnly
                        />
                        <input 
                        placeholder="상세 주소를 입력해 주세요."
                        />
                        <button type="submit">확인</button>
                        <div>
                            <Link to="/">홈으로 이동하기→</Link>
                        </div>
                    </form>
                    {modalState && 
                    <div className="postcodeContainer">
                        <DaumPostcode style={postCodeStyle} onComplete={onCompletePost}></DaumPostcode>
                    </div>
                    }
                    
                    </div>
                </div>
            </div>
        </main>
  );
}
export default Signup;