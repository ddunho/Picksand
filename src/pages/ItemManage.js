import '../css/itemManage.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemMange() {
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
                    <div className='itemlist2'>
                        <p>치즈</p>
                        <p className='itemcount'>수량/502개</p>
                        <label className='mlabel'>
                            품절여부
                            <input type='checkbox' className='checkbox' value={true} />
                        </label>
                    </div>

                    <div className='itemlist2'>
                        <p>베이컨</p>
                        <p className='itemcount'>수량/856개</p>
                        <label className='mlabel'>
                            품절여부
                            <input type='checkbox' className='checkbox' value={true} />
                        </label>
                    </div>

                </div>
                <div className='savebutton'>
                    <button className='itemsave' onClick={() => (alert("저장되었습니다."))}>저장</button>
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

export default ItemMange;