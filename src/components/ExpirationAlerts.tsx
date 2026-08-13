import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ExpirationItem {
  key: string;
  label: string;
  description: string;
  expiresAt: string;
  daysLeft: number;
  expiring: boolean;
  url?: string;
}

export default function ExpirationAlerts() {
  const [alerts, setAlerts] = useState<ExpirationItem[]>([]);

  useEffect(() => {
    fetch("/api/expirations")
      .then((res) => res.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error al cargar alertas de vencimiento:", error));
  }, []);

  const active = alerts.filter((alert) => alert.expiring);
  if (active.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 mb-8"
    >
      {active.map((alert) => (
        <div
          key={alert.key}
          className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-amber-900/20 p-6"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                {alert.key === "deploy" ? "cloud_off" : "key"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black uppercase tracking-wider text-sm">{alert.label}</h4>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  {alert.daysLeft <= 0
                    ? "Vencido"
                    : alert.daysLeft === 1
                    ? "1 día restante"
                    : `${alert.daysLeft} días restantes`}
                </span>
              </div>
              <p className="text-sm text-white/85 mt-1 leading-relaxed">{alert.description}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-1">
                Vence el {new Date(alert.expiresAt).toLocaleDateString("es-AR")}
              </p>
            </div>
            {alert.url && (
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[11px] font-black uppercase tracking-widest bg-white text-amber-800 px-5 py-3 rounded-xl hover:bg-amber-50 active:scale-95 transition-all text-center"
              >
                Renovar ahora
              </a>
            )}
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-6 text-8xl opacity-10 rotate-12">
            warning
          </span>
        </div>
      ))}
    </motion.div>
  );
}
