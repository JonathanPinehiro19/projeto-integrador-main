$(document).ready(mySearch)

/**
 * Função principal da página "search".
 **/
function mySearch() {

    findTerm = sessionStorage.findTerm

    if(findTerm !== undefined) {


        $.get(app.apiBaseURL + `articles/find?q=${findTerm}`)
        .done((response) => {
            console.log(response)
        })
        
    }
    

    changeTitle()

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