import axios from 'axios';
import '../css/OrderList.css'
import { useEffect, useState } from 'react';
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

    const storeUid = 1; //지점uid

    const targetStore = storeInfoList.find(store => store.storeUid === storeUid);

    const [index, setindex] = useState(0);

    const api = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // ✅ Access Token 만료 → refresh
        if (
            error.response?.status === 401 &&
            error.response.data?.error === "ACCESS_TOKEN_EXPIRED" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const res = await api.post("/auth/refresh");
                const newAccessToken = res.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (e) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(e);
            }
        }

        // ❌ refresh 대상이 아닌 401
        if (error.response?.status === 401) {
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.clear();
            window.location.href = "/login";
        }

        // ❌ 권한 없음
        if (error.response?.status === 403) {
            alert("접근 권한이 없습니다.");
        }

        return Promise.reject(error);
    }
);


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
            await api.post("/store/storeManage", {
                storeUid: storeUid,
                storeState: newState
            });
        } catch (e) {
            console.error("백엔드 전송 오류:", e);
        }


    };




    useEffect(() => {
        const storeList = async () => {
            const sto = await api.get("/store/getStore")
            setStoreInfoList(sto.data)
        }
        storeList();
    }, [])

    return (
        <div className='mmainpage'>
            <div className="mmain">
                <div className='mnamespace'>
                    <p className='mname'>주문목록</p>
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
                <div className='mlist'>
                    <div className='mlist2'>
                        <p>주문시간: 2025/11/26/11:30</p><br />
                        <p>주소지: 서울시 송파구 ......</p><br />
                        <p>메뉴: 클럽샌드위치,햄,양상추</p><br />
                    </div>
                </div>
                <div className='mlist'>
                    <div className='mlist2'>
                        <p>주문시간: 2025/11/26/11:30</p><br />
                        <p>주소지: 서울시 송파구 ......</p><br />
                        <p>메뉴: 클럽샌드위치,햄,양상추</p><br />
                    </div>
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