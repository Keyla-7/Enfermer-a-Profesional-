document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  const ramoMap = {};
  const aprobados = JSON.parse(localStorage.getItem("ramosAprobados") || "[]");

  // Mapear y aplicar estado inicial
  ramos.forEach(ramo => {
    const nombre = ramo.dataset.nombre;
    const requiere = JSON.parse(ramo.dataset.requiere || "[]");
    ramoMap[nombre] = ramo;

    if (requiere.length > 0) {
      ramo.classList.add("bloqueado");
    }

    if (aprobados.includes(nombre)) {
      ramo.classList.add("aprobado");
      ramo.classList.remove("bloqueado");
    }
  });

  // Desbloquear en base a los ya aprobados
  function actualizarDesbloqueos() {
    ramos.forEach(ramo => {
      const nombre = ramo.dataset.nombre;
      if (ramo.classList.contains("aprobado")) return;

      const requiere = JSON.parse(ramo.dataset.requiere || "[]");
      const todosAprobados = requiere.every(r => ramoMap[r]?.classList.contains("aprobado"));
      if (todosAprobados) {
        ramo.classList.remove("bloqueado");
      }
    });
  }

  actualizarDesbloqueos();

  // Click para aprobar
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const nombre = ramo.dataset.nombre;

      if (ramo.classList.contains("aprobado") || ramo.classList.contains("bloqueado")) return;

      ramo.classList.add("aprobado");

      // Guardar en localStorage
      const nuevosAprobados = [...new Set([...aprobados, nombre])];
      localStorage.setItem("ramosAprobados", JSON.stringify(nuevosAprobados));

      actualizarDesbloqueos();
    });
  });
});
