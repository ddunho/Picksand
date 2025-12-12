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
        "마감처리되었습니다."
    ];
    const [storeInfoList, setStoreInfoList] = useState([]);
    
    const storeUid = 1;
    
    const targetStore = storeInfoList.find(store => store.storeUid === storeUid);

    const [index, setindex] = useState(0);

    const change = async() => {
        const newIndex = (index + 1) % message.length;
        const newState = newIndex === 0;
        setindex(newIndex);
        setStoreInfoList(prev =>
        prev.map(store =>
            store.storeUid === storeUid
                ? { ...store, storeState: newState }  
                : store
        )
    );
    console.log(storeInfoList);
        
        alert(alertmessage[newIndex]);
        
        try {
            await axios.post("http://localhost:8080/store/storeManage", {
                storeUid: storeUid,
                storeState: newState
            });
        } catch (e) {
            console.error("백엔드 전송 오류:", e);
        }
        console.log(targetStore);
        //window.location.reload();
    };
    

    

    useEffect(() => {
        const storeList = async () => {
            const sto = await axios.get("http://localhost:8080/store/getStore")
            setStoreInfoList(sto.data)
        }
        storeList();
    },[])

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