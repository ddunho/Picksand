import '../css/Review.css'
import { FaStar } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
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

    const [memberNm, setMemberNm] = useState();
    const api = axios.create({
        // baseURL: "http://localhost:8080/server-c",
        baseURL: "http://k8s-picksand-appingre-5fb1cc8acd-1353364338.ap-northeast-2.elb.amazonaws.com/",
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


        if (token && !config.url?.includes('server-a/members/reissue')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    let isAlertShown = false;

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
                    const refreshToken = localStorage.getItem("refreshToken");
                    const res = await api.post("server-a/members/reissue", {
                        refreshToken: refreshToken
                    });

                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    originalRequest.headers.Authorization =
                        `Bearer ${res.data.accessToken}`;

                    return api(originalRequest);

                } catch (e) {
                    // ⛔ refresh 실패 → alert 한 번만
                    if (!isAlertShown) {
                        isAlertShown = true;
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    }

                    localStorage.clear();
                    window.location.href = "server-a/members/logout";
                    return Promise.reject(e);
                }
            }

            // ❌ refresh 대상이 아닌 401
            if (error.response?.status === 401) {
                if (!isAlertShown) {
                    isAlertShown = true;
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                }

                localStorage.clear();
                window.location.href = "server-a/members/logout";
            }

            // ❌ 권한 없음
            if (error.response?.status === 403) {
                if (!isAlertShown) {
                    isAlertShown = true;
                    alert("접근 권한이 없습니다.");
                }
            }

            return Promise.reject(error);
        }
    );



    const admitButton = async () => {
        const review = {
            reviewTxt: reviewTxt,
            starPoint: star,
            memberNickname: memberNm
        };
        await api.post("server-c/review/addReview", review);

    };



    useEffect(() => {
        const fetchData = async () => {
            const [avg, count, reviews, nm] = await Promise.all([
                api.get("server-c/review/avgStar"),
                api.get("server-c/review/reviewCount"),
                api.get("server-c/review/allReview"),
                api.get("server-c/user/findNM"),
            ]);

            setStarAvg(avg.data);
            setCountReview(count.data);
            setReview(reviews.data);
            setMemberNm(nm.data);
        };

        fetchData();
    }, []);





    return (
        <div className="mmainpage2">
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
                                <div className='nm'>
                                    <FaUserPen size={18} />
                                    <p>{item.memberNickname}</p>
                                </div>
                                <p className='dt'>{item.reviewDate.slice(0, 10)}</p>
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