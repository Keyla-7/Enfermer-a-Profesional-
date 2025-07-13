document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  const ramoMap = {};
  let aprobados = JSON.parse(localStorage.getItem("ramosAprobados") || "[]");

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

  // Función para actualizar desbloqueos basado en requisitos y aprobados
  function actualizarDesbloqueos() {
    ramos.forEach(ramo => {
      const nombre = ramo.dataset.nombre;
      if (ramo.classList.contains("aprobado")) return;

      const requiere = JSON.parse(ramo.dataset.requiere || "[]");
      const todosAprobados = requiere.every(r => ramoMap[r]?.classList.contains("aprobado"));
      if (todosAprobados) {
        ramo.classList.remove("bloqueado");
      } else {
        ramo.classList.add("bloqueado");
      }
    });
  }

  actualizarDesbloqueos();

  // Click para aprobar o desaprobar
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const nombre = ramo.dataset.nombre;

      if (ramo.classList.contains("bloqueado")) return;

      if (ramo.classList.contains("aprobado")) {
        // Desmarcar ramo
        ramo.classList.remove("aprobado");
        aprobados = aprobados.filter(n => n !== nombre);
      } else {
        // Marcar ramo aprobado
        ramo.classList.add("aprobado");
        aprobados.push(nombre);
      }

      // Guardar en localStorage
      localStorage.setItem("ramosAprobados", JSON.stringify(aprobados));

      // Actualizar desbloqueos
      actualizarDesbloqueos();
    });
  });
});
