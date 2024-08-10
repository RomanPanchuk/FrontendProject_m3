let playersCount = null;
let playersPerPage = 3;
let pagesAmount = null;

fillTable(0,playersPerPage)
updatePlayersCount()

function fillTable(pageNumber,pageSize) {
    $.get(`/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`, (players) => {
        console.log(players);

        const $playersTableBody = $(`.players-table-body`)[0];
        let htmlRows = '';

        players.forEach((player) => {
            htmlRows +=
                `<tr>
                      <td class="cell cell_small">${player.id}</td>
                      <td class="cell">${player.name}</td> 
                      <td class="cell">${player.title}</td> 
                      <td class="cell">${player.race}</td> 
                      <td class="cell">${player.profession}</td> 
                      <td class="cell">${player.level}</td> 
                      <td class="cell">${player.birthday}</td> 
                      <td class="cell">${player.banned}</td>                   
                 </tr>`
        })

        $playersTableBody.insertAdjacentHTML("beforeend", htmlRows);
    })
}

function updatePlayersCount() {
    $.get('/rest/players/count', (count) => {
        playersCount = count;
        createPaginationButtons();
    })
}

function createPaginationButtons(){
    pagesAmount = playersCount ? Math.ceil(playersCount / playersPerPage) : 0;

    const $buttonsContainer = document.querySelector('.pagination-buttons');

    let paginationButtonsHTML = '';

    for (let i = 1; i < pagesAmount; i++) {
        paginationButtonsHTML += `<button value="${i - 1}">${i}</button>`;
    }

    $buttonsContainer.insertAdjacentHTML("beforeend", paginationButtonsHTML)
}