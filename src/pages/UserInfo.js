import "../css/UserInfo.css";


function UserInfo(){
    return(
        <main>
            <div className="userinfomain">
                <div className="userinfotitle">
                    <p>회원 정보</p>
                    <div>
                        <p>나의 정보를 확인하고 주문 기록을 한눈에 볼 수 있습니다.</p>
                        <button><img src="/images/edit.png" alt="수정"></img>정보 수정</button>
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
                                <p>이름</p>
                            </div>
                            <input></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/identity.png" alt="이름"></img>
                                <p>아이디</p>
                            </div>
                            <input></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/identity.png" alt="이름"></img>
                                <p>닉네임</p>
                            </div>
                            <input></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/lock.png" alt="이름"></img>
                                <p>비밀번호</p>
                            </div>
                            <input></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/call.png" alt="이름"></img>
                                <p>휴대폰</p>
                            </div>
                            <input></input>
                        </div>
                        <div>
                            <div className="infocomponent">
                                <img src="/images/place.png" alt="이름"></img>
                                <p>주소</p>
                            </div>
                            <input></input>
                        </div>
                    </div>
                </div>

                <div className="orderinfo">
                    <p>주문 기록</p>
                    <div className="orderlist">
                        <div>
                            <div>
                                <div className="ordernumber">
                                    <p>ORDER-004</p>
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
                                    <p>ORDER-003</p>
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
                                    <p>ORDER-002</p>
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
                                    <p>ORDER-001</p>
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