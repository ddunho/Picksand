import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage.js'

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage/>} />
        </Routes>
    </>
  );
}

export default App;
