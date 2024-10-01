// Variables del juego
const marco = document.getElementById('marco'); // Obtener el contenedor del juego (marco)
const timon = document.getElementById('timón'); // Obtener el timón
const puntuacionElemento = document.getElementById('puntuacion');
console.log('Elemento de puntuación:', puntuacionElemento);
let btnIniciar = document.getElementById('btnIniciar');
const musicaFondo = new Audio('vene/musica.mp3'); // Música de fondo
const btnPausar = document.getElementById('pausarBtn');
const btnReanudar = document.getElementById('reanudarBtn');

// Variables para el avión
let avionX = 100; // posición inicial horizontal del avión
let avionY = 100; // posición inicial vertical del avión
const AVION_WIDTH = 80; // ancho del avión principal (ajustado)
const AVION_HEIGHT = 40; // alto del avión principal (ajustado)

let avionesRivales = []; // Array para almacenar aviones rivales
let balas = []; // Array para almacenar balas disparadas
let velocidadAviones = 2; // Velocidad normal de los aviones rivales
const velocidadAtaque = 0.9; // Velocidad reducida durante el ataque
let numAvionesRivales = 3; // Número inicial de aviones rivales
let puntuacion = 0;
let cantidadAvionesRivales = 0; // Comienza con un avión rival
let velocidadBaseAvionesRivales = 2; // Velocidad base de los aviones rivales
let velocidadActual = velocidadBaseAvionesRivales;
let juegoActivo = false; // Bandera para controlar si el juego está activo
let juegoPausado = false; // Bandera para controlar si el juego está pausado
// Crear un array para almacenar las balas rivales
let balasRivales = [];
let cantidadAviones = 0; // Variable para contar los aviones rivales
let direccionAvionesRivales = 0; // 0 = quieto, -1 = izquierda, 1 = derecha
// Crear un nuevo audio para el sonido de la bala
const sonidoBala = new Audio('https://www.soundjay.com/button/sounds/button-3.mp3'); // Sustituye este enlace por el de tu sonido de bala
sonidoBala.volume = 1; // Aumenta el volumen (opcional)
let intervaloDisparo; // Variable para almacenar el intervalo de disparo

// Cargar el sonido del avión
const sonidoAvion = new Audio('vene/avion.mp3'); // Cambia esto por la URL de tu audio
sonidoAvion.loop = true; // Hace que el sonido se repita en bucle
    
// Función para actualizar la puntuación

// Función para iniciar el juego cuando se presiona el botón "Iniciar Juego"
btnIniciar.addEventListener('click', function() {
    dibujarJuego();
    // Aquí podrías iniciar otros elementos del juego como música, movimientos de aviones, etc.
});
function aumentarPuntuacion(puntos) {
    puntuacion += puntos; // Aumenta la puntuación
    puntuacionElemento.textContent = `Puntuación: ${puntuacion}`; // Actualiz
}

 // Incrementa la puntuación cada segundo
    
    // Obtener el avión del jugador
    const avion = document.getElementById('avion');
    avion.style.left = `${avionX}px`;
    avion.style.top = `${avionY}px`;
    // Función para reproducir música de fondo
function reproducirMusicaFondo() {
    musicaFondo.loop = true; // Repetir la música en bucle
    musicaFondo.volume = 0.5; // Ajustar el volumen (0.0 a 1.0)
    musicaFondo.play().catch(error => {
        console.error('Error al reproducir la música de fondo:', error);
    });
}

// Función para aumentar la velocidad y añadir aviones rivales según la puntuación
function aumentarVelocidadYAgregarAvion() {
    // Verificar si la puntuación alcanza múltiplos de 20
   
        cantidadAvionesRivales++; // Añadir un avión rival
        velocidadBaseAvionesRivales++; // Aumentar la velocidad base de los aviones rivales
        velocidadActual = velocidadBaseAvionesRivales * cantidadAvionesRivales; // Actualizar la velocidad actual
        console.log(`¡Puntuación alcanzada: ${puntuacion}! Se añadió un avión rival. Nueva velocidad: ${velocidadActual}`);
    
}// Función para simular el aumento de puntuación (llámala cuando el jugador gane puntos)


    // Función para crear aviones rivales de forma aleatoria
    function crearAvionRival() {
        const avionRival = document.createElement('img');
        avionRival.src = 'vene/avionrival.gif'; // Imagen del avión rival
        avionRival.className = 'avion-rival';

        // Calcular una posición aleatoria lejos del avión principal
        let posicionX, posicionY;
        const margen = 100; // Margen mínimo desde el avión principal

        // Determinar el lado en el que aparecerá el avión rival
        const lado = Math.random() > 0.5 ? 'izquierda' : 'derecha';
        if (lado === 'izquierda') {
            posicionX = -AVION_WIDTH;
            posicionY = Math.random() * marco.clientHeight;
        } else {
            posicionX = marco.clientWidth;
            posicionY = Math.random() * marco.clientHeight;
        }

        avionRival.style.left = `${posicionX}px`;
        avionRival.style.top = `${posicionY}px`;

        // Agregar el avión rival al marco y al array de aviones rivales
        marco.appendChild(avionRival);
        avionesRivales.push(avionRival);
    }

    // Función para crear varios aviones rivales al inicio
    function crearAvionesRivales() {
        for (let i = 0; i < numAvionesRivales; i++) {
            crearAvionRival();
        }
    }


    crearAvionesRivales(); // Llamar a la función para crear aviones rivales al cargar la página

    // Función para mover los aviones rivales hacia el avión principal
    function moverAvionesRivales() {
        avionesRivales.forEach(avionRival => {
            if (juegoActivo && !juegoPausado) {
                // Obtener la posición actual del avión principal
                const avionPrincipalRect = avion.getBoundingClientRect();
                const avionPrincipalX = avionPrincipalRect.left + avionPrincipalRect.width / -10;
                const avionPrincipalY = avionPrincipalRect.top + avionPrincipalRect.height / -10;

                // Obtener la posición actual del avión rival
                const avionRivalRect = avionRival.getBoundingClientRect();
                const avionRivalX = avionRivalRect.left + avionRivalRect.width / -10;
                const avionRivalY = avionRivalRect.top + avionRivalRect.height / -10;

                // Calcular la dirección hacia el avión principal
                const deltaX = avionPrincipalX - avionRivalX;
                const deltaY = avionPrincipalY - avionRivalY;
                const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const dirX = deltaX / distancia;
                const dirY = deltaY / distancia;

                // Calcular la nueva posición del avión rival
                let nuevaPosX = avionRival.offsetLeft + dirX * velocidadAviones;
                let nuevaPosY = avionRival.offsetTop + dirY * velocidadAviones;

                // Verificar si el avión rival ya está muy cerca del avión principal
                if (distancia < 5) {
                    nuevaPosX = avionPrincipalX - avionRivalRect.width / -10;
                    nuevaPosY = avionPrincipalY - avionRivalRect.height / -10;
                }

                // Mover el avión rival hacia el avión principal
                avionRival.style.left = `${nuevaPosX}px`;
                avionRival.style.top = `${nuevaPosY}px`;

                // Verificar colisión con el avión principal
                if (colision(avionRival, avion)) {
                    // Reducir la velocidad al chocar
                    velocidadAviones = 0.5; // Ejemplo: velocidad reducida al chocar
                    setTimeout(() => {
                        velocidadAviones = 0.5; // Volver a la velocidad normal después de un tiempo (ejemplo)
                    }, 1000); // Ejemplo: 1000 milisegundos (1 segundo)

                    finDelJuego();
                }
            }
        });
    }

    function dispararBala(direccion) {
        const bala = document.createElement('div');
        bala.className = 'bala';
    
        // Determinar la posición inicial de la bala según la dirección
        switch (direccion) {
            case 'arriba':
                bala.style.left = `${Math.max(0, Math.min(marco.offsetWidth - bala.offsetWidth, avion.offsetLeft + avion.offsetWidth / 2))}px`;
                bala.style.top = `${Math.max(0, avion.offsetTop)}px`;
                bala.movimientoVerticalArriba = 5; // Velocidad hacia arriba
                break;
            case 'abajo':
                bala.style.left = `${Math.max(0, Math.min(marco.offsetWidth - bala.offsetWidth, avion.offsetLeft + avion.offsetWidth / 2))}px`;
                bala.style.top = `${Math.max(0, Math.min(marco.offsetHeight - bala.offsetHeight, avion.offsetTop + avion.offsetHeight))}px`;
                bala.movimientoVertical = 5; // Velocidad hacia abajo
                break;
            case 'izquierda': // Añadir la dirección izquierda
                bala.style.left = `${Math.max(0, avion.offsetLeft)}px`; // Salida en la posición actual del avión
                bala.style.top = `${Math.max(0, avion.offsetTop + avion.offsetHeight / 2)}px`; // Centro vertical del avión
                bala.movimientoHorizontal = -5; // Velocidad hacia la izquierda
                break;
            case 'adelante':
            default:
                bala.style.left = `${Math.max(0, Math.min(marco.offsetWidth - bala.offsetWidth, avion.offsetLeft + avion.offsetWidth))}px`;
                bala.style.top = `${Math.max(0, Math.min(marco.offsetHeight - bala.offsetHeight, avion.offsetTop + avion.offsetHeight / 2))}px`;
                bala.movimientoHorizontal = 5; // Velocidad hacia adelante
                break;
        }
    
        // Reproducir el sonido de la bala
        sonidoBala.currentTime = 0; // Reiniciar el sonido si ya está sonando
        sonidoBala.play(); // Reproducir el sonido de la bala
    
        marco.appendChild(bala);
        balas.push(bala);
    }
    
// Función para disparar una bala desde el avión rival
function dispararBalaRival(avionRival) {
    // Crear un nuevo elemento bala
    const balaRival = document.createElement('div');
    balaRival.classList.add('bala-rival'); // Clase para la bala rival
    document.body.appendChild(balaRival);
    
    // Posición inicial de la bala, centrada en el avión rival
    balaRival.style.left = `${avionRival.offsetLeft + avionRival.offsetWidth / 2}px`;
    balaRival.style.top = `${avionRival.offsetTop + avionRival.offsetHeight}px`;
    
    // Añadir la bala a la lista de balas rivales
    balasRivales.push(balaRival);
}
function dispararBalasRivales() {
    avionesRivales.forEach(avionRival => {
        const balaRival = document.createElement('div');
        balaRival.className = 'bala-rival';

        // Posición inicial de la bala rival asegurando que está dentro del marco
        balaRival.style.left = `${Math.max(0, Math.min(marco.offsetWidth - balaRival.offsetWidth, avionRival.offsetLeft + avionRival.offsetWidth / 2))}px`;
        balaRival.style.top = `${Math.max(0, avionRival.offsetTop + avionRival.offsetHeight)}px`; // Debajo del avión rival

        // Velocidad de la bala hacia abajo
        balaRival.movimientoVertical = 5; // Velocidad hacia abajo

        marco.appendChild(balaRival);
        balasRivales.push(balaRival);
    });

    // Llamar a dispararBalasRivales cada 2 segundos (ajustable)
    setTimeout(dispararBalasRivales, 2000);
}

// Mover las balas de los aviones rivales
function moverBalasRivales() {
    for (let i = balasRivales.length - 1; i >= 0; i--) {
        const balaRival = balasRivales[i];
        
        // Mover la bala hacia abajo
        balaRival.style.top = `${balaRival.offsetTop + 5}px`; // Ajusta la velocidad de la bala

        // Verificar si la bala ha salido de la pantalla y eliminarla
        if (balaRival.offsetTop > window.innerHeight) {
            balaRival.remove();
            balasRivales.splice(i, 1);
        }

        // Verificar colisión con el avión principal
        if (colision(avion, balaRival)) {
            console.log('¡Te han disparado!');
            finDelJuego(); // Función para finalizar el juego cuando te golpean
        }
    }
}

// Llamar a la función moverBalasRivales en el ciclo de juego
setInterval(moverBalasRivales, 100); // Mover las balas rivales cada 100ms

    // Obtener los botones por sus IDs
    const btnA = document.getElementById('btnA');
    const btnS = document.getElementById('btnS');
    const btnW = document.getElementById('btnW');

    // Función para parpadear el botón dado su ID
    function parpadearBoton(id) {
    const boton = document.getElementById(id);
    if (boton) {
        boton.style.opacity = '0.5'; // Reducir la opacidad
        setTimeout(() => {
        boton.style.opacity = '1'; // Restaurar la opacidad original después de 200ms
        }, 200);
    }
    }

    // Evento para detectar la pulsación de teclas en todo el documento
    document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'a':
        parpadearBoton('btnA'); // Llamar a la función de parpadeo para el botón 'A'
        break;
        case 's':
        parpadearBoton('btnS'); // Llamar a la función de parpadeo para el botón 'S'
        break;
        case 'w':
        parpadearBoton('btnW'); // Llamar a la función de parpadeo para el botón 'W'
        break;
        default:
        break;
    }
    });

// Crear un intervalo para el disparo automático
// Función para iniciar el disparo automático
function iniciarDisparoAutomatico(direccion) {
    intervaloDisparo = setInterval(() => {
        dispararBala(direccion);
    }, 200); // Cada 200 ms
}

// Función para detener el disparo automático
function detenerDisparoAutomatico() {
    clearInterval(intervaloDisparo);
}

// Agregar eventos a los botones o teclas
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // Cambia a la tecla que prefieras para disparar
        iniciarDisparoAutomatico('adelante'); // Iniciar disparo automático
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ') { // Cambia a la tecla que prefieras para detener
        detenerDisparoAutomatico(); // Detener disparo automático
    }
});
// Función para mover las balas disparadas
function moverBalas() {
    balas.forEach(bala => {
        if (juegoActivo && !juegoPausado) {
            // Mover la bala hacia adelante si se disparó con la tecla 'A'
            if (bala.movimientoHorizontal) {
                bala.style.left = `${parseFloat(bala.style.left) + bala.movimientoHorizontal}px`;
            }

            // Mover la bala hacia abajo si se disparó con la tecla 'S'
            if (bala.movimientoVertical) {
                bala.style.top = `${parseFloat(bala.style.top) + bala.movimientoVertical}px`;
            }

            // Mover la bala hacia arriba si se disparó con la tecla 'W'
            if (bala.movimientoVerticalArriba) {
                bala.style.top = `${parseFloat(bala.style.top) - bala.movimientoVerticalArriba}px`;
            }

            // Eliminar la bala si sale del marco del juego
            if (parseFloat(bala.style.left) > marco.clientWidth ||
                parseFloat(bala.style.top) > marco.clientHeight ||
                parseFloat(bala.style.top) < 0) {
                bala.remove();
                balas = balas.filter(b => b !== bala); // Eliminar la bala del array de balas
            }
        }
    });
}

   // Función para verificar colisiones entre el avión principal y los aviones rivales
function verificarColisiones() {
    // Comprobar colisiones entre balas y aviones rivales
    for (let i = balas.length - 1; i >= 0; i--) {
        let bala = balas[i];

        for (let j = avionesRivales.length - 1; j >= 0; j--) {
            let avionRival = avionesRivales[j];

            if (colision(avionRival, bala)) {
                console.log('Colisión detectada entre:', bala, 'y', avionRival);
                bala.remove();
                balas.splice(i, 1);
                avionRival.remove();
                avionesRivales.splice(j, 1);

                aumentarPuntuacion(1);
                crearAvionRival(); // Reemplazar el avión rival destruido
                break;
            }
        }
    }

    // Comprobar colisiones entre el avión principal y los aviones rivales
    for (let avionRival of avionesRivales) {
        if (colision(avion, avionRival)) { // 'avion' debería ser tu avión principal
            console.log('Colisión detectada entre el avión principal y un avión rival:', avionRival);
            finDelJuego(); // Llama a la función para finalizar el juego
            break; // Salir del bucle si hay una colisión
        }
    }
}

    
    // Función para verificar colisión mejorada considerando la forma del avión
function colision(elemento1, elemento2) {
    const rect1 = elemento1.getBoundingClientRect();
    const rect2 = elemento2.getBoundingClientRect();

    // Definir un margen adicional para un mejor ajuste
    const margen = 10;

    // Ajustar las coordenadas del rectángulo de colisión para ser más precisas
    const left1 = rect1.left + margen;
    const right1 = rect1.right - margen;
    const top1 = rect1.top + margen;
    const bottom1 = rect1.bottom - margen;

    const left2 = rect2.left + margen;
    const right2 = rect2.right - margen;
    const top2 = rect2.top + margen;
    const bottom2 = rect2.bottom - margen;

    // Comprobar si hay intersección
    return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
}

// Función para terminar el juego
function finDelJuego() {
    juegoActivo = false;
    alert(`¡¡Game Over!: ${puntuacion}`);
    location.reload(); // Recargar la página para reiniciar el juego
}

// Función para iniciar el juego
function iniciarJuego() {
    if (juegoActivo) return; // Prevenir múltiples inicios
    juegoActivo = true;
    puntuacion = 0;
    velocidadAviones = 1; // Reiniciar la velocidad de los aviones rivales

    // Ocultar el botón de iniciar
    btnIniciar.style.display = 'none';

    // Limpiar aviones rivales y balas existentes
    avionesRivales.forEach(avionRival => avionRival.remove());
    avionesRivales = [];
    balas.forEach(bala => bala.remove());
    balas = [];
    balasRivales.forEach(balaRival => balaRival.remove()); // Limpiar balas rivales
    balasRivales = []; // Reiniciar el array de balas rivales

    // Reproducir música de fondo
    reproducirMusicaFondo();

    // Reproducir sonido del avión
    sonidoAvion.play(); // Reproduce el sonido del avión

    // Crear aviones rivales iniciales
    crearAvionesRivales();
    setInterval(moverAvionesRivales, 1500); // Mover aviones rivales cada 1500ms
    setInterval(moverBalas, 100); // Mover balas del avión principal cada 100ms
    setInterval(moverBalasRivales, 100); // Mover balas rivales cada 100ms
    setInterval(verificarColisiones, 300); // Verificar colisiones cada 300ms

    // Iniciar el disparo de balas de los aviones rivales
    dispararBalasRivales(); // Llama a la función que hace que los rivales disparen

    // Iniciar el ciclo de actualización del juego
    requestAnimationFrame(actualizarJuego);

    // Añadir el evento de teclado para disparar
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'a': // Tecla 'A' para disparar hacia la izquierda
                avion.classList.add('avion-izquierda'); // Aplica la clase para girar a la izquierda
                dispararBala('izquierda');
                break;
            // Otros casos para otras teclas...
        }
    });

    // También puedes eliminar la clase al soltar la tecla
    document.addEventListener('keyup', (event) => {
        if (event.key === 'a') {
            avion.classList.remove('avion-izquierda'); // Quitar la clase al soltar la tecla
        }
    });
}

// Función para pausar el juego
function pausarJuego() {
    if (juegoActivo && !juegoPausado) {
        juegoPausado = true;
        btnPausar.style.display = 'none'; // Ocultar botón de pausar
        btnReanudar.style.display = 'inline'; // Mostrar botón de reanudar
        
        sonidoAvion.pause(); // Detiene el sonido del avión
    }
    musicaFondo.pause();
}

// Función para reanudar el juego
function reanudarJuego() {
    if (juegoActivo && juegoPausado) {
        juegoPausado = false;
        btnPausar.style.display = 'inline'; // Mostrar botón de pausar
        btnReanudar.style.display = 'none'; // Ocultar botón de reanudar

        sonidoAvion.play(); // Reanuda el sonido del avión
        requestAnimationFrame(actualizarJuego); // Continuar el ciclo de actualización
    }
    musicaFondo.play();
}

// Función para actualizar el juego en cada frame
function actualizarJuego() {
    if (juegoActivo && !juegoPausado) {
        moverAvionesRivales();
        moverBalas();
        verificarColisiones();

        // Continuar el ciclo de actualización
        requestAnimationFrame(actualizarJuego);
    }
}
// Añadir eventos a los botones
btnIniciar.addEventListener('click', () => {
    parpadearBoton('btnIniciar');
    iniciarJuego();
});

btnPausar.addEventListener('click', () => {
    parpadearBoton('pausarBtn');
    pausarJuego();
});

btnReanudar.addEventListener('click', () => {
    parpadearBoton('reanudarBtn');
    reanudarJuego();
});

function moverTimon(event) {
    const movHorizontal = 50; // Cantidad de píxeles a mover horizontalmente
    const limiteIzquierdo = 0; // Límite izquierdo del marco
    const limiteDerecho = marco.clientWidth - AVION_WIDTH; // Límite derecho del marco

    switch (event.key) {
        case 'ArrowLeft':
            // Mover hacia la izquierda
            avionX -= movHorizontal;
            if (avionX < limiteIzquierdo) {
                avionX = limiteIzquierdo; // No dejar que el avión pase del límite izquierdo
            }
            avion.style.transform = 'scaleX(-1)'; // Girar el avión hacia la izquierda
            break;
        case 'ArrowRight':
            // Mover hacia la derecha
            avionX += movHorizontal;
            if (avionX > limiteDerecho) {
                avionX = limiteDerecho; // No dejar que el avión pase del límite derecho
            }
            avion.style.transform = 'scaleX(1)'; // Girar el avión hacia la derecha
            break;
        default:
            break;
    }

    // Actualizar la posición del avión
    avion.style.left = `${avionX}px`;
}

// Evento para manejar el movimiento del timón con las teclas de flecha
document.addEventListener('keydown', moverTimon);


// Llamar a la función para mover los aviones rivales y las balas continuamente
function juegoLoop() {
    if (juegoActivo) {
        moverAvionesRivales();
        moverBalas();
        requestAnimationFrame(juegoLoop);
    }
}

// Iniciar el bucle del juego
juegoLoop();

    // Función para comprobar la colisión entre dos elementos
    function colision(elemento1, elemento2) {
        const rect1 = elemento1.getBoundingClientRect();
        const rect2 = elemento2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    // Evento para el botón de pausar
    document.getElementById('pausarBtn').addEventListener('click', () => {
        if (!juegoPausado) {
            juegoPausado = true;
            avionesRivales.forEach(avionRival => {
                avionRival.style.animationPlayState = 'paused'; // Pausar la animación de los aviones rivales
            });
            avion.style.animationPlayState = 'paused'; // Pausar la animación del avión del jugador
        }
    });

    // Evento para el botón de reanudar
    document.getElementById('reanudarBtn').addEventListener('click', () => {
        if (juegoPausado) {
            juegoPausado = false;
            avionesRivales.forEach(avionRival => {
                avionRival.style.animationPlayState = 'running'; // Reanudar la animación de los aviones rivales
            });
            avion.style.animationPlayState = 'running'; // Reanudar la animación del avión del jugador
            juego(); // Llamar a la función juego para continuar el juego desde donde se dejó
        }
    });
    function aumentarPuntuacion(puntos) {
        puntuacion += puntos;
    
        // Verificar la puntuación y aumentar el número de aviones
        if (puntuacion >= 20 && (puntuacion - 20) % 20 === 0) {
            cantidadAviones += 4; // Aumentar 4 aviones por cada 20 puntos después de 20
            crearAvionesRivales(); // Crear nuevos aviones rivales
        }
    
        // Si es la primera vez que se alcanza 20 puntos, asegúrate de iniciar con 3 aviones
        if (puntuacion >= 10 && cantidadAviones == 0) {
            cantidadAviones = 3; // Establecer 3 aviones iniciales
            crearAvionesRivales(); // Crear aviones rivales
        }
    
        // Actualizar visualmente la puntuación, si es necesario
        // ejemploPuntuacion.innerText = `Puntuación: ${puntuacion}`;
    }
    
    
    
    // Asegúrate de llamar a aumentarPuntuacion en el lugar correspondiente de tu juego
    // Función principal para el juego
    function juego() {
        if (juegoActivo && !juegoPausado) {
            moverAvionesRivales();
            moverBalas();
            verificarColisiones();
            requestAnimationFrame(juego); // Continuar el ciclo del juego
        }
    }

    juego(); // Iniciar el juego

    document.addEventListener('keydown', event => {
        if (!juegoPausado) {
            switch (event.key) {
                case 'ArrowUp':
                    avionY -= 14;  // Aumentar la velocidad vertical hacia arriba
                    timon.style.transform = 'rotate(-15deg)';
                    break;
                case 'ArrowDown':
                    avionY += 14;  // Aumentar la velocidad vertical hacia abajo
                    timon.style.transform = 'rotate(15deg)';
                    break;
                case 'ArrowLeft':
                    avionX -= 10;  // Aumentar la velocidad horizontal hacia la izquierda
                    timon.style.transform = 'rotate(-30deg)';
                    break;
                case 'ArrowRight':
                    avionX += 10;  // Aumentar la velocidad horizontal hacia la derecha
                    timon.style.transform = 'rotate(30deg)';
                    break;
                case 'a':
                    dispararBala('adelante'); // Disparar bala hacia adelante
                    break;
                case 's':
                    dispararBala('abajo'); // Disparar bala hacia abajo
                    break;
                case 'w':
                    dispararBala('arriba'); // Disparar bala hacia arriba
                    break;
            }
    
            // Actualizar la posición del avión del jugador
            avion.style.left = `${avionX}px`;
            avion.style.top = `${avionY}px`;
        }
    });

    // Restaurar la posición del timón cuando se suelta la tecla
    document.addEventListener('keyup', event => {
        if (!juegoPausado && event.key.includes('Arrow')) {
            timon.style.transform = 'rotate(0deg)'; // Restaurar la posición normal del timón
        }
    });

    // Evento para disparar una bala al presionar la tecla 'Space'
    document.addEventListener('keyup', event => {
        if (!juegoPausado && event.key.includes('Arrow')) {
            timon.style.transform = 'rotate(0deg)'; // Restaurar la posición normal del timón
        }
    });

    // Variables para almacenar las posiciones táctiles iniciales
    let touchStartX = 0;
    let touchStartY = 0;

    // Manejador de eventos para iniciar el movimiento con un toque
    document.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            // Obtener la posición inicial del toque
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
    });

    // Manejador de eventos para mover el avión y disparar balas con un deslizamiento
    document.addEventListener('touchmove', event => {
        document.addEventListener('touchmove', moverTimon);
        if (!juegoPausado) {
            // Obtener la posición actual del toque
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;

            // Calcular la diferencia entre la posición inicial y actual
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Mover el avión según la dirección del deslizamiento
            avionX += deltaX / 10; // Ajustar la velocidad de movimiento
            avionY += deltaY / 10; // Ajustar la velocidad de movimiento

            // Actualizar la posición del avión del jugador
            avion.style.left = `${avionX}px`;
            avion.style.top = `${avionY}px`;

            // Actualizar la posición inicial del toque para el próximo movimiento
            touchStartX = touchX;
            touchStartY = touchY;

            event.preventDefault(); // Prevenir el desplazamiento predeterminado de la página
        }
    });


    // Manejador de eventos para finalizar el movimiento
    document.addEventListener('touchend', event => {
        // Restaurar la posición inicial del timón al finalizar el toque (opcional)
        // timon.style.transform = 'translate(0, 0)';
    });

    // Función para disparar balas al tocar los botones A, S, W
    btnA.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('adelante');
            parpadearBoton('btnA');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });


    btnS.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('abajo');
            parpadearBoton('btnS');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });

    btnW.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('arriba');
            parpadearBoton('btnW');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });
    // Manejador de eventos para mover el timón con un deslizamiento táctil (opcional)
    document.addEventListener('touchmove', event => {
        if (!juegoPausado) {
            // Obtener la posición actual del toque
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;

            // Calcular la diferencia entre la posición inicial y actual
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Calcular el ángulo de rotación del timón
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Aplicar la rotación al timón (ajusta según tu diseño)
            timon.style.transform = `rotate(${angle}deg)`;

            // Actualizar la posición inicial del toque para el próximo movimiento
            touchStartX = touchX;
            touchStartY = touchY;

            event.preventDefault(); // Prevenir el desplazamiento predeterminado de la página
        }
        // Supongamos que tienes una función para mover el avión
// Función para mover el avión
function moverAvion(direccion) {
    const step = 10; // Cambia este valor para ajustar la velocidad de movimiento
    const top = parseInt(avion.style.top) || 0; // Obtener posición actual o 0
    const left = parseInt(avion.style.left) || 0; // Obtener posición actual o 0

    switch (direccion) {
        case 'arriba':
            avion.style.top = (top - step) + 'px';
            break;
        case 'abajo':
            avion.style.top = (top + step) + 'px';
            break;
        case 'izquierda':
            avion.style.left = (left - step) + 'px';
            break;
        case 'derecha':
            avion.style.left = (left + step) + 'px';
            break;
    }
}

// Función para hacer parpadear un botón
function parpadear(btn) {
    btn.classList.add('blink');
    setTimeout(() => {
        btn.classList.remove('blink');
    }, 500); // Duración del parpadeo
}

// Asignar eventos a los botones con parpadeo
document.getElementById('btnArriba').addEventListener('click', () => {
    moverAvion('arriba');
    parpadear(document.getElementById('btnArriba'));
});
document.getElementById('btnAbajo').addEventListener('click', () => {
    moverAvion('abajo');
    parpadear(document.getElementById('btnAbajo'));
});
document.getElementById('btnIzquierda').addEventListener('click', () => {
    moverAvion('izquierda');
    parpadear(document.getElementById('btnIzquierda'));
});
document.getElementById('btnDerecha').addEventListener('click', () => {
    moverAvion('derecha');
    parpadear(document.getElementById('btnDerecha'));
});

        
    });
