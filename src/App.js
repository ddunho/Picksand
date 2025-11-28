import './App.css';
import Header from "./components/Header.js";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './pages/MainPage.js';
import UserInfo from './pages/UserInfo.js';
import Signup from './pages/Signup.js';

function App() {
  


  return (
    <>
    <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage/>} />
          <Route path="/userinfo" element={<UserInfo/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
