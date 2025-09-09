function searchManga(){
    const searchInput = document.getElementById('search').value;
    console.log(searchInput);
    var query = `
        query($id: Int, $search: String, $type: MediaType, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage){
                pageInfo {
                    currentPage
                    hasNextPage
                    perPage
                    }
                    media(id: $id, search: $search, type: $type){
                        id
                        title {
                            english
                            romaji
                            native
                        }
                        coverImage {
                            large
                        }
                    }
                }
            }
    `;

    var variables = {
        search: `${searchInput}`,
        type: "MANGA",
        page: 1,
        perPage: 12
    }

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        }

    fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);

}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    const mangaSection = document.getElementById('manga-section');
    mangaSection.innerHTML = '';
    for (let i = 0; i < data.data.Page.media.length; i++) {
        const mangaCard = document.createElement('div');
        mangaCard.className = 'manga-card';
        mangaCard.id = 'manga-card';
        mangaCard.innerHTML += `
        <div class="image-section">
                <img src="${data.data.Page.media[i].coverImage.large}" alt="manga-image" id="manga-image-search">
            </div>
            <div class="manga-info-section">
                <p class="manga-name">${data.data.Page.media[i].title.romaji}</p>
        </div>
        `
        mangaSection.appendChild(mangaCard);
    }
}

function suggestManga(){
    var querySuggestion = `
    query($id: Int, $type: MediaType, $page: Int, $perPage: Int, $sort: [MediaSort]) {
        Page(page: $page, perPage: $perPage){
            pageInfo {
                currentPage
                hasNextPage
                perPage
                }
            media (id: $id, type: $type, sort: $sort){
                id
                title {
                    english
                    romaji
                    native
                    }
                    coverImage {
                        large
                        }
                    }
                }
            }
    `;

    const sortOptions = ["TRENDING_DESC", "POPULARITY_DESC"];
    const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

    var variablesSuggestion = {
        type: "MANGA",
        page: 1,
        perPage: 6,
        sort: [randomSort]
    }

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: querySuggestion,
                variables: variablesSuggestion
            })
        }

    fetch(url, options).then(handleResponse)
        .then(handleSuggestData)
        .catch(handleError);
}


function suggestNewManga(){
    var querySuggestionNew = `
    query($id: Int, $type: MediaType, $page: Int, $perPage: Int, $sort: [MediaSort], $start: FuzzyDateInt) {
        Page(page: $page, perPage: $perPage){
            pageInfo {
                currentPage
                hasNextPage
                perPage
                }
            media (id: $id, type: $type, sort: $sort, startDate_greater: $start){
                id
                title {
                    english
                    romaji
                    native
                    }
                    coverImage {
                        large
                        }
                    startDate {
                        year
                        month
                        day
                        }
                    }
                }
            }
    `;

    const sortOptions = ["TRENDING_DESC", "POPULARITY_DESC"];
    const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

    var variablesSuggestionNew = {
        type: "MANGA",
        page: 1,
        perPage: 6,
        sort: [randomSort],
        start: 20240101,
    }

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: querySuggestionNew,
                variables: variablesSuggestionNew
            })
        }

    fetch(url, options).then(handleResponse)
        .then(handleSuggestNewData)
        .catch(handleError);
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}

const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', searchManga);


function handleSuggestData(data) {
    console.log(data);
    const suggetionCardContainer = document.getElementById('suggestion-card-container');
    suggetionCardContainer.innerHTML = '';
    for(let i = 0; i < data.data.Page.media.length; ++i){
        const suggestionCard = document.createElement('div');
        suggestionCard.className = 'suggestion-card';
        suggestionCard.id = 'suggestion-card';
        suggestionCard.innerHTML += `
            <img src="${data.data.Page.media[i].coverImage.large}" alt="manga image">
            <p class="manga-name-sg">${data.data.Page.media[i].title.romaji}</p>
        `
        suggetionCardContainer.appendChild(suggestionCard);
    }
}

function handleSuggestNewData(data) {
    console.log(data, "new manga");
    const newMangaCardContainer = document.getElementById('new-managa-card-container');
    newMangaCardContainer.innerHTML = '';
    for(let i = 0; i < data.data.Page.media.length; ++i){
        const newMangaCard = document.createElement('div');
        newMangaCard.className = 'new-manga-card';
        newMangaCard.id = 'new-manga-card';
        newMangaCard.innerHTML += `
            <img src="${data.data.Page.media[i].coverImage.large}" alt="manga image">
            <p class="manga-name-nms">${data.data.Page.media[i].title.romaji}</p>
        `
        newMangaCardContainer.appendChild(newMangaCard);
    }
}

suggestManga();

suggestNewManga();