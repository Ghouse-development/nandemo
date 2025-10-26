import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { StoreMap } from './pages/StoreMap';

/**
 * Main application component with routing
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/stores" replace />} />
          <Route path="/stores" element={<StoreMap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
