import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import DiagnosticForm from './pages/DiagnosticForm'
import ReportView from './pages/ReportView'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/diagnostic" element={<DiagnosticForm />} />
        <Route path="/report/:reportId" element={<ReportView />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Legacy organizer routes now point at the single dashboard. */}
        <Route path="/organizer/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/organizer" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
