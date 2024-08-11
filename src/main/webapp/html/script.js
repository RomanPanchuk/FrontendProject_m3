let accountsCount = null;
let accountsPerPage = 3;
let accountsAmount = null;
let currentPageNumber = 0;

createAccountPerPageDropDown()
fillTable(currentPageNumber, accountsPerPage)
updatePlayersCount()

function fillTable(pageNumber, pageSize) {
    $.get(`/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`, (players) => {
        const $playersTableBody = $(`.players-table-body`)[0];
        let htmlRows = '';
        players.forEach((player) => {
            htmlRows += `<tr class="row" data-account-id = "${player.id}">
                      <td class="cell cell_small">${player.id}</td>
                      <td class="cell">${player.name}</td> 
                      <td class="cell">${player.title}</td> 
                      <td class="cell">${player.race}</td> 
                      <td class="cell">${player.profession}</td> 
                      <td class="cell">${player.level}</td> 
                      <td class="cell">${player.birthday}</td> 
                      <td class="cell">${player.banned}</td>  
                      <td class="cell cell-auto">
                            <button class="edit-button" value="${player.id}">
                            <img class="edit-image" src="../img/edit.png" alt="edit">
                            </button>
                      </td> 
                      <td class="cell cell-auto">
                            <button class="delete-button" value="${player.id}">
                            <img class="delete-image" src="../img/delete.png" alt="delete">
                            </button>
                      </td> 
                      
                                        
                 </tr>`
        })

        Array.from($playersTableBody.children).forEach(row => row.remove());

        $playersTableBody.insertAdjacentHTML("beforeend", htmlRows);

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => button.addEventListener('click', removeAccountHandler));

        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => button.addEventListener('click', editAccountHandler));
    })
}

function updatePlayersCount() {
    $.get('/rest/players/count', (count) => {
        accountsCount = count;
        updatePaginationButtons();
    })
}

function updatePaginationButtons() {
    accountsAmount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;

    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const childButtonsCount = $buttonsContainer.children.length;

    let paginationButtonsHTML = '';

    for (let i = 1; i <= accountsAmount; i++) {
        paginationButtonsHTML += `<button value="${i - 1}">${i}</button>`;
    }

    if (childButtonsCount !== 0) {
        Array.from($buttonsContainer.children).forEach(node => node.remove())
    }

    $buttonsContainer.insertAdjacentHTML("beforeend", paginationButtonsHTML);
    Array.from($buttonsContainer.children).forEach(button => button.addEventListener('click', onPageChange))

    setActivePageButton(currentPageNumber);
}

function createAccountPerPageDropDown() {
    const $dropDown = document.querySelector('.accounts-per-page');
    const options = createSelectOptions([3, 5, 10, 20], 3);

    $dropDown.addEventListener('change', onAccountsPerPageChangeHandler);
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
    // fillTable(currentPageNumber,accountsPerPage);
    updatePaginationButtons();

    onPageChange(e);
}

function onPageChange(e) {
    // const targetPageIndex = e.currentTarget.value;
    let targetPageIndex = e.currentTarget.value;
    if (targetPageIndex > accountsAmount) {
        targetPageIndex = accountsAmount - 1;
    }

    setActivePageButton(targetPageIndex);

    currentPageNumber = targetPageIndex;
    fillTable(currentPageNumber, accountsPerPage);

    setActivePageButton(currentPageNumber);
}

function setActivePageButton(buttonIndex = 0) {

    if (buttonIndex > accountsAmount) {
        buttonIndex = accountsAmount - 1;
        currentPageNumber = buttonIndex;
    }

    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const $targetButton = Array.from($buttonsContainer.children)[buttonIndex];
    const $currentActiveButton = Array.from($buttonsContainer.children)[currentPageNumber];

    $currentActiveButton.classList.remove('active-pagination-button');
    $targetButton.classList.add('active-pagination-button');

}

function removeAccountHandler(e) {
    const accountId = e.currentTarget.value;

    $.ajax({
        url: `/rest/players/${accountId}`,
        type: 'DELETE',
        success: function () {
            updatePlayersCount();
            fillTable(currentPageNumber, accountsPerPage);
        }
    });
}

function editAccountHandler(e) {
    const accountId = e.currentTarget.value;
    const currentRow = document.querySelector(`.row[data-account-id = '${accountId}']`);

    const currentImage = currentRow.querySelector('.edit-button img');

    currentImage.src = '../img/save.png';
}