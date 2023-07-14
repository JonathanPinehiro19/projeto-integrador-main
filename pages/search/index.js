$(document).ready(mySearch)

/**
 * Função principal da página "search".
 **/
function mySearch() {

    var articleList = '';

    findTerm = sessionStorage.findTerm

    if (findTerm !== undefined) {


        $.get(app.apiBaseURL + `articles/find?q=${findTerm}`)
            .done((data) => {
                data.forEach((art) => {
                    articleList += `
                    <div class="article art-item" data-id="${art.id}">
                        <img src="${art.thumbnail}" alt="${art.title}">
                        <div>
                            <h3>${art.title}</h3>
                            <p>${art.resume}</p>
                        </div>
                    </div>                    
                `
                })
                $('#artList').html(articleList)

                getMostViewed(3)
                getLastComments(5)
            })
            .fail((error) => {
                $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
            })

    }
}