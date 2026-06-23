import { useEffect } from 'react';
import listaTurnos from '../data/turnos.json'; 

function Notificaciones() {
  useEffect(() => {
    const enviarRecordatoriosAutomaticos = async () => {
      // Tomamos los primeros turnos para la simulación
      const turnosParaEnviar = listaTurnos.slice(0, 2);

      if (turnosParaEnviar.length === 0) return;

      console.log("[Auto-Notificaciones] 🤖 Iniciando envío automático de recordatorios...");

      // Recorremos y simulamos el envío en la consola
      for (const turno of turnosParaEnviar) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`[WaAPI - AUTO] Mensaje enviado a ${turno.cliente} (${turno.telefono})`);
      }

      console.log("[Auto-Notificaciones] ✅ ¡Todos los recordatorios de mañana fueron enviados con éxito!");
    };

    enviarRecordatoriosAutomaticos();
  }, []);

  // No dibuja nada en la pantalla, es invisible
  return null; 
}

export default Notificaciones;