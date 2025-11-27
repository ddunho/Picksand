import './App.css';
import Header from "./components/Header.js";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './pages/MainPage.js';
import UserInfo from './pages/UserInfo.js';

function App() {
  return (
    <>
    <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage/>} />
          <Route path="/userinfo" element={<UserInfo/>}/>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
