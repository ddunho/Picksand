import '../css/Review.css'
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from "react-icons/hi";
import { useState } from 'react';

function Review() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);

    const items = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0" ];
    return (
        <div className="mmainpage">
            <div className='reviewmain'>
                <p
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <HiArrowLeft />
                </p>
                
                <div className='reviewhead'>
                    별점 리뷰
                    <div className='reviewhead2'>
                        <div>
                            <FaStar color="gold" size={35} />
                            4.3
                        </div>
                        <p>전체 n개의 리뷰</p>
                    </div>
                </div>
                <div className='review'>

                    <div className='reviewcard'>
                        <div className='spointbu'>
                            <FaStar color="gold" size={35} />
                            {items.map((item, index) => (
                                <p
                                    key={index}
                                    className={`selectspoint ${activeIndex === index ? "active" : ""}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {item}
                                </p>
                               ))}
                               
                        </div>

                        <textarea className='reviewtxt'
                            type='text'
                            placeholder='리뷰내용을 작성해주세요.'
                            name='Review'   
                        />

                        <button onClick={() => (alert("저장되었습니다."))}>저장</button>



                    </div>

                    <div className='reviewcard'>
                        <div className='spoint'>
                            <FaStar color="gold" size={35} />
                            <p>4.5</p>
                        </div>
                        <div className='reviewcard2'>
                            <p>이수빈</p>
                            <p>2025-11-27</p>
                            <p>내용.......</p>
                        </div>
                    </div>
                    <div className='reviewcard'>
                        <div className='spoint'>
                            <FaStar color="gold" size={35} />
                            <p>4.0</p>
                        </div>
                        <div className='reviewcard2'>
                            <p>이수빈</p>
                            <p>2025-11-27</p>
                            <p>내용.......</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;