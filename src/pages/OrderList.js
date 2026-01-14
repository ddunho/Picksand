import axios from 'axios';
import '../css/OrderList.css'
import { GoChecklist } from "react-icons/go";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import { LuSandwich } from "react-icons/lu";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function OrderList() {
    const navigate = useNavigate();
    const isAlertShownRef = useRef(false);
    
    const message = ["OPEN", "CLOSE"];
    const alertmessage = ["개점처리되었습니다.", "마감처리되었습니다."];
    
    const [storeInfoList, setStoreInfoList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const reviewsPerPage = 7;
    const storeUid = 1;

    const targetStore = storeInfoList.find(store => store.storeUid === storeUid);

    const sortedOrder = [...order].sort(
        (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
    );
    
    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    const currentOrders = sortedOrder.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedOrder.length / reviewsPerPage);

    // ✅ API 인스턴스 생성
    const api = useRef(
        axios.create({
            baseURL: "http://k8s-picksand-appingre-5fb1cc8acd-1353364338.ap-northeast-2.elb.amazonaws.com/",
            withCredentials: true,
        })
    ).current;

    // ✅ API 호출 래퍼 함수 (401 에러 처리)
    const apiCall = useCallback(async (requestFn) => {
        try {
            const token = localStorage.getItem("accessToken");
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};
            
            return await requestFn(config);
        } catch (error) {
            if (error.response?.status === 401) {
                if (!isAlertShownRef.current) {
                    isAlertShownRef.current = true;
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.clear();
                    window.location.href = "/mainpage";
                }
            } else if (error.response?.status === 403) {
                if (!isAlertShownRef.current) {
                    isAlertShownRef.current = true;
                    alert("접근 권한이 없습니다.");
                }
            }
            throw error;
        }
    }, []);

    // ✅ 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [storeRes, orderRes] = await Promise.all([
                    apiCall((config) => api.get("server-c/store/getStore", config)),
                    apiCall((config) => api.get("server-c/order/getOrder", config))
                ]);
                setStoreInfoList(storeRes.data);
                setOrder(orderRes.data);
            } catch (e) {
                console.error("데이터 로드 실패:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [apiCall, api]);

    // ✅ 개점/마감 처리
    const change = useCallback(async () => {
        if (!targetStore) return;

        const newState = !targetStore.storeState;
        const newIndex = newState ? 0 : 1;

        setStoreInfoList(prev =>
            prev.map(store =>
                store.storeUid === storeUid
                    ? { ...store, storeState: newState }
                    : store
            )
        );

        alert(alertmessage[newIndex]);

        try {
            await apiCall((config) => 
                api.post("server-c/store/storeManage", {
                    storeUid: storeUid,
                    storeState: newState
                }, config)
            );
        } catch (e) {
            console.error("상태 변경 오류:", e);
            if (e.response?.status !== 401) {
                alert("상태 변경에 실패했습니다.");
                setStoreInfoList(prev =>
                    prev.map(store =>
                        store.storeUid === storeUid
                            ? { ...store, storeState: !newState }
                            : store
                    )
                );
            }
        }
    }, [targetStore, storeUid, alertmessage, apiCall, api]);

    // ✅ 주문 상태 변경
    const handleStatusClick = useCallback(async (orderId, currentState) => {
        if (currentState === "배달완료") return;

        const newState = currentState === "주문확인" ? "배달중" : "배달완료";

        setOrder(prev =>
            prev.map(o =>
                o.orderUid === orderId
                    ? { ...o, orderState: newState }
                    : o
            )
        );

        try {
            await apiCall((config) => 
                api.patch(`server-c/order/${orderId}/status`, {}, config)
            );
        } catch (e) {
            console.error("상태 변경 실패:", e);
            if (e.response?.status !== 401) {
                alert("상태 변경 실패");
                setOrder(prev =>
                    prev.map(o =>
                        o.orderUid === orderId
                            ? { ...o, orderState: currentState }
                            : o
                    )
                );
            }
        }
    }, [apiCall, api]);

    if (isLoading) {
        return (
            <div className='mmainpage'>
                <div className="mmain">
                    <p style={{textAlign: 'center', padding: '20px'}}>로딩 중...</p>
                </div>
            </div>
        );
    }

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

                {currentOrders.length === 0 ? (
                    <p style={{textAlign: 'center', padding: '20px'}}>주문이 없습니다.</p>
                ) : (
                    currentOrders.map((item) => (
                        <div className='mlist' key={item.orderUid}>
                            <div className='mlist2'>
                                <div>
                                    <CiClock1 size={15} />
                                    <p>주문시간</p>
                                </div>
                                <p className='oitem'>
                                    {item.orderTime.slice(0, 10)} / {item.orderTime.slice(11, 13)}시 {item.orderTime.slice(14, 16)}분
                                </p>
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
                                className='ordstat'
                                onClick={() => handleStatusClick(item.orderUid, item.orderState)}
                                style={{ 
                                    cursor: item.orderState === "배달완료" ? "default" : "pointer" 
                                }}
                            >
                                <p>{item.orderState}</p>
                            </div>
                        </div>
                    ))
                )}

                {totalPages > 0 && (
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
                )}

                <div className="mfoot">
                    <div>
                        <img className="mimg" src="/images/sandwichlogo.png" alt="로고" />
                        <p>{targetStore?.storeName || "로딩 중..."}</p>
                    </div>
                    <button onClick={change} disabled={!targetStore || isLoading}>
                        {targetStore ? message[targetStore.storeState ? 0 : 1] : "Loading..."}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderList;