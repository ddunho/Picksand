import "../css/UserInfo.css";
import { useAxios } from "../api/axiosInterceptor";
import { useEffect, useState } from "react";
import AddressSearchModal from "../components/AddressSearchModal";

function UserInfo(){
    const [originUserInfo, setOriginUserInfo] = useState(null);
    const [show, setShow] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [orders, setOrders] = useState([]);  // ⭐ 주문 내역 상태 추가

    const [errors, setErrors] = useState({
        nickname: "",
        password: "",
        phoneNumber: ""
    });

    const api = useAxios();

    const onCompletePost = (data) => {
        setModalState(false);
        setUserInfo(prev => ({
            ...prev,
            address: data.address
        }));
    };

    const validateField = (name, value) => {
        let message = "";

        if (value === undefined || value === null) {
            value = "";
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

        if (name === "password") {
            if (!value.trim()) {
                message = "비밀번호를 입력해주세요.";
            } else if (value.length < 8 || value.length > 20) {
                message = "비밀번호는 8~20자여야 합니다.";
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                message = "영문 또는 숫자만 사용할 수 있습니다.";
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

        return message;
    };

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });
    const [editMode, setEditMode] = useState(false);

    // ⭐ 회원 정보와 주문 내역 동시 로딩
    useEffect(() => {
        // 회원 정보 로딩
        api.get("server-a/members/userinfo")
            .then((res) => {
                setUserInfo({
                    ...res.data,
                    password: ""
                });
                setOriginUserInfo(res.data); 
            })
            .catch((err) => {
                console.error("유저정보 불러오기 오류:", err);
            });

        // ⭐ 주문 내역 로딩
        api.get("server-a/orders/my-orders")
            .then((res) => {
                console.log("주문 내역:", res.data);
                setOrders(res.data);
            })
            .catch((err) => {
                console.error("주문 내역 불러오기 오류:", err);
            });
    }, [api]);

    const isChanged = () => {
        if (!originUserInfo) return false;

        return (
            userInfo.nickname !== originUserInfo.nickname ||
            userInfo.phoneNumber !== originUserInfo.phoneNumber ||
            userInfo.address !== originUserInfo.address ||
            userInfo.addressDetail !== originUserInfo.addressDetail ||
            userInfo.password.trim() !== ""
        );
    };

    const isPhoneChanged = () => {
        if (!originUserInfo) return false;
        return userInfo.phoneNumber !== originUserInfo.phoneNumber;
    };

    const handleUpdate = async () => {
        if (!isChanged()) {
            setEditMode(false);
            return;
        }

        if (isPhoneChanged()) {
            try {
                await api.get(
                    `server-a/members/check-phone?phoneNumber=${encodeURIComponent(userInfo.phoneNumber)}`
                );
            } catch (err) {
                if (err.response?.status === 409) {
                    alert("이미 사용 중인 휴대폰 번호입니다.");
                } else {
                    alert("휴대폰 번호 확인 중 오류가 발생했습니다.");
                }
                return;
            }
        }

        const nicknameError = validateField("nickname", userInfo.nickname);
        const phoneError = validateField("phoneNumber", userInfo.phoneNumber);
        const passwordError = userInfo.password.trim()
            ? validateField("password", userInfo.password)
            : "";

        if (nicknameError || phoneError || passwordError) {
            setErrors({
                nickname: nicknameError,
                password: passwordError,
                phoneNumber: phoneError
            });
            alert("입력값을 확인해주세요.");
            return;
        }

        api.patch("server-a/members/me", {
            nickname: userInfo.nickname,
            password: userInfo.password || null,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            addressDetail: userInfo.addressDetail
        })
        .then(() => {
            alert("정보가 수정되었습니다.");
            setEditMode(false);
        })
        .catch((err) => {
            console.error("정보수정 오류:", err);
            alert("정보 수정 중 오류가 발생했습니다.");
        });
    };

    const handleDelete = () => {
        if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) return;

        api.delete("server-a/members/me")
            .then(() => {
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/";
            })
            .catch((err) => {
                console.error("회원탈퇴 오류:", err);
                alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
            });
    };

    return(
        <main>
            <div className="userinfomain">
                <div className="userinfotitle">
                    <p>회원 정보</p>
                    <div>
                        <p>나의 정보와 주문 기록을 볼 수 있습니다.</p>
                        <button
                            className={editMode ? "edit-confirm-btn" : "edit-btn"}
                            onClick={() => {
                                if (!editMode) {
                                    setEditMode(true);
                                } else {
                                    handleUpdate();
                                }   
                            }}
                        >
                            {!editMode && <img src="/images/edit.png" alt="수정" />}
                            {editMode ? "확인" : "정보 수정"}
                        </button>
                    </div>
                </div>

                <div className="myinfo">
                    <div>
                        <p>내 정보</p>
                    </div>
                    <div className="myinfodetail">
                        <div>
                            <div className="infocomponent">
                                <img src="/images/identity.png" alt="이름"></img>
                                <p>아이디</p>
                            </div>
                            <input value={userInfo.username} readOnly className={editMode ? "edit-username-input" : ""}></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/identity.png" alt="이름"></img>
                                <p>닉네임</p>
                            </div>
                            <input value={userInfo.nickname} readOnly={!editMode} 
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUserInfo(prev => ({
                                        ...prev,
                                        nickname: value
                                    }));
                                    const errorMessage = validateField("nickname", value);
                                    setErrors(prev => ({
                                        ...prev,
                                        nickname: errorMessage
                                    }));
                                }}/>
                                {errors.nickname && (
                                    <p className="error-text">{errors.nickname}</p>
                                )}
                        </div>
        
                        <div>
                            <div className="infocomponent">
                                <img src="/images/lock.png" alt="이름"></img>
                                <p>비밀번호</p>
                            </div>
                            <div className="userinfoeye">
                                <input 
                                    type={show ? "text" : "password"}
                                    placeholder="정보 수정 시 비밀번호를 다시 설정할 수 있습니다." 
                                    value={userInfo.password} 
                                    readOnly={!editMode} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setUserInfo(prev => ({
                                            ...prev,
                                            password: value
                                        }));
                                        const errorMessage = validateField("password", value);
                                        setErrors(prev => ({
                                            ...prev,
                                            password: errorMessage
                                        }));
                                    }}/>
                                <img src="/images/Eye.png" alt="눈" onClick={()=> setShow(!show)}></img>
                            </div>
                            {errors.password && (
                                <p className="error-text">{errors.password}</p>
                            )}
                        </div>
                    
                        <div>
                            <div className="infocomponent">
                                <img src="/images/call.png" alt="이름"></img>
                                <p>휴대폰</p>
                            </div>
                            <input value={userInfo.phoneNumber} readOnly={!editMode}
                               onChange={(e) => {
                                const value = e.target.value;
                                setUserInfo(prev => ({
                                    ...prev,
                                    phoneNumber: value
                                }));
                                const errorMessage = validateField("phoneNumber", value);
                                setErrors(prev => ({
                                    ...prev,
                                    phoneNumber: errorMessage
                                }));
                            }}/>
                            {errors.phoneNumber && (
                                <p className="error-text">{errors.phoneNumber}</p>
                            )}
                        </div>
                        <div>
                            {editMode ? (
                            <div className="dorodetailcontainer">
                                <div>
                                    <div className="infocomponent">
                                        <img src="/images/place.png" alt="이름"></img>
                                        <div>
                                            <p>도로명 주소</p>
                                            <button
                                                type="button"
                                                className="addressfindbutton"
                                                onClick={() => setModalState(true)}
                                            >
                                            찾기
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        value={userInfo.address}
                                        onChange={(e) =>
                                            setUserInfo(prev => ({
                                                ...prev,
                                                address: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                                
                                <div>
                                    <div className="infocomponent">
                                        <img src="/images/place.png" alt="이름"></img>
                                        <p>상세 주소</p>
                                    </div>
                                    <input
                                        value={userInfo.addressDetail}
                                        onChange={(e) =>
                                            setUserInfo(prev => ({
                                                ...prev,
                                                addressDetail: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                            <div className="infocomponent">
                                <img src="/images/place.png" alt="이름"></img>
                                <p>주소</p>
                            </div>
                            <input
                                value={`${userInfo.address} ${userInfo.addressDetail}`}
                                readOnly
                            />
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {modalState && (
                    <AddressSearchModal
                        onClose={() => setModalState(false)}
                        onComplete={onCompletePost}
                    />
                )}

                <div className="deleteaccount">
                    <p onClick={handleDelete}>회원탈퇴</p>
                </div>

                {/* ⭐ 주문 내역 동적 렌더링 */}
                <div className="orderinfo">
                    <p>주문 기록</p>
                    <div className="orderlist">
                        {orders.length === 0 ? (
                            <p style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                                주문 내역이 없습니다.
                            </p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.orderId}>
                                    <div>
                                        <div className="ordernumber">
                                            <p>{order.orderNumber}</p>
                                            <p>{order.orderDate}</p>
                                        </div>
                                        <div className="ordercomponent">
                                            {order.items.map((item, idx) => (
                                                <button key={idx}>{item.sandwichName}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={order.orderStatus === 'SHIPPING' ? 'deliverstatusing' : 'deliverstatus'}>
                                        <p>{order.totalPrice.toLocaleString()}원</p>
                                        <button>{order.orderStatusText}</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default UserInfo;