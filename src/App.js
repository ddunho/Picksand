import './App.css';
import Header from "./components/Header.js";
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage.js'

function App() {
  return (
    <>
    <Header></Header>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage/>} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
