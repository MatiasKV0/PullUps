const fechaInput = document.getElementById("fecha");
const ctx = document.getElementById("grafico").getContext("2d");
const mesAnteriorBtn = document.getElementById("mesAnterior");
const mesSiguienteBtn = document.getElementById("mesSiguiente");
const mesActualSpan = document.getElementById("mesActual");
const hoy = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split("T")[0];
fechaInput.value = hoy;

let mesActual = (() => {
  const d = new Date();
  return { año: d.getFullYear(), mes: d.getMonth() + 1 };
})();

function mostrarMesActual() {
  const fecha = new Date(mesActual.año, mesActual.mes - 1, 1);
  mesActualSpan.textContent = fecha.toLocaleString("es", { month: "long", year: "numeric" });
}

function cambiarMes(delta) {
  let { año, mes } = mesActual;
  mes += delta;
  if (mes < 1) {
    mes = 12;
    año--;
  } else if (mes > 12) {
    mes = 1;
    año++;
  }
  mesActual = { año, mes };
  mostrarMesActual();
  actualizarGrafico();
}

mesAnteriorBtn.onclick = () => cambiarMes(-1);
mesSiguienteBtn.onclick = () => cambiarMes(1);

function obtenerDatos() {
  return JSON.parse(localStorage.getItem("repeticiones")) || {};
}

function guardarRepeticiones() {
  const fecha = fechaInput.value;
  const reps = parseInt(document.getElementById("reps").value);
  if (!fecha || isNaN(reps) || reps <= 0) {
    alert("Datos inválidos");
    return;
  }

  const datos = obtenerDatos();
  datos[fecha] = reps;
  localStorage.setItem("repeticiones", JSON.stringify(datos));
  actualizarGrafico();
}

let grafico;
function actualizarGrafico() {
  const datos = obtenerDatos();
  const { año, mes } = mesActual;
  const diasEnMes = new Date(año, mes, 0).getDate();

  const labels = Array.from({ length: diasEnMes }, (_, i) => `${i + 1}`);
  const datosReps = labels.map(dia => {
    const fecha = `${año}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return datos[fecha] || 0;
  });

  // Estadísticas: máximo y promedio
  let maxReps = 0;
  let maxDia = "";
  let suma = 0;
  let diasConDatos = 0;
  datosReps.forEach((rep, idx) => {
    if (rep > 0) {
      suma += rep;
      diasConDatos++;
      if (rep > maxReps) {
        maxReps = rep;
        maxDia = labels[idx];
      }
    }
  });
  const promedio = diasConDatos ? Math.floor(suma / diasConDatos) : 0;

  // Mostrar estadísticas
  const estadisticasDiv = document.getElementById("estadisticas");
  if (diasConDatos) {
    estadisticasDiv.innerHTML = `🏆 Máx: <b>${maxReps}</b> repeticiones el día <b>${maxDia}</b><br>📈 Promedio: <b>${promedio}</b> repeticiones`;
  } else {
    estadisticasDiv.innerHTML = `Sin datos este mes`;
  }

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Repeticiones",
        data: datosReps,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite controlar la altura fija por CSS
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 },
          min: 0,
          max: 100 // Ajusta este valor según el máximo esperado de repeticiones
        }
      }
    }
  });
}

// Inicialización
mostrarMesActual();
actualizarGrafico();