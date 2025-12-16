import './App.css';
import Header from "./components/Header.js";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './pages/MainPage.js';
import UserInfo from './pages/UserInfo.js';
import Signup from './pages/Signup.js';
import ItemManage from './pages/ItemManage.js';
import OrderList from './pages/OrderList.js';
import Review from './pages/Review.js';
import OrderPay from './pages/OrderPay.js';
import FindId from './pages/FindId.js';
import { AuthProvider } from './context/AuthProvider';
import { GlobalProvider } from "./services/globalContext";
import PaySuccess from './pages/PaySuccess.js';

function App() {
  


  return (
    <>
    <AuthProvider>
      <GlobalProvider>
      <BrowserRouter>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Navigate to="/mainpage" replace />} />
            <Route path="/mainpage" element={<MainPage/>} />
            <Route path="/mypage" element={<UserInfo/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/OrderList" element={<OrderList />} />
            <Route path="/ItemManage" element={<ItemManage />} />
            <Route path='/Review' element={<Review />} />
            <Route path='/orderpay' element={<OrderPay/>}/>
            <Route path='/findid' element={<FindId/>}/>
            <Route path='/paySuccess' element={<PaySuccess/>}/>
          </Routes>
      </BrowserRouter>
      </GlobalProvider>
    </AuthProvider>
    </>
  );
}

export default App;
