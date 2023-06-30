$(document).ready(myView)

function myView() {
    //Obtém o ID do artigo armazenado na sessionStorage do navegador.
    const articleId = parseInt(sessionStorage.article)
    // Se o ID não for um número, redireciona para a página de erro 404
    if (isNaN(articleId)) loadpage('e404')
    // Faz uma requisição GET para obter o artigo correspondente ao ID 
    console.log(app.apiBaseURL + 'articles/' + articleId)
    $.get(app.apiBaseURL + 'articles/' + articleId)
        .done((data) => {

            // if(data.status == 'not-found') loadpage('e404')


            
            // se houver mais ou menos do que 1 artigo correspondente ao ID
            //if (data.length != 1) loadpage('e404')
            // armazena as informações do artigo em uma variável
            artData = data;
            // atualiza o títilo da página com o título do artigo.
            $('#artTitle').html(artData.title)
            // atualiza o coteúdo do artigo na página
            $('#artContent').html(artData.content)
            // atualiza o contador de visualizações do artigo
            //updateViews(artData)
            // atualiza o título da página com o título o artigo.
            changeTitle(artData.title)
            // obtém as informações do autor do artigo
            //getAuthor(artData)
            // obtém os artigos do mesmo autor
            //getAuthorArticles(artData, 5)
            // obtém o formulário de comentários do usuário
            getUserCommentForm(artData)
            // obtém os comentários do artigo
            getArticleComments(artData, 999)
        })

        .fail((error) => {
            // se a reqiozição falhar, exibe uma mensagem de erro ao usuário e redireciona para a página de erro 404
            popUp({ type: 'error', text: 'Artigo não encontrado!' })

            loadpage('e404')
        })

}

function getAuthor(artData) {
    // faz uma requisição GET para obter as informações do autor do artigo
    $.get(app.apiBaseURL + 'users/' + artData.author)
        .done((userData) => {

            // Cria uma lista com os links das redes sociais do autor, se houver
            var socialList = ''
            if (Object.keys(userData.social).length > 0) {
                socialList = '<ul class="social-list">'
                for (const social in userData.social) {
                    socialList += `<li><a href="${userData.social[social]}" target="_blank"><i class="fa-brands fa-fw fa-${social.toLowerCase()}"></i> ${social}</a></li>`
                }
                socialList += '</ul>'
            }

            // atualiza as informações do autor do artigo na página
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)

            $('#artAuthor').html(`
                <img src="${userData.photo}" alt="${userData.name}">
                <h3>${userData.name}</h3>
                <h5>${getAge(userData.birth)} anos</h5>
                <p>${userData.bio}</p>
                ${socialList}
            `)
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })
}
// Busca os artigos do mesmo autor  insere na página 
function getAuthorArticles(artData, limit) {
    // Usa a função jQuery $.get para buscar os artigos do mesmo autor a partir da API, com os parâmetros definidos abaixo:
    $.get(app.apiBaseURL + 'articles', {
        // Filtro pelo autor do artigo atual
        author: artData.author,
        // Apenas artigos publicados (status = "on")
        status: 'on',
        // Exclui o artigo atual (para não aparecer na lista)          
        id_ne: artData.id,
        //Limita a quantidade de artigos (padrão = 5)      
        _limit: limit || 5
    })  //Se a busca for bem-sucedida, executa a função abaixo:
        .done((artsData) => {
            if (artsData.length > 0) {
                // Cria uma lista de artigos com o título de cada artigo encontrado.
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                var rndData = artsData.sort(() => Math.random() - 0.5)
                rndData.forEach((artItem) => {
                    output += `<li class="article" data-id="${artItem.id}">${artItem.title}</li>`
                });
                output += '</ul>'
                // Insere a lista de artigos no elemento com o id "authorArticles"
                $('#authorArtcicles').html(output)
            }
        }) // Se a busca falhar, exibe uma mensagem de erro no console e carrega a página erro 404
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}
//  Função que busca e insere os comentários do artigo na página
function getArticleComments(artData, limit) {

    var commentList = ''
    // Usa a função jQuary $.get para buscar os comentários do artigo e partir da API, com os parâmetros definidos abaixo:
    $.get(app.apiBaseURL + `comments/${artData.id}`)
        // Se a busca for bem-sucedida, executaa função abaixo:
        .done((cmtData) => {
            if (cmtData.length > 0) {
                // Cria uma lista de comentários com as informações de cada comentário encontrado
                cmtData.forEach((cmt) => {
                    var content = cmt.content.split("\n").join("<br>")
                    commentList += `
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            $('#commentList').html(commentList)
        })
        // Se a busca falhar, exibe uma mensagem de erro no console e carrega a página erro 404
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}
// Função que renderiza o formulário de comentário do usuário
function getUserCommentForm(artData) {

    var cmtForm = ''

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent"></textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            $('#commentForm').html(cmtForm)
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
        } else {
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`
            $('#commentForm').html(cmtForm)
        }
    })

}


function sendComment(event, artData, userData) {

    event.preventDefault()
    var content = stripHTML($('#txtContent').val().trim())
    $('#txtContent').val(content)
    if (content == '') return false
    const today = new Date()
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]
    request = app.apiBaseURL + `comments/find?uid=${userData.uid}&art=${artData.id}&txt=${content}`;

    $.get(request)
        .done((data) => {
            if (data.length > 0) {
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } else {
                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    comment: content,
                    date: sysdate,
                    status: 'on'
                }

                $.ajax({
                    type: "POST",
                    url: app.apiBaseURL + 'comments',
                    data: JSON.stringify(formData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.id > 0) {
                popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' });
                loadpage('view');
              }
            },
            error: function (err) {
              console.log(err);
              popUp({ type: 'error', text: 'Ocorreram falhas ao enviar. Tente mais tarde.' });
              loadpage('view');
            }
          });
        }
      });
  }

function updateViews(artData) {
    $.ajax({
        type: 'PATCH',
        url: app.apiBaseURL + 'articles/' + artData.id
    });
}