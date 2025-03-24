import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from '@web/common';
import { QueryClientProvider } from 'react-query';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import SetPassword from './pages/auth/set-password';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/set/password/:token" element={<SetPassword />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
