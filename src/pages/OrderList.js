import axios from 'axios';
import '../css/OrderList.css'
import { GoChecklist } from "react-icons/go";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import { LuSandwich } from "react-icons/lu";
import { useEffect, useState, useRef, useCallback } from 'react';
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

    // ✅ API 인스턴스를 한 번만 생성
    const apiRef = useRef(null);
    
    if (!apiRef.current) {
        apiRef.current = axios.create({
            baseURL: "http://k8s-picksand-appingre-5fb1cc8acd-1353364338.ap-northeast-2.elb.amazonaws.com/",
            withCredentials: true,
        });
    }
    
    const api = apiRef.current;

    // ✅ 인터셉터를 한 번만 등록
    useEffect(() => {
        // Request 인터셉터
        const requestInterceptor = api.interceptors.request.use((config) => {
            const token = localStorage.getItem("accessToken");
            
            // 재발급 API는 토큰 제외
            if (token && !config.url?.includes('members/reissue')) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            return config;
        });

        // Response 인터셉터
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                // ✅ 401 에러 && ACCESS_TOKEN_EXPIRED && 재시도 안 한 경우
                if (
                    error.response?.status === 401 &&
                    error.response.data?.error === "ACCESS_TOKEN_EXPIRED" &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem("refreshToken");
                        
                        if (!refreshToken) {
                            throw new Error("No refresh token");
                        }

                        console.log("🔄 토큰 재발급 시도 중...");

                        // ✅ 재발급 요청 (withCredentials 포함)
                        const response = await axios.post(
                            "http://k8s-picksand-appingre-5fb1cc8acd-1353364338.ap-northeast-2.elb.amazonaws.com/server-a/members/reissue",
                            { refreshToken: refreshToken },
                            { 
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        console.log("✅ 토큰 재발급 성공");

                        // 새 토큰 저장
                        const { accessToken, refreshToken: newRefreshToken } = response.data;
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("refreshToken", newRefreshToken);

                        // 원래 요청 재시도
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);

                    } catch (refreshError) {
                        console.error("❌ 토큰 재발급 실패:", refreshError);
                        
                        // 재발급 실패 시 로그아웃
                        if (!isAlertShownRef.current) {
                            isAlertShownRef.current = true;
                            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        }
                        
                        localStorage.clear();
                        window.location.href = "/mainpage";
                        return Promise.reject(refreshError);
                    }
                }

                // ❌ 다른 401 에러 (재발급 대상 아님)
                if (error.response?.status === 401) {
                    if (!isAlertShownRef.current) {
                        isAlertShownRef.current = true;
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    }
                    localStorage.clear();
                    window.location.href = "/mainpage";
                }

                // ❌ 권한 없음
                if (error.response?.status === 403) {
                    if (!isAlertShownRef.current) {
                        isAlertShownRef.current = true;
                        alert("접근 권한이 없습니다.");
                    }
                }

                return Promise.reject(error);
            }
        );

        // 클린업: 컴포넌트 언마운트 시 인터셉터 제거
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []); // ✅ 빈 배열: 마운트 시 한 번만 실행

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [storeRes, orderRes] = await Promise.all([
                    api.get("server-c/store/getStore"),
                    api.get("server-c/order/getOrder")
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
    }, []);

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
            await api.post("server-c/store/storeManage", {
                storeUid: storeUid,
                storeState: newState
            });
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
    }, [targetStore, storeUid, alertmessage]);

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
            await api.patch(`server-c/order/${orderId}/status`);
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
    }, []);

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
                    <button onClick={change} disabled={!targetStore}>
                        {targetStore ? message[targetStore.storeState ? 0 : 1] : "Loading..."}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderList;