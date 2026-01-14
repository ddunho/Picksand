import { useEffect, useState } from "react";
import "../css/OrderPay.css";
import { useAxios } from "../api/axiosInterceptor";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useLocation} from "react-router-dom";



function OrderPay(){

    const api = useAxios();
    const location = useLocation();
    const { reqDatas } = location.state || {};

    console.log(reqDatas);

    const data = reqDatas?.[0];
    const inds = data?.inds || [];
    const recipe = data?.recipe || {};
    const [userInfo, setUserInfo] = useState({
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDeatil: ""
        });

    useEffect(() => {
        if (window.location.search) {
            alert("결제가 취소되었거나 실패했습니다.");
            window.history.replaceState({}, "", "/orderpay"); // 쿼리 제거
        }
        }, []);

    useEffect(() => {
        api.get("server-a/members/userinfo")
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

    

    const handlePay = async () => {
        // 🔹 주문 데이터 임시 저장
        sessionStorage.setItem(
            "orderData",
            JSON.stringify(reqDatas)
        );

        sessionStorage.setItem(
            "totalPrice",
            totalProductPrice
        );

        const tossPayments = await loadTossPayments("test_ck_...");

        tossPayments.requestPayment("카드", {
            amount: totalProductPrice,
            orderId: "order_" + new Date().getTime(),
            orderName: "커스텀 샌드위치 주문",
            customerName: userInfo.nickname || "고객",
            successUrl: "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/paySuccess",
            failUrl: "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/orderpay",
        });
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
                                    {/* 샌드위치 이름 */}
                                    <p>{recipe.name}</p>

                                    {/* 재료 목록 */}
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
                            readOnly></input>
                        </div>

                        
                        <div className="deliverinfo">
                            <p>휴대폰 번호</p>
                            <input
                            type="text"
                            value={userInfo.phoneNumber}
                            readOnly></input>
                        </div>

                        <div className="deliverinfo">
                            <p>배송 주소</p>
                            <input
                            type="text"
                            value={`${userInfo.address} ${userInfo.addressDetail}`}
                            readOnly></input>
                        </div>

                        <div className="deliverinfo">
                            <p>받으시는 분 성함</p>
                            <input placeholder="받으시는 분 성함을 입력해 주세요." className="changenameinput"></input>
                        </div>

                        <div className="deliverrequest">
                            <p>배송 요청 사항</p>
                            <textarea cols="30" rows="3" className="delivermessage" placeholder="배송 요청 사항을 적어주세요."></textarea>
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