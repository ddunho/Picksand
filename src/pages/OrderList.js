import '../css/OrderList.css'
import { useState } from 'react';
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

    const [index, setindex] = useState(0);

    const change = () => {
        setindex((i) => ((i + 1) % message.length));
        alert(alertmessage[index]);
    }


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
                    <p>픽샌 천호점</p>
                </div>
                <button onClick={change}>{message[index]}</button>
            </div>
        </div>
        </div>
    );
}

export default OrderList;