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
