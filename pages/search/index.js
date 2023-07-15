$(document).ready(mySearch)

/**
 * Função principal da página "search".
 **/
function mySearch() {

    findTerm = sessionStorage.findTerm

    if(findTerm !== undefined) {
        var articleList = '';

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

        })
        .fail((error) => {
            $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
        })
    }
    

    

    // var recipeList = '';

    // $.get(app.apiBaseURL + '/find')
    //     .done((data) => {

    //         data.forEach((item) => {

    //             articleList += `
        
    //             <div class="article" data-id="${item.id}">
    //                 <div class="article-image"><img src="${item.img}" alt="${item.name}"></div>
    //                 <div class="article-title">${item.name}</div>
    //             </div>
                    
    //                 `
    //         })

    //         $("#article-container").html(recipeList);

    //     })
    //     .fail((error) => {
    //         $('#article-container').html('<p class="center">Oooops! Não encontramos nenhum artigo com este nome.</p>')
    //     });


}