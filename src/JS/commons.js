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

    let z = atividades.length;
    for(i in atividades){
        mountCard(atividades[i], z)
        z--
    }
}


function mountCard(atividade, index) {

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

    let info_div = document.createElement("div");
    info_div.classList.add('info-div');

    let preco = document.createElement("span");
    let precoValue = "Gratuito"
    preco.classList.add('info-child');

    if(atividade["preco"] > 0)
        precoValue = "R$ " + atividade["preco"]

    preco.innerText= precoValue
    
    info_div.appendChild(preco)

    let stars = document.createElement("div");
    stars.classList.add('info-child');

    let i = 1
    while(i <= 5) {
        let span = document.createElement("span");
        span.classList.add('fa');
        span.classList.add('fa-star');

        if(i <= atividade['avaliacao']['estrelas'])
            span.classList.add('checked');

        stars.appendChild(span)

        i++
    }

    info_div.appendChild(stars)

    let nivel = document.createElement("div");
    nivel.classList.add('tip-div');
    let tip = document.createElement("span");
    tip.classList.add('tip');

    if(atividade['nivel'] == 3)
        tip.innerText = "Atividade de muito esforço físico! Recomendado ter experiência. "

    if(atividade['nivel'] == 2)
        tip.innerText = "Atividade de médio esforço físico! "

    if(atividade['nivel'] == 1)
        tip.innerText = "Atividade de baixo esforço físico! "

    if(atividade['nivel'] == 0)
        tip.innerText = "Atividade sem esforço físico! "

    nivel.appendChild(tip)
    
    i = 1
    while(i <= 3) {
        let span = document.createElement("span");
        span.classList.add('fa');
        span.classList.add('fa-bolt');

        if(i <= atividade['nivel'])
            span.classList.add('checked');

        nivel.appendChild(span)

        i++
    }

    info_div.appendChild(nivel)

    card_title.appendChild(title)
    card_title.appendChild(info_div)

    card.appendChild(card_title)
    card.style = "z-index:" + index

    cards.appendChild(card)
}

