import './App.css';
<<<<<<< HEAD
import Header from "./components/Header.js";

=======
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage.js'
>>>>>>> 1f8e5180a7b68e66ede93b052526c3448e6a1664

function App() {
  return (
    <>
<<<<<<< HEAD
    <Header></Header>
=======
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage/>} />
        </Routes>
>>>>>>> 1f8e5180a7b68e66ede93b052526c3448e6a1664
    </>
  );
}

export default App;
