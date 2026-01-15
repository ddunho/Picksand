import { useEffect, useState } from "react";
import "../css/OrderPay.css";
import { useAxios } from "../api/axiosInterceptor";
import { useLocation, useNavigate } from "react-router-dom";

function OrderPay(){

    const api = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const { reqDatas } = location.state || {};

    console.log(reqDatas);
    const [receiverName, setReceiverName] = useState("");
    const [deliveryMessage, setDeliveryMessage] = useState("");

    const data = reqDatas?.[0];
    const inds = data?.inds || [];
    const recipe = data?.recipe || {};
    const [userInfo, setUserInfo] = useState({
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });

    useEffect(() => {
        api.get("/server-a/members/userinfo")
            .then(res => {
                setUserInfo(res.data);
            })
            .catch(err => console.error(err));
    }, [api]);

    const [showAddress, setShowAddress] = useState(true);

    const innerWidth = window.innerWidth;

    useEffect(()=>{
        if(window.innerWidth > 426){
            setShowAddress(true);
        }else{
            setShowAddress(false);
        }
    },[innerWidth])

    const handleAddress = () => {
        setShowAddress(prev => !prev)
    }

    const totalProductPrice = (reqDatas ?? []).reduce(
        (sum, data) => sum + (data?.recipe?.totalPrice ?? 0),
        0
    );

    const handlePay = async () => {
        const receiverNameValue = receiverName || userInfo.nickname;
        const deliveryMessageValue = deliveryMessage || "";

        if (!receiverNameValue) {
            alert("받으시는 분 성함을 입력해주세요.");
            return;
        }

        // ⭐ 전화번호와 주소 유효성 검증 추가
        if (!userInfo.phoneNumber) {
            alert("회원 정보에 전화번호가 없습니다. 회원 정보를 수정해주세요.");
            return;
        }

        if (!userInfo.address) {
            alert("회원 정보에 주소가 없습니다. 회원 정보를 수정해주세요.");
            return;
        }

        // 결제 확인 알럿
        const confirmPayment = window.confirm(
            `총 ${totalProductPrice.toLocaleString()}원을 결제하시겠습니까?`
        );

        if (!confirmPayment) {
            return; // 취소 시 아무것도 안 함
        }

        try {
            // ⭐ storeUid 추출 (첫 번째 주문의 shopInfo에서)
            const storeUid = reqDatas[0]?.shopInfo?.storeUid;

            if (!storeUid) {
                alert("매장 정보를 찾을 수 없습니다.");
                return;
            }

            // 서버로 보낼 데이터 가공
            const orderItems = reqDatas.map(item => ({
                recipeId: item.recipe.id,
                recipeName: item.recipe.name,
                price: item.recipe.totalPrice,
                ingredients: item.inds.map(ind => ({
                    ingredientId: ind.id,
                    ingredientName: ind.name
                }))
            }));

            // ⭐ receiverPhone, deliveryAddress, storeUid 추가
            const orderData = {
                totalPrice: totalProductPrice,
                receiverName: receiverNameValue,
                receiverPhone: userInfo.phoneNumber,
                deliveryAddress: `${userInfo.address} ${userInfo.addressDetail}`,
                deliveryMessage: deliveryMessageValue,
                storeUid: storeUid,  // ⭐ 추가
                orderItems
            };

            console.log("📦 주문 데이터:", orderData);

            // 주문 생성 API 호출
            const result = await api.post("/server-a/orders", orderData);

            alert("결제가 완료되었습니다!");

            console.log(result);

            // PaySuccess 페이지로 이동 (주석 해제 가능)
            navigate("/paySuccess", {
                state: {
                    orderData: reqDatas,
                    totalPrice: totalProductPrice,
                    receiverName: receiverNameValue,
                    deliveryMessage: deliveryMessageValue
                }
            });

        } catch (err) {
            console.error("결제 실패:", err);
            alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return(
        <main>
            <div className="orderpaywrapper">
                <div>
                    <p>주문 및 결제</p>
                    <div onClick={handleAddress}>배송지 확인</div>
                </div>
                <div className="orderaddresscontainer">
                    <div className="orderwrapper">
                        <div className="ordertitle">
                            <div>
                                <img src="/images/shopping_bag.png" alt="상품"></img>
                                <p>주문상품</p>
                            </div>
                            <button>{reqDatas?.length || 0}개</button>
                        </div>
                        <div className="ordersandwichcontainer">
                            {reqDatas.map((data, index) => {
                                const { inds, recipe } = data;

                                return (
                                <div className="ordercontent" key={index}>
                                    <p>{recipe.name}</p>
                                    <p>
                                    {inds.map(ind => ind.name).join(", ")}
                                    </p>

                                    <div className="orderquantity">
                                    <div className="quantitycontainer">
                                        <p>1</p>
                                        <p className="quantityminus">-</p>
                                        <p className="quantityplus">+</p>
                                    </div>

                                    <div>
                                        <p>{recipe.totalPrice.toLocaleString()}원 x 1</p>
                                        <p>{recipe.totalPrice.toLocaleString()}원</p>
                                    </div>
                                    </div>

                                    <img
                                    src="/images/Trash.png"
                                    alt="삭제"
                                    className="ordertrash"
                                    />
                                </div>
                                );
                            })}
                        </div>
                        <div className="orderline"></div>

                        <div className="paycontainer">
                            <div className="productprice">
                                <p>상품 금액</p>
                                <p>{totalProductPrice.toLocaleString()}원</p>
                            </div>

                            <div className="deliverprice">
                                <p>배송비</p>
                                <p>무료</p>
                            </div>
                        </div>
                        <div className="orderline"></div>
                        <div className="totalprice">
                            <p>총 결제 금액</p>
                            <p>{totalProductPrice.toLocaleString()}원</p>
                        </div>

                        <button
                            className="finalorderbutton"
                            onClick={handlePay}
                        >
                            결제하기
                        </button>
                    </div>
                    {showAddress &&
                    <div className={`addresswrapper ${showAddress ? "open" : "close"}`}>
                        <div className="deliverinfo">
                            <div className="addresstitle">
                                <img src="/images/place.png" alt="위치"></img>
                                <p>배송지 정보</p>
                            </div>

                            <p>닉네임</p>
                            <input
                                type="text"
                                value={userInfo.nickname}
                                readOnly
                            />
                        </div>

                        <div className="deliverinfo">
                            <p>휴대폰 번호</p>
                            <input
                                type="text"
                                value={userInfo.phoneNumber}
                                readOnly
                            />
                        </div>

                        <div className="deliverinfo">
                            <p>배송 주소</p>
                            <input
                                type="text"
                                value={`${userInfo.address} ${userInfo.addressDetail}`}
                                readOnly
                            />
                        </div>

                        <div className="deliverinfo">
                            <p>받으시는 분 성함</p>
                            <input
                                placeholder="받으시는 분 성함을 입력해 주세요."
                                className="changenameinput"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                            />
                        </div>

                        <div className="deliverrequest">
                            <p>배송 요청 사항</p>
                            <textarea
                                cols="30"
                                rows="3"
                                className="delivermessage"
                                placeholder="배송 요청 사항을 적어주세요."
                                value={deliveryMessage}
                                onChange={(e) => setDeliveryMessage(e.target.value)}
                            />
                        </div>  

                        <button className="checkdeliverspot" onClick={handleAddress}>
                            배송지 정보를 확인하였습니다. 
                        </button>            
                    </div>
                    }
                </div>
            </div>
        </main>
    );
}

export default OrderPay;