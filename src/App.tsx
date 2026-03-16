import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { CreateUser } from './pages/CreateUser'
import { Wallet } from './pages/Wallet'
import { UpdateUser } from './pages/UpdateUser'
import { AdminUsers } from './pages/AdminUsers'
import { Transactions } from './pages/Transactions'
import { NewTransaction } from './pages/NewTransaction'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateUser />} />
          <Route path="/account" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
           <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/transactions/new" element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App