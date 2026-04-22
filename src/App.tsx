import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import TabBar from './components/layout/TabBar'
import Timeline from './pages/Timeline'
import Map from './pages/Map'
import Finance from './pages/Finance'
import Settings from './pages/Settings'
import PlaceDetail from './pages/PlaceDetail'

function AppInner() {
  const location = useLocation()
  const hideTabBar = location.pathname.startsWith('/place/')

  return (
    <div style={{ background: '#F8F7F2', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/place/:id" element={<PlaceDetail />} />
        <Route path="/map" element={<Map />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!hideTabBar && <TabBar />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}