import { Routes, Route } from 'react-router-dom'
import ActorPicker from './pages/ActorPicker'
import ProfileForm from './pages/startup/ProfileForm'
import MatchResults from './pages/startup/MatchResults'
import PartnerTypePicker from './pages/partner/PartnerTypePicker'
import CorporateForm from './pages/partner/CorporateForm'
import InvestorForm from './pages/partner/InvestorForm'
import ServiceProviderForm from './pages/partner/ServiceProviderForm'
import StaffLogin from './pages/staff/StaffLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ActorPicker />} />
      <Route path="/startup" element={<ProfileForm />} />
      <Route path="/startup/results" element={<MatchResults />} />
      <Route path="/partner" element={<PartnerTypePicker />} />
      <Route path="/partner/corporate" element={<CorporateForm />} />
      <Route path="/partner/investor" element={<InvestorForm />} />
      <Route path="/partner/service" element={<ServiceProviderForm />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}
