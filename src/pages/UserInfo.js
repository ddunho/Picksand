import "../css/UserInfo.css";
import { useAxios } from "../api/axiosInterceptor";
import { useEffect, useState } from "react";


function UserInfo(){

    const api = useAxios();

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        api.get("/members/userinfo")
            .then((res) => {
                setUserInfo(res.data);
            })
            .catch((err) => {
                console.error("유저정보 불러오기 오류:", err);
            });
    }, [api]);

    const handleUpdate = () => {
        api.patch("/members/me", {
            nickname: userInfo.nickname,
            password: userInfo.password,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            addressDetail: userInfo.addressDetail
        })
        .then(() => {
            alert("정보가 수정되었습니다.");
            setEditMode(false);     // 수정 완료 후 읽기 전용으로 복귀
        })
        .catch((err) => {
            console.error("정보수정 오류:", err);
            alert("정보 수정 중 오류가 발생했습니다.");
        });
    };

    const handleDelete = () => {
        if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) return;

        api.delete("/members/me")
            .then(() => {
            alert("회원 탈퇴가 완료되었습니다.");
            // localStorage 삭제
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // 홈으로 이동
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
                        <p>나의 정보를 확인하고 주문 기록을 한눈에 볼 수 있습니다.</p>
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
                                onChange={(e) =>
                                    setUserInfo((prev) => ({
                                        ...prev,
                                        nickname: e.target.value
                                    }))
                                }></input>
                        </div>
        
                        <div>
                            <div className="infocomponent">
                                <img src="/images/lock.png" alt="이름"></img>
                                <p>비밀번호</p>
                            </div>
                            <input placeholder="정보 수정 시 비밀번호를 다시 설정할 수 있습니다." value={userInfo.password} readOnly={!editMode} 
                                onChange={(e) =>
                                    setUserInfo((prev) => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }></input>
                        </div>
                    
                        <div>
                            <div className="infocomponent">
                                <img src="/images/call.png" alt="이름"></img>
                                <p>휴대폰</p>
                            </div>
                            <input value={userInfo.phoneNumber} readOnly={!editMode}
                                onChange={(e) =>
                                    setUserInfo((prev) => ({
                                        ...prev,
                                        phoneNumber: e.target.value
                                    }))
                                }></input>
                        </div>
                        <div>
                            
                            {editMode ? (
                            <div className="dorodetailcontainer">
                                <div>
                                    <div className="infocomponent">
                                        <img src="/images/place.png" alt="이름"></img>
                                        <p>도로명 주소</p>
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
                
                <div className="deleteaccount">
                    <p onClick={handleDelete}>회원탈퇴</p>
                </div>
                <div className="orderinfo">
                    <p>주문 기록</p>
                    <div className="orderlist">
                        <div>
                            <div>
                                <div className="ordernumber">
                                    <p>주문-004</p>
                                    <p>2025-11-25</p>
                                </div>
                                <div className="ordercomponent">
                                    <button>호밀빵</button>
                                    <button>양상추</button>
                                    <button>토마토</button>
                                    <button>치킨</button>
                                </div>
                            </div>
                            <div className="deliverstatusing">
                                <p>8,700원</p>
                                <button>배송중</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="ordernumber">
                                    <p>주문-003</p>
                                    <p>2025-11-25</p>
                                </div>
                                <div className="ordercomponent">
                                    <button>호밀빵</button>
                                    <button>양상추</button>
                                    <button>토마토</button>
                                    <button>치킨</button>
                                </div>
                            </div>
                            <div className="deliverstatus">
                                <p>8,700원</p>
                                <button>배송완료</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="ordernumber">
                                    <p>주문-002</p>
                                    <p>2025-11-25</p>
                                </div>
                                <div className="ordercomponent">
                                    <button>호밀빵</button>
                                    <button>양상추</button>
                                    <button>토마토</button>
                                    <button>치킨</button>
                                </div>
                            </div>
                            <div className="deliverstatus">
                                <p>8,700원</p>
                                <button>배송완료</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="ordernumber">
                                    <p>주문-001</p>
                                    <p>2025-11-25</p>
                                </div>
                                <div className="ordercomponent">
                                    <button>호밀빵</button>
                                    <button>양상추</button>
                                    <button>토마토</button>
                                    <button>치킨</button>
                                </div>
                            </div>
                            <div className="deliverstatus">
                                <p>8,700원</p>
                                <button>배송완료</button>
                            </div>
                        </div>
                    </div>
                 </div>



            </div>
        </main>
    );
}

export default UserInfo;