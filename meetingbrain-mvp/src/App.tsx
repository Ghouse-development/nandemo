import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Library } from './pages/Library';
import { Upload } from './pages/Upload';
import { MeetingDetail } from './pages/MeetingDetail';
import { StoreMap } from './pages/StoreMap';

/**
 * Main application component with routing
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Navigate to="/library" replace />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/library" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Library />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Upload />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/meetings/:id" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <MeetingDetail />
            </div>
          </ProtectedRoute>
        } />

        <Route path="/stores" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <StoreMap />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
