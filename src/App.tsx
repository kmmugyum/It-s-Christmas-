import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminFlow, VisitorFlow } from './pages';
import './App.css';

function App() {
  // Generate snowflakes
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
      snowflake.style.opacity = String(Math.random() * 0.6 + 0.4);
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      document.body.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 8000);
    };

    const interval = setInterval(createSnowflake, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      {/* 관리자 페이지: 새 트리 생성 */}
      <Route path="/" element={<AdminFlow />} />

      {/* 관리자 페이지: 기존 트리 관리 (secretKey 포함) */}
      <Route path="/admin/:treeId/:secretKey" element={<AdminFlow />} />

      {/* 방문자 페이지: /tree/:treeId */}
      <Route path="/tree/:treeId" element={<VisitorFlow />} />
    </Routes>
  );
}

export default App;
