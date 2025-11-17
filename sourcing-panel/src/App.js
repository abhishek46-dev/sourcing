import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TechpackView from './pages/TechpackView';
import Pantone from './pages/Pantone';
import PrintStrike from './pages/PrintStrike';
import PreProduction from './pages/PreProduction';
import DevelopmentSamples from './pages/DevelopmentSamples';
import PantoneLibrary from './pages/PantoneLibrary';
import FitSamples from './pages/FitSamples';
import BestSellingStyles from './pages/BestSellingStyles';
import RepeatOrderStatus from './pages/RepeatOrderStatus';
import FashionOrders from './pages/FashionOrders';
import VendorList from './pages/VendorList';
import POWiseOrderStatus from './pages/POWiseOrderStatus';
import TransportStatus from './pages/TransportStatus';
import AssortmentPlans from './pages/AssortmentPlans';
import AssortmentPlanDetail from './pages/AssortmentPlanDetail';
import BuyPlanView from './pages/BuyPlanView';
import FPT from './pages/FPT';
import GPT from './pages/GPT';
import FinalInspectionreport from './pages/FinalInspectionreport';
import './hide-scrollbar.css';

function App() {
  return (
    <div className="flex h-screen w-full">
      <div className="h-full overflow-y-auto hide-scrollbar">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/techpack-view" element={<TechpackView />} />
            <Route path="/pantone" element={<Pantone />} />
            <Route path="/print-strike" element={<PrintStrike />} />
            <Route path="/pre-production" element={<PreProduction />} />
            <Route path="/development-samples" element={<DevelopmentSamples />} />
            <Route path="/pantone-library" element={<PantoneLibrary />} />
            <Route path="/fit-samples" element={<FitSamples />} />
            <Route path="/best-selling-styles" element={<BestSellingStyles />} />
            <Route path="/repeat-order-status" element={<RepeatOrderStatus />} />
            <Route path="/fashion-orders" element={<FashionOrders />} />
            <Route path="/vendor-list" element={<VendorList />} />
            <Route path="/po-wise-order-status" element={<POWiseOrderStatus />} />
            <Route path="/transport-status" element={<TransportStatus />} />
            <Route path="/assortment-plans" element={<AssortmentPlans />} />
            <Route path="/assortment-plans/:id" element={<AssortmentPlanDetail />} />
            <Route path="/buy-plan-view" element={<BuyPlanView />} />
            <Route path="/fpt" element={<FPT />} />
            <Route path="/gpt" element={<GPT />} />
            <Route path="/final-inspection-report" element={<FinalInspectionreport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
