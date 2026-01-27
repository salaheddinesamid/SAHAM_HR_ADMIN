import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminLoginPage } from './routes/Login';
import { AdminServiceProvider } from './context/ViewContext';
import { AdminProtectedRoute } from './routes/HomeProtectedRoute';
import { AdminDashboard } from './routes/Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <AdminServiceProvider>
          <AdminProtectedRoute>
            <AdminDashboard/>
          </AdminProtectedRoute>
      </AdminServiceProvider>
      }/>
      <Route path='/login' element={<AdminLoginPage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
