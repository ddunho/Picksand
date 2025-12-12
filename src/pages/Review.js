import '../css/Review.css'
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from "react-icons/hi";
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Review() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);
    const goBack = () => {
        navigate(-1);
    };
    const items = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const [reviewTxt, setReviewTxt] = useState("");
    const [star, setStar] = useState();
    const [starAvg, setStarAvg] = useState();
    const [countReview, setCountReview] = useState();
    const [review, setReview] = useState([]);

    const admitButton = async () => {
        const review = {
            reviewTxt: reviewTxt,
            starPoint: star
        };
        await axios.post("http://localhost:8080/review/addReview", review);
    };

    useEffect(() => {

        const avgStar = async () => {
            const res = await axios.get("http://localhost:8080/review/avgStar");
            setStarAvg(res.data);
        };
        const reviewCount = async () => {
            const cou = await axios.get("http://localhost:8080/review/reviewCount");
            setCountReview(cou.data);
        };

        const allReview = async () => {
            const rev = await axios.get("http://localhost:8080/review/allReview");
            setReview(rev.data);
        }

        allReview();
        reviewCount();
        avgStar();
    }, [])




    return (
        <div className="mmainpage">
            <div className='reviewmain'>
                <p
                    style={{ cursor: "pointer" }}
                    onClick={goBack}
                >
                    <HiArrowLeft />
                </p>

                <div className='reviewhead'>
                    별점 리뷰
                    <div className='reviewhead2'>
                        <div>
                            <FaStar color="gold" size={35} />
                            {starAvg}
                        </div>
                        <p>전체 {countReview}개의 리뷰</p>
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
                                    onClick={() => {
                                        setActiveIndex(index);
                                        setStar(item);
                                    }}
                                >
                                    {item}
                                </p>
                            ))}

                        </div>

                        <textarea className='reviewtxt'
                            value={reviewTxt}
                            onChange={(e) => setReviewTxt(e.target.value)}
                            placeholder='리뷰내용을 작성해주세요.'
                            name='review'
                        />

                        <button onClick={async () => {
                            if (!reviewTxt || reviewTxt.trim() === "") {
                                alert("리뷰 내용을 입력해주세요.");
                                return;
                            }
                            if (!star) {
                                alert("별점을 클릭해주세요")
                                return;
                            }

                            await admitButton();
                            alert("저장되었습니다.");
                            window.location.reload();
                        }
                        }>저장</button>



                    </div>
                    {[...review]
                        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
                        .map((item, index) => (
                            <div className='reviewcard' key={index}>
                                <div className='spoint'>
                                    <FaStar color="gold" size={35} />
                                    <p>{item.starPoint}</p>
                                </div>
                                <div className='reviewcard2'>
                                    <p>닉네임</p>
                                    <p>{item.reviewDate.slice(0, 10)}</p>
                                    <p>{item.reviewTxt}</p>
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        </div>
    );
}

export default Review;