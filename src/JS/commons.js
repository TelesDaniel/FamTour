//metodo que filtra nossos dados por uma determinada palavra-chave, essa palavra-chave é buscada em titulos, descricoes, endereco 
//searchText - palavra-chave
//orderBy - objeto para ordenacao do resultado (se nao informado, sera ordenado por id)
//ex: {'field':'preco', 'order':'ASC'}
function searchInData(searchText, orderBy) {

    //buscando todos os dados
    const values = getJson();

    //filtrando os dados
    let result = values["atividades"].filter((atividade) => {

        let r = atividade["titulo"].toLowerCase().search(searchText.toLowerCase());

        if(r > -1)
            return atividade;

        r = atividade["descricao"].toLowerCase().search(searchText.toLowerCase());
        if(r > -1)
            return atividade;

        r = atividade["endereco_uf"].toLowerCase().search(searchText.toLowerCase());
        if(r > -1)
            return atividade;
    });

    //verificando a existencia de uma ordenacao
    if(orderBy){

        //ordenando
        result.sort((a, b) => {
            switch(orderBy.field) {
                case "preco":
                    if(orderBy.order == "ASC")
                        return (a.preco > b.preco) ? 1 : -1;
                    else 
                        return (a.preco < b.preco) ? 1 : -1;
            }

            return 0;
        })
    }else
        result.sort((a, b) => (a.id > b.id) ? 1 : -1);
    
    return result;
}

function searchPage(searchText) {
    location.href = './pages/atividades/list/search_result.html' + '?search=' + searchText
}

function mountCardByFilter(searchText, orderBy) {

    cards = document.getElementById('cards-container');
    while (cards.firstChild) {
        cards.removeChild(cards.lastChild);
    }

    let atividades = searchInData(searchText, orderBy)
    if(atividades.length <= 0){
        notfound = document.createElement("h3");
        notfound.innerText = "404 - Nenhum resultado encontrado ;("
        cards.appendChild(notfound)
    }

    for(i in atividades){
        mountCard(atividades[i])
    }
}


function mountCard(atividade) {

    cards = document.getElementById('cards-container');
    let card = document.createElement("div");
    card.classList.add('card');

    let card_holder = document.createElement("div");
    card_holder.classList.add('card__image-holder');
    let card_image = document.createElement("img");
    card_image.classList.add('card__image');
    card_image.src = atividade['imagens'][0]
    card_image.width = 300
    card_image.height = 225
    card_image.alt = atividade['titulo']
    card_holder.appendChild(card_image)
    card.appendChild(card_holder)

    let card_title = document.createElement("div");
    card_title.classList.add('card-title');

    let title = document.createElement("h2");
    title.innerText= atividade['titulo']
    card_title.appendChild(title)
    card.appendChild(card_title)

    let card_flap = document.createElement("div");
    card_flap.classList.add('card-flap');
    card_flap.classList.add('flap1');

    let card_desc = document.createElement("div");
    card_desc.classList.add('card-description');
    card_desc.innerText = atividade['descricao']

    let read_more_card = document.createElement("div");
    read_more_card.classList.add('card-flap');
    read_more_card.classList.add('flap2');

    let card_action = document.createElement("div");
    card_action.classList.add('card-actions');

    read_more_card.appendChild(card_action)

    card_flap.appendChild(card_desc)
    card_flap.appendChild(read_more_card)
    card.appendChild(card_flap)

    cards.appendChild(card)
   
}

