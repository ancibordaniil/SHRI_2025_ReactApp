import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import MainPage from './pages/MainPage';
import GenetatorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/generate" element={<GenetatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </>
  );
}
