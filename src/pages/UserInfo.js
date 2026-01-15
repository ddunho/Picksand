import "../css/UserInfo.css";
import { useAxios } from "../api/axiosInterceptor";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressSearchModal from "../components/AddressSearchModal";

function UserInfo() {
    const api = useAxios();
    const navigate = useNavigate();

    const [originUserInfo, setOriginUserInfo] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        nickname: "",
        phoneNumber: "",
        address: "",
        addressDetail: ""
    });

    const [orders, setOrders] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [modalState, setModalState] = useState(false);

    const [errors, setErrors] = useState({
        nickname: "",
        password: "",
        phoneNumber: ""
    });

    /* ⭐ 주문 상태 → CSS 클래스 매핑 */
    const orderStatusClassMap = {
        주문확인: "confirm",
        배달중: "shipping",
        배달완료: "complete"
    };

    /* 회원 정보 + 주문 내역 조회 */
    useEffect(() => {
        api.get("server-a/members/userinfo")
            .then(res => {
                setUserInfo({ ...res.data, password: "" });
                setOriginUserInfo(res.data);
            });

        api.get("server-a/orders/my-orders")
            .then(res => setOrders(res.data));
    }, [api]);

    const handleReviewWrite = (orderId) => {
        navigate("/ReviewWrite", {
            state: { orderId }
        });
    };

    return (
        <main>
            <div className="userinfomain">

                {/* 주문 내역 */}
                <div className="orderinfo">
                    <p>주문 기록</p>

                    <div className="orderlist">
                        {orders.length === 0 ? (
                            <p style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                                주문 내역이 없습니다.
                            </p>
                        ) : (
                            orders.map(order => (
                                <div key={order.orderId} className="ordercard">
                                    <div className="orderleft">
                                        <div className="ordernumber">
                                            <p>{order.orderNumber}</p>
                                            <p>{order.orderDate}</p>
                                        </div>

                                        <div className="orderstoreName">
                                            {order.storeName}
                                        </div>

                                        <div className="ordercomponent">
                                            {order.items.map((item, idx) => (
                                                <button key={idx}>
                                                    {item.sandwichName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="orderright">
                                        <p>{order.totalPrice.toLocaleString()}원</p>

                                        <div className="orderbuttongroup">
                                            <button
                                                className={`orderstatus-${orderStatusClassMap[order.orderStatus]}`}
                                            >
                                                {order.orderStatus}
                                            </button>

                                            {order.orderStatus === "배달완료" && (
                                                <button
                                                    className="orderreviewbtn"
                                                    onClick={() => handleReviewWrite(order.orderId)}
                                                >
                                                    리뷰작성
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {modalState && (
                    <AddressSearchModal
                        onClose={() => setModalState(false)}
                        onComplete={() => setModalState(false)}
                    />
                )}
            </div>
        </main>
    );
}

export default UserInfo;
