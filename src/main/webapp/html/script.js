fillTable()

function fillTable() {
    $.get('rest/players', (players) => {
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