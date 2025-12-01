import "../css/OrderPay.css";

function OrderPay(){
    return(
        <main>
            <div className="orderpaywrapper">
                <p>주문 및 결제</p>
                <div className="orderaddresscontainer">
                    <div className="orderwrapper">
                        <div className="ordertitle">
                            <div>
                                <img src="/images/shopping_bag.png" alt="상품"></img>
                                <p>주문상품</p>
                            </div>
                            <button>3개</button>
                        </div>
                        <div className="ordercontent">
                            <p>커스텀 샌드위치</p>
                            <p>베이컨,양상추,토마토,마요네즈</p>
                            <div className="orderquantity">
                                <div className="quantitycontainer">
                                    <p>1</p>
                                    <p className="quantityminus">-</p>
                                    <p className="quantityplus">+</p>
                                </div>
                                <div>
                                    <p>6,500원 x 2</p>
                                    <p>13,000원</p>
                                </div>
                            </div>
                            <img src="/images/Trash.png" alt="삭제" className="ordertrash"></img>
                        </div>
                        <div className="ordercontent">
                            <p>커스텀 샌드위치</p>
                            <p>베이컨,양상추,토마토,마요네즈</p>
                            <div className="orderquantity">
                                <div className="quantitycontainer">
                                    <p>1</p>
                                    <p className="quantityminus">-</p>
                                    <p className="quantityplus">+</p>
                                </div>
                                <div>
                                    <p>6,500원 x 2</p>
                                    <p>13,000원</p>
                                </div>
                            </div>
                            <img src="/images/Trash.png" alt="삭제" className="ordertrash"></img>

                        </div>
                        <div className="ordercontent">
                            <p>커스텀 샌드위치</p>
                            <p>베이컨,양상추,토마토,마요네즈</p>
                            <div className="orderquantity">
                                <div className="quantitycontainer">
                                    <p>1</p>
                                    <p className="quantityminus">-</p>
                                    <p className="quantityplus">+</p>
                                </div>
                                <div>
                                    <p>6,500원 x 2</p>
                                    <p>13,000원</p>
                                </div>
                            </div>
                            <img src="/images/Trash.png" alt="삭제" className="ordertrash"></img>
                        </div>

                        <div className="orderline"></div>

                        <div className="paycontainer">
                            <div className="productprice">
                                <p>상품 금액</p>
                                <p>26,500원</p>
                            </div>

                            <div className="deliverprice">
                                <p>배송비</p>
                                <p>무료</p>
                            </div>
                        </div>
                        <div className="orderline"></div>
                            <div className="totalprice">
                                <p>총 결제 금액</p>
                                <p>26,500원</p>
                            </div>
                    </div>
                    <div className="addresswrapper">
                        <div className="addresstitle">
                            <img src="/images/place.png" alt="위치"></img>
                            <p>배송지 정보</p>
                        </div>

                        <div className="deliverinfo">
                            <p>받는 분 이름</p>
                            <input placeholder="이름을 입력해 주세요."></input>
                        </div>

                        <div className="deliverinfo">
                            <p>연락처</p>
                            <input placeholder="010-1234-5678"></input>
                        </div>

                        <div className="deliverinfo">
                            <p>이메일</p>
                            <input placeholder="example@email.com"></input>
                        </div>

                        <div className="deliverinfo">
                            <p>배송 주소</p>
                            <input placeholder="서울시 강남구 테헤란로 123"></input>
                            <input placeholder="상세주소"></input>
                        </div>

                        <div className="deliverinfo">
                            <p>배송 메시지</p>
                            <textarea cols="30" rows="3" className="delivermessage"></textarea>
                        </div>

                        <button className="finalorderbutton">
                        주문하기
                        </button>

                        
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderPay;