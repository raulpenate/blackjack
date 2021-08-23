(() => {

let deck = [];

const crearJuego = () => {
    //Reseteamos todo lo necesario para salvar esta compania :u 
    reseteandoJuego();
    //Creacion del deck
    deck = crearDeck();
    //Ponemos las cartas
    ponerCartasAmbosLados();
    //Bloquea el boton de pedir puntos si este saco puntos >= 21
    autobloqueoBotonPedir();
};

const reseteandoJuego = () =>{
    reseteandoPuntos();
    reseteandoImagenes();
    resetLadoyCartaOculta();
};

const reseteandoImagenes = () => {
    for (let i = 0; i < 2; i++) {
        divCartas[i].innerHTML = "";
        puntosSmall[i].innerHTML = 0;
    }
};

const reseteandoPuntos = () => {
    puntosJugador = 0;
    puntosComputadora = 0;
    //Resteamos el HTML de las imagenes de cartas 
};

const resetLadoyCartaOculta = () => {
    primerCartaComputadora = true;
    //Resetamos la variable de ganadorJugador
    ganadorJugador = 'nada';
};

const autobloqueoBotonPedir = () => {
    btnDetener.disabled = false;
    //Si saca un mano mayor o igual a 21 se autobloquea 
    const bloquearBotonPedir = (puntosJugador >= 21) ? btnPedir.disabled = true :
        btnPedir.disabled = false;
};

const bloquearBtnPedir = (resultado) => {
    btnPedir.disabled = true;
};

const bloquearBtnDetener= (resultado) => {
    btnDetener.disabled = true;
}

const ponerCartasAmbosLados = () =>{    
    //Ponemos 2 cartas en cada lado
    let romper = 0
    while(true){
        ponerCarta(0);
        ponerCarta(1);
        //Si se pusieron las 2 cartas se rompe el ciclo
        romper++;
        if(romper >= 2){
            break
        }
    };
};

const alertaDeResultado = (resultado, imagen) => {
    mostrarPuntosPartida(resultado);
    bloquearBtnDetener();
    bloquearBtnPedir();
    //Determina que mensaje tirar
    let mensaje = '';
    const mensajeTitulo =   ( resultado == true ) ? mensaje = 'Ganaste :D' :
                            ( resultado == false ) ? mensaje = 'Perdiste :('  : mensaje = 'Empate :u' ;
    // Si pierde tira esta alerta notificando lo que paso en la partida 
    Swal.fire({
        title: mensaje,
        imageUrl: imagen,
        background: '#000',
        imageAlt: 'A tall image'
    });
};

const crearDeck = () => {
    deck = [];
    //Los palos de los naipes
    const palos = ['S', 'C', 'H', 'D'];

    // Itera las 13 cartas que hay en los naipes * los 4 tipos de palos
    for (let i = 1; i <= 13; i++) {

        //Los tipos de figuras
        const figura =  (i == 1)  ? 'A' :
                        (i == 11) ? 'J' :
                        (i == 12) ? 'Q' :
                        (i == 13) ? 'K' : i ;

        //Union de la figura con el palo
        for (let palo of palos) {
            deck.push(`${figura}${palo}`);
        }
    }
    //Retornamos el deck barajeado
    return _.shuffle(deck);
};

// Pedir la carta y eliminarla
const pedirCarta = () => {
    //Esta vaina nunca se va a usar porque se resetea el deck :u
    if(deck.length === 0 ){
        throw 'Ya no hay cartas en el deck carnal';
    }
    return deck.pop(); 
};

// Generar el valor de las cartas
const valorCarta = (carta) => {
    //Deja los valores de 0 a length de la carta -1, ignorando el ultimo caracter
    const valor = carta.substring(0, carta.length - 1);

    //Si el valor es no numerico se evalua si es A, en ese caso es 11, sino es 10
    // y si es numerico vale su numero
    return (isNaN(valor)) ? 
            (valor == 'A') ? 11 : 10
            : valor * 1;
};

//Referencias
const   btnPedir = document.querySelector('#btnPedir'),
        btnNuevo= document.querySelector('#btnNuevo'),
        btnDetener= document.querySelector('#btnDetener'),
        puntosSmall = document.querySelectorAll('small'),
        puntosSpan = document.querySelectorAll('h1 span'),
        divCartas = document.querySelectorAll('.jugador-cartas');

//Puntos jugador y computadora y que deje de dar cartas
let puntosJugador = 0,
    puntosComputadora = 0,
    puntosGaneJugador = 0,
    puntosGaneComputadora = 0,
    puntosLado = 0,
    primerCartaComputadora = true,
    cartaEscondida = [];

//Juega
const ponerCarta= (jugador) => {
    // Segun el indice dle jugador es, Humano = 0 , maquina = 1
    //Extraer carta del maso
    const carta = pedirCarta();

    //Depende si es el humano o la computadora, a ese se le agregan
    const sumarPuntos = jugador == 0 ? 
                        puntosJugador     = puntosJugador + valorCarta(carta) : 
                        primerCartaComputadora == true ? puntosComputadora = puntosComputadora :
                        puntosComputadora = puntosComputadora + valorCarta(carta);

    //Ahora se agrega al small
    const mostrarPuntos = jugador == 0 ?
                        puntosSmall[jugador].innerHTML =  `- ${puntosJugador}`:
                        puntosSmall[jugador].innerHTML =  `- ${puntosComputadora}`;

    //Poner carta en la mesa
    const cartaVista = document.createElement('img');
    divCartas[jugador].append(cartaVista);
    cartaVista.classList.add('carta');
    const voltearCarta = (jugador == 1 && primerCartaComputadora == true ) ? 
                        //Agregar la primera carta volteada y guarda sus valores en un array                    
                        (cartaVista.src = (`assets/cartas/red_back.png`),
                        cartaVista.classList.add('carta-escondida'),
                        primerCartaComputadora = false, 
                        cartaEscondida = [carta,valorCarta(carta)]) : 
                        //Se muestra la carta que se hizo pop
                        cartaVista.src = (`assets/cartas/${carta}.png`); 
    
};

//Actualiza los puntos de la partida
const mostrarPuntosPartida = (jugador) => {
    if(jugador){
        puntosGaneJugador++;
        puntosSpan[0].innerHTML = puntosGaneJugador;
    }else{
        puntosGaneComputadora++
        puntosSpan[1].innerHTML = puntosGaneComputadora;
    }
};

// Verifica si hubo primero ganador, segundo un empate y de ultimo un perderdedor
const verificarGanador = () => {
    //Si puntosjugador > 21 o puntos jugador < puntoscomputadora
    if (puntosJugador > 21) {      
        alertaDeResultado(false,'https://media.giphy.com/media/TGMBfijgHh5FzsR1fT/giphy.gif?cid=ecf05e47wir9wp7201yq9b80g4ncg0zqepi4d47u8c74psqv&rid=giphy.gif&ct=g');
    }
    //SI puntos del jugador mayores al de la computadora o computadora mayor a 21
    else if (puntosComputadora > 21) {
        alertaDeResultado(true,'https://media.giphy.com/media/fqtUWqYAqKixIrOXs9/giphy-downsized-large.gif?cid=ecf05e47jljnnq4a4jcb8get0iihm5hcz94jd2bqtp3o9pxm&rid=giphy-downsized-large.gif&ct=g');
    }
    else if (puntosJugador > puntosComputadora) {      
        alertaDeResultado(true,'https://media.giphy.com/media/TGMBfijgHh5FzsR1fT/giphy.gif?cid=ecf05e47wir9wp7201yq9b80g4ncg0zqepi4d47u8c74psqv&rid=giphy.gif&ct=g');
    }
    else if (puntosJugador < puntosComputadora) {
        alertaDeResultado(false,'https://media.giphy.com/media/TGMBfijgHh5FzsR1fT/giphy.gif?cid=ecf05e47wir9wp7201yq9b80g4ncg0zqepi4d47u8c74psqv&rid=giphy.gif&ct=g');
    } 
    // Si puntos jugador iguales a puntos computadora
    else if (puntosJugador == puntosComputadora) {
        alertaDeResultado(null,'https://media.giphy.com/media/BSBrMst3JbwRTP04Ce/giphy.gif?cid=ecf05e47ewcqwbez7dxqifz53udymwta4euux354n8t175tk&rid=giphy.gif&ct=g');
    } 
};

const turnoJugador = () => {
    if( puntosJugador < 21 ){
        ponerCarta(0);
        if( puntosJugador > 21 ){
            mostrarCartaEscondida();
            verificarGanador();
        }else if( puntosJugador == 21 ){
            bloquearBtnPedir();
        };
    }else{
        mostrarCartaEscondida();
        verificarGanador();
    };
};

//Eventos
//Pide cartas aleatorias mientras queria seguir o no se pase o sea igual de 21 
btnPedir.addEventListener('click',(estado) =>{
    turnoJugador();
});

const mostrarCartaEscondida = () => {
    const cartaEscondidaVista = document.querySelector('.carta-escondida');
    //cartaEscondida[0] = la imagen de la carta
    cartaEscondidaVista.src = (`assets/cartas/${cartaEscondida[0]}.png`);
    // y le suma los puntos
    //cartaEscondida[1] = al valor de la carta
    puntosComputadora = puntosComputadora + cartaEscondida[1];
    puntosSmall[1].innerText = `- ${puntosComputadora}`;
};

const turnoComputadora = () => {
    mostrarCartaEscondida();
    //DA cartas si los puntos compu son menos que el jugador y si los de la maquina son menores a 21
    while ((puntosComputadora < puntosJugador) && puntosComputadora < 21) {
        ponerCarta(1);
    };
    // Verificamos si gano la maquina o el humano, y desahabilitamos los botones 
    verificarGanador();
    // Bloquea ambos botones
    bloquearBtnPedir();
    bloquearBtnDetener();
};

//Cuando se detiene la computadora pide cartas mientras no se pase de 21
btnDetener.addEventListener('click', () =>{
    turnoComputadora();
});

//Crear Juego
btnNuevo.addEventListener('click', () =>{
    //Reseteamos puntos del small
    crearJuego();
});

})();