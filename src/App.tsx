import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TabBar from './components/layout/TabBar'
import Timeline from './pages/Timeline'
import Map from './pages/Map'
import Finance from './pages/Finance'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#F8F7F2', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/map" element={<Map />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}