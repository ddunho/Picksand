import './App.css';
import Header from "./components/Header.js";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { GlobalProvider } from "./services/globalContext";
import MainPage from './pages/MainPage.js';
import UserInfo from './pages/UserInfo.js';
import Signup from './pages/Signup.js';
import ItemManage from './pages/ItemManage.js';
import OrderList from './pages/OrderList.js';
import Review from './pages/Review.js';
import OrderPay from './pages/OrderPay.js';
import FindId from './pages/FindId.js';
function App() {
  


  return (
    <>
    <GlobalProvider>
      <BrowserRouter>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Navigate to="/mainpage" replace />} />
            <Route path="/mainpage" element={<MainPage/>} />
            <Route path="/userinfo" element={<UserInfo/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/OrderList" element={<OrderList />} />
            <Route path="/ItemManage" element={<ItemManage />} />
            <Route path='/Review' element={<Review />} />
            <Route path='/orderpay' element={<OrderPay/>}/>
            <Route path='/findid' element={<FindId/>}/>
          </Routes>
      </BrowserRouter>
    </GlobalProvider>
    </>
  );
}

export default App;
