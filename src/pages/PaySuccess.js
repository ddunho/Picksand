import { useEffect } from "react";
import { useAxios } from "../api/axiosInterceptor";

function PaySuccess() {
  const api = useAxios();

  useEffect(() => {
    const processOrder = async () => {
      try {
        // sessionStorage에서 데이터 복구
        const orderData = JSON.parse(sessionStorage.getItem("orderData"));
        const totalPrice = Number(sessionStorage.getItem("totalPrice"));
        const receiverName = sessionStorage.getItem("receiverName");
        const deliveryMessage = sessionStorage.getItem("deliveryMessage");

        if (!orderData || !totalPrice || !receiverName) {
          alert("주문 정보가 올바르지 않습니다.");
          window.location.href = "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/orderpay";
          return;
        }

        // 서버로 보낼 데이터 가공
        const orderItems = orderData.map(item => ({
          recipeId: item.recipe.id,
          recipeName: item.recipe.name,
          price: item.recipe.totalPrice,
          ingredients: item.inds.map(ind => ({
            ingredientId: ind.id,
            ingredientName: ind.name
          }))
        }));

        // 주문 생성 API 호출
        await api.post("/server-a/orders", {
          totalPrice,
          receiverName,
          deliveryMessage,
          orderItems
        });

        alert("결제가 완료되었습니다!");

        // 임시 데이터 정리
        sessionStorage.removeItem("orderData");
        sessionStorage.removeItem("totalPrice");
        sessionStorage.removeItem("receiverName");
        sessionStorage.removeItem("deliveryMessage");

        // 마이페이지로 이동
        window.location.href = "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/#/mypage";

      } catch (err) {
        console.error("주문 저장 실패:", err);
        alert("결제는 완료되었지만 주문 저장에 실패했습니다. 고객센터에 문의해주세요.");
        
        // 에러 시에도 마이페이지로 이동 (결제는 완료됨)
        window.location.href = "https://picksand-bucket.s3-website.ap-northeast-2.amazonaws.com/#/mypage";
      }
    };

    processOrder();
  }, [api]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>결제 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}

export default PaySuccess;