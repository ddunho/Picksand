import './Review.css'
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Review(){
const navigate = useNavigate();
    return(
    
        <div className='reviewmain'>
            <p
            style={{ cursor: "pointer"}}
                onClick={() => navigate("/")}
            >←</p>
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
    
    );
}

export default Review;