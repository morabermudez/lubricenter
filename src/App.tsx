/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Welcome from "./components/Welcome";
import Landing from "./components/Landing";
import Booking from "./components/Booking";
import Inventory from "./components/Inventory";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import AdminAgenda from "./components/AdminAgenda";
import Login from "./components/Login";
import GlobalNavigation from "./components/GlobalNavigation";
import { motion, AnimatePresence } from "motion/react";
import { saveAppointment } from "./services/bookingService";

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  plate: string;
  oilType: string;
  day: number;
  month: string;
  time: string;
  totalPrice: number;
  depositPrice: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [previousView, setPreviousView] = useState("landing");
  const [userRole, setUserRole] = useState<"none" | "client" | "employee">("none");
  const [userEmail, setUserEmail] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const navigate = (view: string, email?: string) => {
    if (view === "back") {
      setCurrentView(previousView);
      return;
    }
    
    if (currentView !== view && view !== 'login') {
      setPreviousView(currentView);
    }
    
    if (email) setUserEmail(email);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <Landing onNavigate={navigate} />;
      case "home":
        return <Welcome onNavigate={navigate} />;
      case "booking":
        return <Booking 
          onNavigate={navigate} 
          onBookingComplete={setBookingData} 
          userEmail={userEmail}
        />;
      case "inventory":
        return <Inventory onNavigate={navigate} />;
      case "checkout":
        return <Checkout 
          onNavigate={navigate} 
          bookingData={bookingData} 
        />;
      case "confirmation":
        return <Confirmation 
          onNavigate={navigate} 
          bookingData={bookingData} 
        />;
      case "admin":
        return <AdminAgenda onNavigate={navigate} />;
      case "admin-booking":
        return <Booking 
          onNavigate={navigate} 
          onBookingComplete={(data) => {
            setBookingData(data);
            saveAppointment(data).catch(console.error);
          }} 
          userEmail={userEmail}
          nextView="admin"
          backView="admin"
        />;
      case "login":
        return <Login onNavigate={(view, email) => {
          if (email) setUserEmail(email);
          // Si el usuario entra a 'admin', lo tratamos como employee por defecto para este demo
          if (view === 'admin' || view === 'inventory') setUserRole('employee');
          else if (view === 'booking' || view === 'home') setUserRole('client');
          
          if (view === 'back') {
            setCurrentView(previousView);
          } else {
            setCurrentView(view);
          }
        }} />;
      default:
        return <Welcome onNavigate={navigate} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-grow"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      <GlobalNavigation 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userRole={userRole}
      />
    </div>
  );
}

