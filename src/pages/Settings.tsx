import { useState } from "react";
import { demoData } from "../data/demoData";
import { Button } from "../components/ui/Button";

export function Settings() {
  const [location, setLocation] = useState(demoData.user.location);
  const [boatType, setBoatType] = useState(demoData.user.vesselType);
  const [language, setLanguage] = useState(demoData.user.language);

  const boats = ["Motorized Boat", "Traditional / Non-Motorized Boat", "Small Fishing Vessel", "Other"];

  const handleSave = () => {
    demoData.user.location = location;
    demoData.user.vesselType = boatType;
    demoData.user.language = language;
    alert("Profile saved successfully");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto pb-24 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
      </header>

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Profile</h2>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
            <input type="text" value="+91 9876543210" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 font-medium" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
            <select 
              value={location} 
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              {demoData.availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Boat Type</label>
            <select 
              value={boatType} 
              onChange={e => setBoatType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              {boats.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Preferences</h2>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Language</label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              {demoData.availableLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </section>

        <Button className="w-full h-12" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
