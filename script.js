document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  const ramoMap = {};
  let aprobados = JSON.parse(localStorage.getItem("ramosAprobados") || "[]");

  // 👉 NUEVO: estado de cada año (para detectar cambio)
  const estadoAnios = {};

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
      if (ramo.classList.contains("aprobado")) return;

      const requiere = JSON.parse(ramo.dataset.requiere || "[]");
      const todosAprobados = requiere.every(r =>
        ramoMap[r]?.classList.contains("aprobado")
      );

      if (todosAprobados) {
        ramo.classList.remove("bloqueado");
      } else {
        ramo.classList.add("bloqueado");
      }
    });
  }

  // Función para actualizar progreso por año
  function actualizarProgresoPorAnio() {
    const anios = document.querySelectorAll("section.anio");

    anios.forEach(seccion => {
      const ramosDelAnio = seccion.querySelectorAll(".ramo");
      const total = ramosDelAnio.length;
      let aprobadosCount = 0;

      ramosDelAnio.forEach(ramo => {
        if (ramo.classList.contains("aprobado")) aprobadosCount++;
      });

      const porcentaje =
        total === 0 ? 0 : Math.round((aprobadosCount / total) * 100);

      const barra = seccion.querySelector(".progreso-bar-anio");
      if (barra) {
        barra.style.width = porcentaje + "%";
      }

      // 🎉 celebración SOLO cuando pasa de incompleto → completo
      const anio = seccion.dataset.anio;
      const completo = aprobadosCount === total && total > 0;

      if (completo && !estadoAnios[anio]) {
        celebrarAnio(anio);
      }

      estadoAnios[anio] = completo;
    });
  }

  // Click para aprobar o desaprobar
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const nombre = ramo.dataset.nombre;

      if (ramo.classList.contains("bloqueado")) return;

      if (ramo.classList.contains("aprobado")) {
        ramo.classList.remove("aprobado");
        aprobados = aprobados.filter(n => n !== nombre);
      } else {
        ramo.classList.add("aprobado");
        aprobados.push(nombre);
      }

      localStorage.setItem("ramosAprobados", JSON.stringify(aprobados));

      actualizarDesbloqueos();
      actualizarProgresoPorAnio();
    });
  });

  actualizarDesbloqueos();
  actualizarProgresoPorAnio();
});

// 🎀 FUNCIÓN DE CELEBRACIÓN
function celebrarAnio(anio) {
  const contenedor = document.createElement("div");
  contenedor.className = "celebracion";

  for (let i = 0; i < 40; i++) {
    const mono = document.createElement("div");
    mono.className = "mono";
    mono.textContent = "🎀";
    mono.style.left = Math.random() * 100 + "vw";
    mono.style.animationDelay = Math.random() * 1.5 + "s";
    mono.style.fontSize = 20 + Math.random() * 20 + "px";
    contenedor.appendChild(mono);
  }

  document.body.appendChild(contenedor);

  setTimeout(() => {
    contenedor.remove();
  }, 3500);
    }
