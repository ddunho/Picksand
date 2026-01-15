import '../css/itemManage.css'
import { FaClipboardList } from "react-icons/fa";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdFoodBank } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
function ItemManage() {
    const navigate = useNavigate();
    const message = [
        "OPEN",
        "CLOSE"
    ];
    const alertmessage = [
        "개점처리되었습니다.",
        "마감처리되었습니다."
    ];
    const [storeInfoList, setStoreInfoList] = useState([]);

    const storeUid = 1; //지점uid

    const targetStore = storeInfoList.find(store => store.storeUid === storeUid);

    const [index, setindex] = useState(0);
    const [stock, setStock] = useState([]);
    const ITEMS_PER_PAGE = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(stock.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentStock = stock.slice(startIndex, endIndex);



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
        const requestInterceptor = api.interceptors.request.use((config) => {
            const token = localStorage.getItem("accessToken");

            if (token && !config.url?.includes('server-a/members/reissue')) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

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
                        const res = await api.post("server-a/members/reissue", {
                            refreshToken
                        });

                        localStorage.setItem("accessToken", res.data.accessToken);
                        localStorage.setItem("refreshToken", res.data.refreshToken);

                        originalRequest.headers.Authorization =
                            `Bearer ${res.data.accessToken}`;
                        isAlertShownRef.current = false;
                        return api(originalRequest);
                    } catch (e) {
                        if (!isAlertShownRef.current) {
                            isAlertShownRef.current = true;
                            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        }

                        localStorage.clear();
                        window.location.href = "mainpage";
                        return Promise.reject(e);
                    }
                }

                return Promise.reject(error);
            }
        );

        // ✅ 컴포넌트 unmount 시 interceptor 제거 (중요!)
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);


    const change = async () => {
        const newIndex = (index + 1) % message.length;
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
        storeList();
    }, [])




    useEffect(() => {
        const stockList = async () => {
            const sto = await api.get("server-c/stock/findStock");
            setStock(sto.data);
        };
        stockList();
    }, [])

    const [soldOutList, setSoldOutList] = useState([]);

    useEffect(() => {
        const defSoldOut = async () => {
            const def = await api.get("server-c/stock/getSoldOut");
            setSoldOutList(def.data);
        };
        defSoldOut();
    }, [])

    const toggleCheck = (stockUid, checked) => {
        setSoldOutList((prev) => {
            const exists = prev.find((item) => item.stockUid === stockUid);
            if (exists) {
                return prev.map((item) =>
                    item.stockUid === stockUid
                        ? { ...item, soldOut: checked }
                        : item
                );
            }
            return [
                ...prev,
                {
                    stockUid: stockUid,
                    soldOut: checked,

                },
            ];
        });
    };

    const sendSoldOutStatus = async () => {
        try {
            await api.post("server-c/stock/soldOut", soldOutList);
            alert("저장되었습니다.");
            window.location.reload();

        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className='mmainpage2'>
            <div className="mmain">
                <div className='mnamespace'>
                    <div className='in'>
                        <FaClipboardList size={35} />
                        <p className='mname'>재고관리</p>
                    </div>
                    <div className='mname2'>
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/OrderList")}>
                            주문목록
                        </p>
                    </div>
                </div>
                <div className='itemlist'>
                    {stock?.length === 0 ? (
                        <p className="empty">재고가 없습니다.</p>
                    ) : currentStock.map((item, index) => (
                        <div className='itemlist2' key={index}>
                            <div>
                                <div className='mdec'>
                                    <MdFoodBank />
                                    <p>{item.stockName}</p>
                                </div>
                                <p className='itemcount'>수량/{item.stockQuantity}개</p>
                            </div>
                            <label className='mlabel'>
                                <CgUnavailable color='#F54A00' />
                                품절여부
                                <input
                                    type='checkbox'
                                    className='checkbox'
                                    checked={soldOutList.some((s) => s.stockUid === item.stockUid && s.soldOut === true)}
                                    onChange={(e) => toggleCheck(item.stockUid, e.target.checked)}
                                />

                            </label>
                        </div>

                    ))}

                    <div className="pagination2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            이전
                        </button>

                        <span>{currentPage} / {totalPages}</span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            다음
                        </button>
                    </div>

                </div>
                <div className='savebutton'>
                    <button
                        className='itemsave'
                        onClick={() => {
                            sendSoldOutStatus();
                        }}>저장</button>
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

export default ItemManage;