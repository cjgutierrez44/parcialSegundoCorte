const url = "./data.json"
const url2 = "./answers.json"

const questions = document.getElementById("questions");
const btnCalificar = document.getElementById("calificar");
const btnReiniciar= document.getElementById("reiniciar");
const btnMostrarRespuestas = document.getElementById("verRespuestas");
const espacioNota =  document.getElementById("espacioNota");
const answersCard =  document.getElementById("answers");
let numQuestions = 0;

btnCalificar.addEventListener("click", calificar);
btnReiniciar.addEventListener("click", reiniciar);
btnMostrarRespuestas.addEventListener("click", mostrarRespuestas);

let calificado = false;

fetch(url).then(response => {
    return response.json();
}).then(data=>{
    let id = 1;
    numQuestions =  data[0].questions.length;
    data[0].questions.forEach(element => {
        cardQuestion(id, element.question,element.info,element.options);
        let numPregunta = 1;
        element.options.forEach(option =>{
            let op = document.getElementById(`Pregunta${id}Opcion${numPregunta}`);
            op.addEventListener("click", function(e){marcar(e,)});
            numPregunta++;
        })
        id++;

    });
})


function cardQuestion(id, question, info, options){
    const card = document.createElement("div");
    card.classList.add("card", "mb-2", "border", "border-warning", "border-3");
    cardContent = `
    <div class="card-header">${question}</div>
    <div class="card-body">
    <p class="card-text">
    ${info}
    </p>
    <p class="card-text">
    <ul>`;
    let numPregunta = 1;
    options.forEach(option => {
        cardContent += `
        <li id="Pregunta${id}Opcion${numPregunta}" class="Pregunta${id}">
        ${option}
        </li>`;
        numPregunta++;
    })
    cardContent += `</ul>
    </p>
    </div>
    `;
    card.innerHTML = cardContent;
    questions.appendChild(card);
}

function marcar(e,pregunta){
    if (!calificado) {
        const li = document.getElementById(""+e.srcElement.id+"");
        const options = document.getElementsByClassName(li.classList[0]);
        for (let option of options) {
            option.classList.remove("selected", "border", "p-1", "border-1", "border-primary", "bg-dark", "text-light");
        //option.classList.remove("selected");
        }
        li.classList.add("selected", "border", "p-1", "border-1", "border-primary", "bg-dark", "text-light");
    }


}
var respuestas = [];
function calificar(e){
    const marcadas = document.getElementsByClassName("selected");
    let textAlert = "";
    if (marcadas.length < numQuestions) {
        textAlert = "Aun no ha terminado de contestar todas las preguntas";
    }else{
        textAlert = "Despues de esto no podrá modificar sus respuestas";
    }
    Swal.fire({
      title: 'Está seguro de enviar para calificar?',
      text: textAlert,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(60, 242, 129, 0.9)',
      cancelButtonColor: 'rgba(228, 76, 85, 0.9)',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      calificado = true;
      btnCalificar.disabled = true;
      let calificacion = 0;
      respuestas =  fetch(url2).then(response => {
        return response.json()
    }).then(data=>{
        respuestas = data[0].answersKey; 
        for(let i = 1; i <= numQuestions; i++){
            const options = document.getElementsByClassName("Pregunta"+i);
            for(let op of options){
                if(op.classList.contains("selected") ){
                    if(op.id == "Pregunta" + i + "Opcion" + respuestas["question"+i] ){
                        calificacion++;
                    }
                }
            }
        }
        espacioNota.classList.remove("d-none")
        btnMostrarRespuestas.classList.remove("d-none")
        espacioNota.innerHTML = `<h2>Calificación: <span class="text-secondary fw-bold">${calificacion}</span><h2>`
    });
}else{
    return null;
}
})

}



function reiniciar(e){
    const marcadas = document.getElementsByTagName("li")
    for (let option of marcadas) {
        option.classList.remove("selected", "border", "p-1", "border-1", "border-primary", "bg-dark", "text-light");
    }
    espacioNota.classList.add("d-none");
    calificado = false;
    btnCalificar.disabled = false;
    answersCard.parentElement.classList.add("d-none");
    btnMostrarRespuestas.classList.add("d-none")
}


function mostrarRespuestas(e) {
    answersCard.parentElement.classList.remove("d-none");
    answersCard.innerHTML = "";
    btnCalificar.disabled = true;
    calificado = true;
    fetch(url2).then(response => {
        return response.json()
    }).then(data => {
        const answers = data[0].answersKey;
        for (answer in answers){
            const p = document.createElement("p");
            p.classList.add("card-text", "fw-bold");
            p.innerHTML = `${answer}: <span class="text-light ">${answers[answer]}</span>`;
            answersCard.appendChild(p);
        }

    });
}

