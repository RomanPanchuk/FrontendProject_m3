let accountsCount = null;
let accountsPerPage = 3;
let accountsAmount = null;
let currentPageNumber = 0;

createAccountPerPageDropDown()
fillTable(currentPageNumber,accountsPerPage)
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

        Array.from($playersTableBody.children).forEach(row => row.remove());

        $playersTableBody.insertAdjacentHTML("beforeend", htmlRows);
    })
}

function updatePlayersCount() {
    $.get('/rest/players/count', (count) => {
        accountsCount = count;
        updatePaginationButtons();
    })
}

function updatePaginationButtons(){
    accountsAmount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;

    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const childButtonsCount = $buttonsContainer.children.length;

    let paginationButtonsHTML = '';

    for (let i = 1; i < accountsAmount; i++) {
        paginationButtonsHTML += `<button value="${i - 1}">${i}</button>`;
    }

    if (childButtonsCount !== 0){
        Array.from($buttonsContainer.children).forEach(node => node.remove())
    }

    $buttonsContainer.insertAdjacentHTML("beforeend", paginationButtonsHTML);
    Array.from($buttonsContainer.children).forEach(button => button.addEventListener('click',onPageChange))

}

function createAccountPerPageDropDown() {
    const $dropDown = document.querySelector('.accounts-per-page');
    const options = createSelectOptions([3,5,10,20],3);

    $dropDown.addEventListener('change',onAccountsPerPageChangeHandler);
    $dropDown.insertAdjacentHTML('afterbegin', options);
}

function createSelectOptions(optionArray, defaultValue) {
    let optionHtml = '';

    optionArray.forEach(option => optionHtml +=
        `<option ${defaultValue === option && 'selected'} value="${option}">
            ${option}
        </option>`)

    return optionHtml;
}

function onAccountsPerPageChangeHandler(e) {
    accountsPerPage = e.currentTarget.value;
    fillTable(currentPageNumber,accountsPerPage);
    updatePaginationButtons();
}

function onPageChange(e) {
    currentPageNumber = e.currentTarget.value;
    fillTable(currentPageNumber, accountsPerPage);
}