/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import Welcome from "./components/Welcome";
import Landing from "./components/Landing";
import Booking from "./components/Booking";
import Inventory from "./components/Inventory";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import AdminAgenda from "./components/AdminAgenda";
import BossDashboard from "./components/BossDashboard";
import Login from "./components/Login";
import MyBookings from "./components/MyBookings";
import GlobalNavigation from "./components/GlobalNavigation";
import { motion, AnimatePresence } from "motion/react";
import { saveAppointment, verifyPayment } from "./services/bookingService";

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
  const [userRole, setUserRole] = useState<"none" | "client" | "employee" | "boss">("none");
  const [userEmail, setUserEmail] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const navigate = (view: string, email?: string) => {
    if (view === "back") {
      setCurrentView(previousView);
      return;
    }

    if (currentView !== view && view !== "login") {
      setPreviousView(currentView);
    }

    if (email) setUserEmail(email);
    setCurrentView(view);
  };

  // Al volver de Mercado Pago restauramos la reserva pendiente. Si el pago fue
  // aprobado, además verificamos en el servidor que el turno quedó registrado
  // (el webhook es la fuente primaria; esto cubre demoras del webhook).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const status = params.get("status");
    const paymentId = params.get("payment_id");
    const hasPaymentInfo = payment || status;
    if (!hasPaymentInfo) return;

    const pending = localStorage.getItem("lubricenter-pending-booking");
    localStorage.removeItem("lubricenter-pending-booking");

    const isSuccess = payment === "success" || status === "approved";
    if (isSuccess && pending) {
      try {
        const saved = JSON.parse(pending) as BookingData;
        setBookingData(saved);
        setUserEmail(saved.email);
        setUserRole("client");
        setCurrentView("confirmation");

        if (paymentId) {
          verifyPayment(paymentId).catch((error) => {
            console.error("Error al confirmar el pago en el servidor:", error);
          });
        }
      } catch {
        // reserva inválida: se ignora y queda en la vista actual
      }
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const handleAuthNavigate = (view: string, email?: string) => {
    if (email) setUserEmail(email);
    if (view === 'admin' || view === 'inventory' || view === 'admin-booking') setUserRole('employee');
    if (view === 'boss') setUserRole('boss');
    else if (view === 'admin' || view === 'inventory' || view === 'admin-booking') setUserRole('employee');
    else if (view === 'booking' || view === 'home') setUserRole('client');

    if (view === 'back') {
      setCurrentView(previousView);
    } else {
      setCurrentView(view);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <Landing onNavigate={navigate} />;

      case "home":
        return <Welcome onNavigate={navigate} />;

      case "booking":
        return (
          <Booking
            onNavigate={navigate}
            onBookingComplete={setBookingData}
            userEmail={userEmail}
          />
        );

      case "inventory":
        return <Inventory onNavigate={navigate} />;

      case "checkout":
        return (
          <Checkout
            onNavigate={navigate}
            bookingData={bookingData}
          />
        );

      case "confirmation":
        return (
          <Confirmation
            onNavigate={navigate}
            bookingData={bookingData}
          />
        );

      case "admin":
        return <AdminAgenda onNavigate={navigate} />;

      case "my-bookings":
        return <MyBookings onNavigate={navigate} userEmail={userEmail} />;

      case "admin-booking":
        return (
          <Booking
            onNavigate={navigate}
            onBookingComplete={(data) => {
              setBookingData(data);
              saveAppointment(data, "Confirmado").catch(console.error);
            }}
            userEmail={userEmail}
            nextView="admin"
            backView="admin"
          />
        );

      case "login":
        return (
          <Login
            onNavigate={(view, email) => {
              if (email) setUserEmail(email);

              if (view === "admin" || view === "inventory") {
                setUserRole("employee");
              } else if (view === "booking" || view === "home") {
                setUserRole("client");
              }

              if (view === "back") {
                setCurrentView(previousView);
              } else {
                setCurrentView(view);
              }
            }}
          />
        );

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