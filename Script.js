document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");

  // Convertir nodos a objeto con nombre
  const ramoMap = {};
  ramos.forEach(ramo => {
    const nombre = ramo.dataset.nombre;
    ramoMap[nombre] = ramo;

    const requiere = JSON.parse(ramo.dataset.requiere || "[]");
    if (requiere.length > 0) {
      ramo.classList.add("bloqueado");
    }
  });

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      if (ramo.classList.contains("aprobado") || ramo.classList.contains("bloqueado")) return;

      ramo.classList.add("aprobado");

      // Desbloquear ramos que lo requieren
      ramos.forEach(destino => {
        const requisitos = JSON.parse(destino.dataset.requiere || "[]");
        if (!destino.classList.contains("aprobado") &&
            requisitos.every(r => ramoMap[r]?.classList.contains("aprobado"))) {
          destino.classList.remove("bloqueado");
        }
      });
    });
  });
});
