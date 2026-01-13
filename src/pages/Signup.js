import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/SignupModal.css";
import { useAxios } from "../api/axiosInterceptor";
import AddressSearchModal from "../components/AddressSearchModal";

function Signup(){
    
    const api = useAxios();

    const [show, setShow] = useState(false);
    const [showcheck, setShowCheck] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [usernameCheckMessage, setUsernameCheckMessage] = useState("");

    const [errors, setErrors] = useState({
        username: "",
        password: "",
        passwordCheck: "",
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });

    const [form, setForm] = useState({
        username: "",
        password: "",
        passwordCheck: "",
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });

    const [modalState, setModalState] = useState(false);
    
         

    const onCompletePost = (data) => {
        setModalState(false);
        setForm((prev) => ({
            ...prev,
            address: data.address
        }));
        // 주소 입력 시 에러 제거
        setErrors((prev) => ({
            ...prev,
            address: ""
        }));
    };

    const handleModalState = () => {
        setModalState(false);
    };

    // name과 value를 직접 받도록 수정
    const handleError = (name, value) => {
        let message = "";

        // 유효성 검사
        if (name === "username") {
            if (!value.trim()) {
                message = "아이디를 입력해주세요.";
            } else if (value.length < 6 || value.length > 12) {
                message = "아이디는 6~12자여야 합니다.";
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                message = "영문 또는 숫자만 사용할 수 있습니다.";
            }
        }

        if (name === "password") {
            if (!value.trim()) {
                message = "비밀번호를 입력해주세요.";  
            } else if (value.length < 8 || value.length > 20) {
                message = "비밀번호는 8~20자여야 합니다.";
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                message = "영문 또는 숫자만 사용할 수 있습니다.";
            }
        }

        if (name === "passwordCheck") {
            if (!value.trim()) {
                message = "비밀번호 확인을 입력해주세요.";
            } else if (value !== form.password) {
                message = "비밀번호가 일치하지 않습니다.";
            }
        }

        if (name === "nickname") {
            if (!value.trim()) {
                message = "닉네임을 입력해주세요.";
            } else if (value.length < 2 || value.length > 8) {
                message = "닉네임은 2~8자여야 합니다.";
            } else if (!/^[A-Za-z가-힣]+$/.test(value)) {
                message = "닉네임은 영문 또는 한글만 사용할 수 있습니다.";
            }
        }

        if (name === "phoneNumber") {
            const onlyNumber = value.replace(/-/g, "");
            if (!onlyNumber) {
                message = "휴대폰 번호를 입력해주세요.";
            } else if (!/^010\d{8}$/.test(onlyNumber)) {
                message = "휴대폰 번호는 010으로 시작하는 숫자 11자리입니다.";
            }
            
           
        }

        if (name === "address") {
            if (!value.trim()) {
                message = "주소를 입력해주세요.";
            } else if (value.length > 100) {
                message = "주소는 최대 100글자까지 가능합니다.";
            }
        }

        if (name === "addressDetail") {
            if (!value.trim()) {
                message = "상세 주소를 입력해주세요.";
            } else if (value.length > 100) {
                message = "상세 주소는 최대 100글자까지 가능합니다.";
            }
        }

        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        
        // 입력값 변경
        setForm(prev => ({
            ...prev,
            [name]: newValue,
        }));

        // 입력값 변경 후 에러 체크
        handleError(name, newValue);

        if (name === "username") {
            setUsernameChecked(false);
            setUsernameCheckMessage("");
        }

    };

    const handleHasErrors = () => {
        // 모든 필드가 입력되었는지 확인
        const emptyFields = Object.entries(form).filter(([key, value]) => !value.trim());
        if (emptyFields.length > 0) {
            alert("모든 정보를 입력해주세요.");
            return true;
        }

        // 에러가 하나라도 있으면 제출 막기 
        const hasError = Object.values(errors).some((v) => v !== "");
        if (hasError) {
            alert("입력을 다시 확인해주세요.");
            return true;
        }

        if (!usernameChecked) {
            alert("아이디 중복확인을 해주세요.");
            return true;
        }

        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 재확인
        if (form.password !== form.passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await api.post("server-a/members/signup", {
                username: form.username,
                password: form.password,
                nickname: form.nickname,
                phoneNumber: form.phoneNumber,
                address: form.address,
                addressDetail: form.addressDetail
            });

            console.log(response.data);
            alert("회원가입 성공!");
            window.location.href = "/";

        } catch (error) {
            console.error(error);
            alert("회원가입 실패: " + (error.response?.data || "알 수 없는 에러"));
        }
    };

    const handleCheckUsername = async (e) => {
        e.preventDefault();

        if (!form.username.trim()) {
            setUsernameCheckMessage("아이디를 입력해주세요.");
            setErrors(prev => ({ ...prev, username: "아이디를 입력해주세요." }));
            return;
        }

        try {
            const res = await api.get(`server-a/members/check-username?username=${form.username}`);

            // 사용 가능
            setUsernameChecked(true);
            setUsernameCheckMessage("사용 가능한 아이디입니다.");
            setErrors(prev => ({ ...prev, username: "" }));
            console.log(res);

        } catch (err) {

            setUsernameChecked(false);
            setUsernameCheckMessage(err.response?.data || "중복확인 실패");
            setErrors(prev => ({
            ...prev,
            username: err.response?.data || "이미 사용 중인 아이디입니다."
            }));
        }
    };


    return(
        <main>
            {modalState &&
            <div className="overlay" onClick={handleModalState}></div>
            }
            <div className="signupwrapper">
                <div className="signup">
                    <div className="signupheader">
                        <img src="/images/sandwichlogo.png" alt="로고"></img>
                        회원가입
                    </div>
                    <div className="signupcontent">
                        <form className="signupform" onSubmit={(e) => {
                            e.preventDefault();
                            if(handleHasErrors()) return;
                            handleSubmit(e);
                        }}>
                            <div>
                                <p>아이디</p>
                            </div>
                            <div className="inputwrapper">
                                <div>
                                    <input 
                                        name="username"
                                        type="text"
                                        placeholder="아이디를 입력해 주세요."
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                    <button onClick={handleCheckUsername} className="inputbutton">중복 확인</button>
                                </div>
                            </div>
                            
                        
                            {usernameCheckMessage && usernameChecked && (
                                <div style={{ color: "green", fontSize: "10px", marginLeft: "4px", marginTop: "2px"}}>
                                    {usernameCheckMessage}
                                </div>
                            )}
                        
                            <div className="er">
                            {errors.username && !usernameChecked && (
                                <div style={{ color: "red", fontSize: "10px", marginTop: "2px", marginLeft: "4px" }}>
                                    {errors.username}
                                </div>
                            )}
                            </div>
                            <p className="passwordeyepw">비밀번호</p>
                            <div className="passwordeye">
                                <input 
                                    name="password"
                                    type={show ? "text" : "password"}
                                    placeholder="비밀번호를 입력해 주세요."
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <img src="/images/Eye.png" alt="눈" onClick={()=> setShow(!show)}></img>
                            </div>
                            {errors.password && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px"}}>
                                    {errors.password}
                                </div>
                            )}
                            <p>비밀번호 확인</p>
                            <div className="passwordeye">
                                <input 
                                    name="passwordCheck"
                                    type={showcheck ? "text" : "password"}
                                    placeholder="비밀번호를 한번 더 입력해 주세요."
                                    value={form.passwordCheck}
                                    onChange={handleChange}
                                />
                                <img src="/images/Eye.png" alt="눈" onClick={()=> setShowCheck(!showcheck)}></img>
                            </div>
                            {errors.passwordCheck && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px" }}>
                                    {errors.passwordCheck}
                                </div>
                            )}
                            <p>닉네임</p>
                            <input 
                                name="nickname"
                                type="text"
                                placeholder="닉네임을 입력해 주세요."
                                value={form.nickname}
                                onChange={handleChange}
                            />
                            {errors.nickname && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px" }}>
                                    {errors.nickname}
                                </div>
                            )}
                            <p>휴대폰 번호</p>
                            <input
                                name="phoneNumber"
                                type="text"
                                placeholder="휴대폰 번호를 입력해 주세요."
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                            {errors.phoneNumber && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px" }}>
                                    {errors.phoneNumber}
                                </div>
                            )}
                            <div>
                                <p>주소</p>
                                <button 
                                    className="addressfindbutton"
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        setModalState(true); 
                                    }}>
                                    주소 찾기
                                </button>
                            </div>
                            <input
                                style={{marginBottom: "4px"}}
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="주소찾기로 검색 후 자동 입력됩니다"
                                readOnly
                            />
                            {errors.address && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px" }}>
                                    {errors.address}
                                </div>
                            )}
                            <input 
                                name="addressDetail"
                                placeholder="상세 주소를 입력해 주세요."
                                value={form.addressDetail}
                                onChange={handleChange}
                            />
                            {errors.addressDetail && (
                                <div style={{ color: "red", fontSize: "10px", marginLeft: "4px", marginTop: "2px" }}>
                                    {errors.addressDetail}
                                </div>
                            )}
                            <button type="submit">확인</button>
                            <div>
                                <Link to="/">홈으로 이동하기→</Link>
                            </div>
                        </form>
                        {modalState && (
                            <AddressSearchModal
                                onClose={() => setModalState(false)}
                                onComplete={onCompletePost}
                            />
                        )}


                    </div>
                </div>
            </div>
        </main>
    );
}

export default Signup;