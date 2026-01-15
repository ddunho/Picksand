import axios from 'axios';
import '../css/OrderList.css'
import { GoChecklist } from "react-icons/go";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import { LuSandwich } from "react-icons/lu";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
function OrderList() {
    const navigate = useNavigate();
    const message = [
        "OPEN",
        "CLOSE"
    ];
    const alertmessage = [
        "개점처리되었습니다.",
        "마감처리되었습니다.",
    ];
    const [storeInfoList, setStoreInfoList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 7;
    const [order, setOrder] = useState([]);
    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    const sortedOrder = [...order].sort(
        (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
    );
    const currentOrders = sortedOrder.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedOrder.length / reviewsPerPage);

    
    

    const storeUid = 1; //지점uid

    const targetStore = storeInfoList.find(store => store.storeUid === storeUid);

    const [index, setindex] = useState(0);

    const apiRef = useRef(null);

    if (!apiRef.current) {
        apiRef.current = axios.create({
            baseURL: "http://k8s-picksand-appingre-5fb1cc8acd-1353364338.ap-northeast-2.elb.amazonaws.com/",
            withCredentials: true,
        });
    }

    const api = apiRef.current;
    const isAlertShownRef = useRef(false);

useEffect(() => {
    // ✅ Request Interceptor 추가 (Authorization 헤더 추가용)
    const requestInterceptor = api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");

        if (token && !config.url?.includes('server-a/members/reissue')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // ✅ Response Interceptor (401 에러 처리용)
    const responseInterceptor = api.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url.includes("server-a/members/reissue")
            ) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    
                    if (!refreshToken) {
                        throw new Error("리프레시 토큰이 없습니다.");
                    }

                    console.log("토큰 재발급 시도...");
                    const res = await api.post("server-a/members/reissue", {
                        refreshToken
                    });

                    if (!res.data?.accessToken || !res.data?.refreshToken) {
                        throw new Error("토큰 재발급 실패: 유효하지 않은 응답");
                    }

                    console.log("토큰 재발급 성공");
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);

                    originalRequest.headers.Authorization =
                        `Bearer ${res.data.accessToken}`;
                    isAlertShownRef.current = false;
                    return api(originalRequest);
                    
                } catch (e) {
                    console.error("토큰 재발급 실패:", {
                        message: e.message,
                        response: e.response?.data,
                        status: e.response?.status,
                        refreshToken: localStorage.getItem("refreshToken") ? "존재" : "없음"
                    });

                    if (!isAlertShownRef.current) {
                        isAlertShownRef.current = true;
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    }

                    localStorage.clear();
                    window.location.href = "/mainpage";
                    return Promise.reject(e);
                }
            }

            return Promise.reject(error);
        }
    );

    // ✅ Cleanup: 컴포넌트 언마운트 시 interceptor 제거
    return () => {
        api.interceptors.request.eject(requestInterceptor);
        api.interceptors.response.eject(responseInterceptor);
    };
}, []);




    const change = async () => {
        const newIndex = (!targetStore.storeState + 1) % message.length;
        const newState = !targetStore.storeState;
        setindex(newIndex);
        setStoreInfoList(prev =>
            prev.map(store =>
                store.storeUid === storeUid
                    ? { ...store, storeState: newState }
                    : store
            )
        );


        alert(alertmessage[newIndex]);

        try {
            await api.post("server-c/store/storeManage", {
                storeUid: storeUid,
                storeState: newState
            });
        } catch (e) {
            console.error("백엔드 전송 오류:", e);
        }


    };

    useEffect(() => {
        const storeList = async () => {
            const sto = await api.get("server-c/store/getStore")
            setStoreInfoList(sto.data)
        }

        const orderList = async () => {
            const ord = await api.get("server-c/order/getOrder")
            setOrder(ord.data)
        }
        storeList();
        orderList();
    }, [])

    const handleStatusClick = async (orderId, currentState) => {
        if (currentState === "배달완료") return;

        try {
            await api.patch(`server-c/order/${orderId}/status`);

            setOrder(prev =>
                prev.map(o =>
                    o.orderUid === orderId
                        ? {
                            ...o,
                            orderState:
                                currentState === "주문확인"
                                    ? "배달중"
                                    : "배달완료",
                        }
                        : o
                )
            );
        } catch (e) {
            alert("상태 변경 실패");
        }
    };



    return (
        <div className='mmainpage'>
            <div className="mmain">
                <div className='mnamespace'>
                    <div className='in'>
                        <GoChecklist size={35} />
                        <p className='mname'>주문목록</p>
                    </div>
                    <div className='mname2'>
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/ItemManage")}>
                            재고관리
                        </p>
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/Review")}>
                            리뷰관리
                        </p>
                    </div>
                </div>
                {currentOrders.map((item, index) => (
                    <div className='mlist' key={item.orderUid}>

                        <div className='mlist2'>
                            <div>
                                <CiClock1 size={15} />
                                <p>주문시간</p>
                            </div>
                            <p className='oitem'>{item.orderTime.slice(0, 10)} / {item.orderTime.slice(11, 13)}시 {item.orderTime.slice(14, 16)}분</p>
                            <div>
                                <CiLocationOn size={15} />
                                <p>주소지</p>
                            </div>
                            <p className='oitem'>{item.orderLocation}</p>
                            <div>
                                <LuSandwich size={15} />
                                <p>메뉴</p>
                            </div>
                            <p className='oitem'>{item.orderMenu}</p>

                        </div>

                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleStatusClick(item.orderUid, item.orderState)}
                            className='ordstat'
                        >
                            <p
                                style={{ cursor: "pointer" }}
                                onClick={() => handleStatusClick(item.orderUid, item.orderState)}
                            >
                                {item.orderState}

                            </p>
                        </div>

                    </div>
                ))}

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? "activePage" : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <div className="mfoot">
                    <div>
                        <img className="mimg" src="/images/sandwichlogo.png" alt="로고"></img>
                        <p>{targetStore?.storeName}</p>
                    </div>
                    <button onClick={change}>{targetStore ? message[targetStore.storeState ? 0 : 1] : "Loading..."}</button>
                </div>


            </div>

        </div>
    );
}

export default OrderList;