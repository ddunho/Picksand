import { useEffect } from "react";

function PaySuccess() {
  useEffect(() => {
    alert("결제 성공했습니다!");

    // userinfo로 이동
    window.location.href =
      "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/userinfo";
  }, []);

  return null; // 화면 안 보여도 됨
}

export default PaySuccess;
