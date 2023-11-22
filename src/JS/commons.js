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
    card.addEventListener("click", () => {
        location.href = './pages/atividades/details.html' + '?id=' + atividade['id']
    }, false); 

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

function closerActivities(id, km) {
    const values = getJson();

    let atividade = values["atividades"].filter((atividade) => { 
        if (atividade['id'] == id)
            return atividade
    })

    if(atividade.length <= 0)
        return;

    atividade = atividade[0]
    let coodernada1 = atividade['localizacao']
    
    let closer = values["atividades"].filter((at) => { 
        if (at['id'] != id){
            let coordenada2 = at['localizacao']
            
            var cc = convertToDMS(coodernada1[0]-coordenada2[0])
            var co1c = [cc[0] * 60, cc[1] * 1, cc[2] / 60]
            var cateto1 = co1c[0] + co1c[1] + co1c[2]
            
            cc = convertToDMS(coodernada1[1]-coordenada2[1])

            var co2c = [cc[0] * 60, cc[1] * 1, cc[2] / 60]
            var cateto2 = co2c[0] + co2c[1] + co2c[2]
            var res = Math.sqrt(Math.pow(cateto1, 2) + Math.pow(cateto2, 2))

            console.log(at['id'])
            if(res < km)
                return at
        } 
    })

    return closer
}

function convertToDMS(cood){
    var hour = Math.round(cood)
    var min = Math.round((cood-hour)*100)
    var seg = Math.round((Math.round((cood-hour) * 100)-((cood-hour)*100))/100*3600)
  
    if(hour<0)hour=hour*-1
    if(min<0)min=min*-1
    if(seg<0)seg=seg*-1
    
    return [hour, min, seg]
  }


function mountCloserSearch(id) {
    closer = closerActivities(id, 10) 

    cards = document.getElementById('cards-container');
    while (cards.firstChild) {
        cards.removeChild(cards.lastChild);
    }

    if(closer.length <= 0){
        notfound = document.createElement("h3");
        notfound.innerText = "Nenhum resultado encontrado"
        cards.appendChild(notfound)
    }

    let title = document.createElement("h2");
    title.innerText = "Atividades próximas (10km):"
    document.getElementById('cards-container').appendChild(document.createElement("br"))
    document.getElementById('cards-container').appendChild(title)

    let z = closer.length;
    for(i in closer){
        mountCard(closer[i], z)
        z--
    }

}
  
async function mountDetailPage(id) {
    let name = document.getElementById('detail-name');
    let img =  document.getElementById('detail-img');
    let desc = document.getElementById('detail-description-span');

    const values = getJson();

    //filtrando os dados
    let result = values["atividades"].filter((atividade) => {

        if(id == atividade["id"])
            return atividade
    });

    if(result.length > 0)
        result = result[0]

    name.innerText = result["titulo"]
    img.src = result["imagens"][0]
    desc.innerText = result["descricao"]

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: Number(result["localizacao"][0]), lng: Number(result["localizacao"][1])},
        zoom: 16,
    });
}