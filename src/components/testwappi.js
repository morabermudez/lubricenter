// prueba.js
const token = "kDLR7tnnLECQ4UBwpDTfgkt1T1ulxpssatTI65dAa8637907"; 
const instanceId = "96076"; 
const numeroDestino = "543541632265@c.us"; 

const enviarMensaje = async () => {
  try {
    const response = await fetch(`https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        chatId: numeroDestino,
        message: "¡Funciona! Primera prueba de notificación automática. 🚗💨"
      })
    });

    const data = await response.json();
    console.log("Respuesta de WaAPI:", data);
  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  }
};

enviarMensaje();