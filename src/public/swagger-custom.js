
(function () {
  function agregarBotonCopiarJWT() {
    const operaciones = document.querySelectorAll(".opblock");

    operaciones.forEach((operacion) => {
      const metodo = operacion.querySelector(
        ".opblock-summary-method"
      );
      const ruta = operacion.querySelector(
        ".opblock-summary-path"
      );

      if (
        !metodo ||
        !ruta ||
        metodo.textContent.trim() !== "POST" ||
        !ruta.textContent.includes("/auth/login") ||
        operacion.querySelector(".copiar-jwt-btn")
      ) {
        return;
      }

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "copiar-jwt-btn";
      boton.textContent = "Copiar JWT";
      boton.style.margin = "10px";
      boton.style.padding = "8px 12px";
      boton.style.cursor = "pointer";

      boton.addEventListener("click", async () => {
        // Busca el cuerpo de la respuesta real de Swagger.
        const respuesta = operacion.querySelector(
          ".responses-wrapper .live-responses-table .response pre"
        );

        if (!respuesta) {
          alert("Ejecuta primero POST /auth/login.");
          return;
        }

        try {
          const datos = JSON.parse(respuesta.textContent);

          if (
            typeof datos.token !== "string" ||
            !datos.token.trim()
          ) {
            alert(
              "No se encontró el campo token. Comprueba la respuesta del login."
            );
            return;
          }

          await navigator.clipboard.writeText(datos.token);

          boton.textContent = "JWT copiado";
          setTimeout(() => {
            boton.textContent = "Copiar JWT";
          }, 2000);
        } catch (error) {
          console.error("Error al copiar el JWT:", error);
          alert(
            "No se pudo copiar el JWT. Comprueba la respuesta del login y los permisos del navegador."
          );
        }
      });

      operacion
        .querySelector(".opblock-summary")
        ?.appendChild(boton);
    });
  }

  const observador = new MutationObserver(agregarBotonCopiarJWT);

  observador.observe(document.body, {
    childList: true,
    subtree: true,
  });

  agregarBotonCopiarJWT();
})();
