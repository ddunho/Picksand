import '../css/itemManage.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    
            
            alert(alertmessage[newIndex]);
            
            try {
                await axios.post("http://localhost:8080/store/storeManage", {
                    storeUid: storeUid,
                    storeState: newState
                });
            } catch (e) {
                console.error("백엔드 전송 오류:", e);
            }
            
        };
        
        useEffect(() => {
        const storeList = async () => {
            const sto = await axios.get("http://localhost:8080/store/getStore")
            setStoreInfoList(sto.data)
        }
        storeList();
    },[])

    const [stock, setStock] = useState([]);
    useEffect(() => {
        const stockList = async () => {
            const sto = await axios.get("http://localhost:8080/stock/findStock");
            setStock(sto.data);
        };
        stockList();
    },[])

    const [soldOutList, setSoldOutList] = useState([]);

    useEffect(()=>{
        const defSoldOut = async() => {
            const def = await axios.get("http://localhost:8080/stock/getSoldOut");
            setSoldOutList(def.data);
        };
        defSoldOut();
    },[])

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
            await axios.post("http://localhost:8080/stock/soldOut", soldOutList);
            alert("저장되었습니다.");
            window.location.reload();
            
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className='mmainpage'>
            <div className="mmain">
                <div className='mnamespace'>
                    <p className='mname'>재고관리</p>
                    <div className='mname2'>
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/OrderList")}>
                            주문목록
                        </p>
                    </div>
                </div>
                <div className='itemlist'>
                    {stock.map((item, index) => (
                        <div className='itemlist2' key={index}>
                            <p>{item.stockName}</p>
                            <p className='itemcount'>수량/{item.stockQuantity}개</p>
                            <label className='mlabel'>

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



                </div>
                <div className='savebutton'>
                    <button 
                        className='itemsave' 
                        onClick={()=>{
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