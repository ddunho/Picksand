// PaySuccess.jsx
import { useEffect } from "react";
import { useAxios } from "../api/axiosInterceptor";
import { useNavigate } from "react-router-dom";

function PaySuccess() {
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const processOrder = async () => {
      try {
        const orderData = JSON.parse(sessionStorage.getItem("orderData"));
        const totalPrice = Number(sessionStorage.getItem("totalPrice"));
        const receiverName = sessionStorage.getItem("receiverName");
        const deliveryMessage = sessionStorage.getItem("deliveryMessage");

        if (!orderData || !totalPrice || !receiverName) {
          alert("주문 정보가 올바르지 않습니다.");
          navigate("/orderpay", { replace: true });
          return;
        }

        const orderItems = orderData.map(item => ({
          recipeId: item.recipe.id,
          recipeName: item.recipe.name,
          price: item.recipe.totalPrice,
          ingredients: item.inds.map(ind => ({
            ingredientId: ind.id,
            ingredientName: ind.name
          }))
        }));

        await api.post("/server-a/orders", {
          totalPrice,
          receiverName,
          deliveryMessage,
          orderItems
        });

        alert("결제가 완료되었습니다!");

        sessionStorage.removeItem("orderData");
        sessionStorage.removeItem("totalPrice");
        sessionStorage.removeItem("receiverName");
        sessionStorage.removeItem("deliveryMessage");

        navigate("/mypage", { replace: true });

      } catch (err) {
        console.error("주문 저장 실패:", err);
        alert("결제는 완료되었지만 주문 저장에 실패했습니다.");
        navigate("/mypage", { replace: true });
      }
    };

    processOrder();
  }, [api, navigate]);

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