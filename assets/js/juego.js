let deck = [];

const crearDeck = () => {

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

};

// Creamos el deck aguevo y lo barajiyamos
crearDeck();
deck = _.shuffle(deck);

// Pedir la carta y eliminarla
const pedirCarta = () => {
    //Esta vaina nunca se va a usar porque se resetea el deck :u
    if(deck.length === 0 ){
        throw 'Ya no hay cartas en el deck carnal';
    }

    const carta = deck.pop();

    return carta;
}

// Generar el valor de las cartas
const valorCarta = (carta) => {

    //Deja los valores de 0 a length de la carta -1, ignorando el ultimo caracter
    const valor = carta.substring(0, carta.length - 1);

    //Si el valor es no numerico se evalua si es A, en ese caso es 11, sino es 10
    // y si es numerico vale su numero
    return (isNaN(valor)) ? 
            (valor == 'A') ? 11 : 10
            : valor * 1;
}

//Referencias
const btnPedir = document.querySelector('#btnPedir');
const btnNuevo= document.querySelector('#btnNuevo');
const btnDetener= document.querySelector('#btnDetener');
const puntosSmall = document.querySelectorAll('small');
const puntosSpan = document.querySelectorAll('h1 span');
const divCartas = document.querySelectorAll('.jugador-cartas');

//Puntos jugador y computadora y que deje de dar cartas
let puntosJugador = 0,
    puntosComputadora = 0,
    puntosGaneJugador = 0,
    puntosGaneComputadora = 0,
    puntosLado = 0,
    primerCartaComputadora = true,
    ganadorJugador = 'nada',
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
    
}
//Actualiza los puntos de la partida
function mostarPuntosPartida(jugador) {
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
    if (puntosJugador > puntosComputadora || puntosComputadora > 21) {
        mostarPuntosPartida(true);
        ganadorJugador = 'ganar';
        btnPedir.disabled = true;
        // Si pierde tira esta alerta notificando que se perdio la partida
        Swal.fire({
            title: 'Ganaste :D',
            imageUrl: 'https://media.giphy.com/media/fqtUWqYAqKixIrOXs9/giphy-downsized-large.gif?cid=ecf05e47jljnnq4a4jcb8get0iihm5hcz94jd2bqtp3o9pxm&rid=giphy-downsized-large.gif&ct=g',
            background: '#000',
            imageAlt: 'A tall image'
        });
    } else if (puntosJugador == puntosComputadora) {
        ganadorJugador = 'nada';
        btnPedir.disabled = true;
        // Si pierde tira esta alerta notificando que se perdio la partida
        Swal.fire({
            title: 'Empataste :u',
            imageUrl: 'https://media.giphy.com/media/BSBrMst3JbwRTP04Ce/giphy.gif?cid=ecf05e47ewcqwbez7dxqifz53udymwta4euux354n8t175tk&rid=giphy.gif&ct=g',
            background: '#000',
            imageAlt: 'A tall image'
        });
    } else if (puntosJugador >= 21 || puntosJugador < puntosComputadora) {        
        mostarPuntosPartida(false);
        ganadorJugador = 'perder';
        btnPedir.disabled = true;
        // Si pierde tira esta alerta notificando que se perdio la partida
        Swal.fire({
            title: 'Perdiste :(',
            imageUrl: 'https://media.giphy.com/media/TGMBfijgHh5FzsR1fT/giphy.gif?cid=ecf05e47wir9wp7201yq9b80g4ncg0zqepi4d47u8c74psqv&rid=giphy.gif&ct=g',
            background: '#000',
            imageAlt: 'A tall image'
        });
    }


};

//Eventos
//Pide cartas aleatorias mientras queria seguir o no se pase o sea igual de 21 
btnPedir.addEventListener('click',(estado) =>{
    ponerCarta(0)
    if(puntosJugador == 21){
        btnPedir.disabled = true;
    }else if(puntosJugador >= 21){
        mostrarCartaEscondida(); 
        mostarPuntosPartida(false);
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        // Si pierde tira esta alerta notificando que se perdio la partida
        Swal.fire({ title: 'Perdiste :(',
                    customclass: 'swal-custom',
                    imageUrl: 'https://media.giphy.com/media/TGMBfijgHh5FzsR1fT/giphy.gif?cid=ecf05e47wir9wp7201yq9b80g4ncg0zqepi4d47u8c74psqv&rid=giphy.gif&ct=g',
                    background: '#000',
                    imageAlt: 'A tall image'});
    }
});

//Muestra la carta escondida
const mostrarCartaEscondida = () => {
    const cartaEscondidaVista = document.querySelector('.carta-escondida');
    //cartaEscondida[0] = la imagen de la carta
    cartaEscondidaVista.src = (`assets/cartas/${cartaEscondida[0]}.png`);
    // y le suma los puntos
    //cartaEscondida[1] = al valor de la carta
    puntosComputadora = puntosComputadora + cartaEscondida[1];
    puntosSmall[1].innerText = `- ${puntosComputadora}`;
};

//Cuando se detiene la computadora pide cartas mientras no se pase de 21
btnDetener.addEventListener('click', () =>{
    //Muestra la carta escondida
    mostrarCartaEscondida(); 
    //DA cartas si los puntos ocmputadora son menos que el jugador y si los de la maquina son menores a 21
    while((puntosComputadora < puntosJugador) && (puntosComputadora < 21)){
        ponerCarta(1);
    };
    // Verificamos si gano la maquina o el humano, y desahabilitamos el boton detener
    verificarGanador();
    btnDetener.disabled = true;
});

//Crear Juego
btnNuevo.addEventListener('click', () =>{
    //Reseteamos puntos del small
    puntosJugador = 0;
    puntosComputadora = 0;
    
    //Resteamos el HTML de las imagenes de cartas 
    for(let i = 0; i < 2; i++){
        divCartas[i].innerHTML = "";
        puntosSmall[i].innerHTML = 0;
    }   
    //Resteamos el array, lo re-creamos y barajeamos
    deck = []
    crearDeck();
    deck = _.shuffle(deck);

    //Reseteamos la variable que oculta carta
    primerCartaComputadora = true;

    // // Deberia retarasar que se llame la funcion para poner las cartas
    // // Pero naa :(
    // // const delayPonerCarta = () =>{
    //     // setTimeout(function(){ponerCarta(0);ponerCarta(1)},95);
    // // };

    //Ponemos 2 cartas en cada lado
    let romper = 0
    while(true){
        //manda a llamar poner las cartas y les hace delay para que tarde un poco en aparecer
        // // al menos deberia pero naa
        // // delayPonerCarta()
        ponerCarta(0);
        ponerCarta(1);
        //Si se pusieron las 2 cartas se rompe el ciclo
        romper++;
        if(romper >= 2){
            break
        }
    }
    //Bloquea el boton de pedir puntos si este saco puntos >= 21
    btnDetener.disabled = false;
    const bloquearBotonPedir =  (puntosJugador >= 21) ? btnPedir.disabled = true : 
                                                        btnPedir.disabled = false;
    //Resetamos la variable de ganadorJugador
    ganadorJugador = 'nada';
});