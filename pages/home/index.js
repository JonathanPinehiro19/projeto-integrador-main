$(document).ready(myHome)

/**
 * IMPORTANTE!
 * URL para obter todos os artigos ordenados pela data e com status ativo:
 * http://localhost:3000/articles?_sort=date&_order=desc&status=on
 * \---------+---------/
 *           |
 *           +--> URL da API → variável 'app.apiBaseURL' em '/index.js'
 **/

/**
 * Função principal da página "home".
 **/
function myHome() {

    changeTitle()

    var articleList = '';

    $.get(app.apiBaseURL + 'articles')
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

            getMostViewed(5)
            getLastComments(5)
        })
        .fail((error) => {
            $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
        })

}

function getMostViewed(limit) {

    var htmlOut = ''

    $.get(app.apiBaseURL + `articles/views/${limit}`)
        .done((data) => {
            if (data.length > 0) {
                htmlOut = '<ul>'
                data.forEach((item) => {
                    htmlOut += `<li class="article" data-id="${item.id}">${item.title}</li>`
                })
                htmlOut += '</ul>'
            } else {
                htmlOut = '<p class="center">Nenhum artigo encontrado.</p>'
            }

            $('#mostVisited').html(htmlOut)
        })
        .fail((error) => {
            $('#mostVisited').html('<p class="center">Nenhum artigo encontrado.</p>')
        })

}

// function getLastComments(limit) {

//     var htmlOut = ''

//     $.get(app.apiBaseURL + `comments/last/${limit}`)
//         .done((data) => {
//             if (data.length > 0) {
//                 htmlOut = '<ul>'
//                 data.forEach((item) => {
//                     htmlOut += `<li class="article" data-id="${item.article}">${item.content}</li>`
//                 })
//                 htmlOut += '</ul>'
//             } else {
//                 htmlOut = '<p class="center">Nenhum comentário ainda.</p>'
//             }

//             $('#lastComments').html(htmlOut)
//         })
//         .fail((error) => {
//             $('#lastComments').html('<p class="center">Nenhum comentário ainda.</p>')
//         })

// }