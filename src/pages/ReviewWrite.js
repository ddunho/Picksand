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
    const [memberId, setMemberId] = useState();
    const api = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 7;

    const sortedReview = [...review].sort(
        (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
    );

    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    const currentReviews = sortedReview.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(sortedReview.length / reviewsPerPage);

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {

            if (!error.response) {
                alert("서버에 연결할 수 없습니다.");
            }

            else if (error.response.status === 401) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("accessToken");
            }

            else if (error.response.status === 403) {
                alert("접근 권한이 없습니다.");
            }
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        response => response,

        async error => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                error.response.data?.error === "ACCESS_TOKEN_EXPIRED" &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                try {
                    // ⭐ refreshToken 쿠키는 자동 포함됨
                    const res = await api.post("/auth/refresh");

                    const newAccessToken = res.data.accessToken;
                    localStorage.setItem("accessToken", newAccessToken);

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    return api(originalRequest);

                } catch (e) {
                    // Refresh Token 만료/위조
                    localStorage.clear();
                    window.location.href = "/login";
                }
            }

            return Promise.reject(error);
        }
    );


    const admitButton = async () => {
        const review = {
            reviewTxt: reviewTxt,
            starPoint: star,
            memberId: memberId
        };
        await api.post("/review/addReview", review);

    };



    useEffect(() => {

        const avgStar = async () => {
            const res = await api.get("/review/avgStar");
            setStarAvg(res.data);
        };
        const reviewCount = async () => {
            const cou = await api.get("/review/reviewCount");
            setCountReview(cou.data);
        };

        const allReview = async () => {
            const rev = await api.get("/review/allReview");
            setReview(rev.data);
        }

        const getMemberId = async () => {
            const mid = await api.get("/review/getMemberId");
            setMemberId(mid.data);
        }
        getMemberId();
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
                    {currentReviews.map((item, index) => (
                        <div className='reviewcard' key={index}>
                            <div className='spoint'>
                                <FaStar color="gold" size={35} />
                                <p>{item.starPoint}</p>
                            </div>
                            <div className='reviewcard2'>
                                <p>닉네임</p>
                                <p>{item.reviewDate.slice(0, 10)}</p>
                                <p className='reviewtext'>{item.reviewTxt}</p>
                            </div>
                        </div>
                    ))}

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

                </div>
            </div>
        </div>
    );
}

export default Review;