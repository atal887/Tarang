import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { Map } from "./pages/Map";
import { TripResults } from "./pages/TripResults";
import { ActiveTrip } from "./pages/ActiveTrip";
import { Onboarding } from "./pages/Onboarding";
import { Navigation } from "./components/ui/Navigation";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Training } from "./pages/Training";
import { Lesson } from "./pages/Lesson";
import { ProfileProvider } from './store/profile';
export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Navigation Layout Routes */}
          <Route element={<Navigation />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/map" element={<Map />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Full Screen Routes */}
          <Route path="/trip-results" element={<TripResults />} />
          <Route path="/active-trip" element={<ActiveTrip />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training/:id" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
