import { useEffect, useState } from "react";
import "../css/PaySuccess.css";
import { useAxios } from "../api/axiosInterceptor";



function OrderPay(){

    const api = useAxios();

    const [orderDatas, setOrderDatas] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const savedOrder = sessionStorage.getItem("orderData");
        const savedTotal = sessionStorage.getItem("totalPrice");

        if (savedOrder) {
            setOrderDatas(JSON.parse(savedOrder));
        }

        if (savedTotal) {
            setTotalPrice(Number(savedTotal));
        }
    }, []);

    const [userInfo, setUserInfo] = useState({
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDeatil: ""
        });

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

    



    return(
        <main>
            <div className="orderpaywrapperp">
                <div>
                    <div onClick={handleAddress}>배송지 확인</div>
                </div>
                <div className="orderaddresscontainerp">
                    <div className="orderwrapperp">
                        <div className="ordertitlep">
                            <div>
                                <img src="/images/shopping_bag.png" alt="상품"></img>
                                <p>주문상품</p>
                            </div>
                            <button>3개</button>
                        </div>
                        <div className="ordersandwichcontainerp">
                            <div className="ordersandwichcontainerp">
                                {orderDatas.map((data, index) => {
                                    const { inds, recipe } = data;

                                    return (
                                    <div className="ordercontentp" key={index}>
                                        <p>{recipe.name}</p>
                                        <p>{inds.map(ind => ind.name).join(", ")}</p>

                                        <div>
                                        <p>{recipe.totalPrice.toLocaleString()}원</p>
                                        </div>
                                    </div>
                                    );
                                })}
                                </div>
                        </div>

                        <div className="orderlinep"></div>

                        <div className="paycontainerp">
                            <div className="productpricep">
                                <p>상품 금액</p>
                                <p>26,500원</p>
                            </div>

                            <div className="deliverpricep">
                                <p>배송비</p>
                                <p>무료</p>
                            </div>
                        </div>
                        <div className="orderlinep"></div>
                            <div className="totalpricep">
                                <p>총 결제 금액</p>
                                <p>26,500원</p>
                            </div>
                            <p className="payfinish">결제가 완료되었습니다.</p>

                       
                    </div>
                    
                </div>
            </div>
        </main>
    );
}

export default OrderPay;