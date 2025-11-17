import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  HomeIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ClipboardDocumentListIcon,
  SwatchIcon,
  PhotoIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  BookOpenIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  DocumentChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const sections = [
  {
    header: null,
    items: [{ name: 'Dashboard', path: '/dashboard', icon: HomeIcon }],
  },
  {
    header: 'PLANNING',
    items: [
      { name: 'AOP Plans', path: '/aop-plans', icon: Squares2X2Icon },
      { name: 'Assortment Plans', path: '/assortment-plans', icon: RectangleGroupIcon },
      { name: 'Buy Plan View', path: '/buy-plan-view', icon: ClipboardDocumentListIcon },
    ],
  },
  {
    header: 'DESIGN',
    items: [
      { name: 'Techpack View', path: '/techpack-view', icon: ClipboardDocumentListIcon },
    ],
  },
  {
    header: 'SAMPLES',
    items: [
      { name: 'Pantone', path: '/pantone', icon: SwatchIcon },
      { name: 'Pantone Library', path: '/pantone-library', icon: BookOpenIcon },
      { name: 'Print Strike', path: '/print-strike', icon: PhotoIcon },
      { name: 'Pre-Production', path: '/pre-production', icon: WrenchScrewdriverIcon },
      { name: 'Development Samples', path: '/development-samples', icon: BeakerIcon },
      { name: 'Fit Samples', path: '/fit-samples', icon: AdjustmentsHorizontalIcon },
       { name: 'consolidated status', path: '/fashion-orders', icon: ShoppingBagIcon },
    ],
  },
  {
    header: 'ORDERS',
    items: [
      { name: 'Best-Selling Styles', path: '/best-selling-styles', icon: StarIcon },
      { name: 'Repeat Order Status', path: '/repeat-order-status', icon: ArrowPathIcon },
      { name: 'Fashion Orders', path: '/fashion-orders', icon: ShoppingBagIcon },
    ],
  },
  {
    header: 'REPORTS',
    items: [
      { name: 'FPT', path: '/fpt', icon: DocumentChartBarIcon },
      { name: 'GPT', path: '/gpt', icon: DocumentTextIcon },
      { name: 'Final Inspection Report', path: '/final-inspection-report', icon: DocumentChartBarIcon },
    ],
  },
  {
    header: 'VENDOR',
    items: [
      { name: 'Vendor List', path: '/vendor-list', icon: UsersIcon },
      { name: 'PO-wise Order Status', path: '/po-wise-order-status', icon: ClipboardDocumentCheckIcon },
      { name: 'Transport Status', path: '/transport-status', icon: TruckIcon },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-[256px] min-w-[256px] max-w-[256px] h-screen bg-[#011F33] text-white flex flex-col font-sans">
      <div className="flex items-center h-20 px-5 border-b border-white/10">
        <img src={logo} alt="Modozo Logo" className="h-17" />
      </div>
      <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto bg-[#011F33] hide-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-2">
            {section.header && (
              <div className="text-xs font-semibold text-gray-400 px-4 py-1 tracking-wider mb-1">
                {section.header}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-white/5 hover:text-white ${
                      isActive ? 'bg-white/10 text-white font-semibold' : ''
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
} 