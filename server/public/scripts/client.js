$(document).ready(onReady);

function onReady() {
    getSongs();
    $('#add').on('click', postSong);
    $('#songsTableBody').on('click', '.btn-delete', deleteSong);
    $('#songsTableBody').on('click', '.btn-vote', voteSong);
}

function voteSong() {
    console.log('clicked vote');
    let id = $(this).closest('tr').data().id;
    console.log(id);
    let direction = $(this).text().toLowerCase();
    console.log(direction);
    $.ajax({
        method:'PUT',
        url:`/songs/${id}`,
        data: {
            direction: direction
        }
    }).then(function (response){
        getSongs();
    }).catch(function (err){
        console.log(err);
    })
        
    //call ajax for put
    //need id and direction....

    
}
// get artist data from the server
function getSongs() {
    $("#songsTableBody").empty();
    // let songID = 90;
    $.ajax({
        type: 'GET',
        // url: `/songs/${songID}`
        url: `/songs`
    }).then(function (response) {
        console.log("GET /songs response", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#songsTableBody').append(`
                <tr data-id = ${response[i].id}>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}
                    <button class="btn-vote">UP</button>
                    <button class="btn-vote">DOWN</button>
                    </td>
                    <td>${response[i].published}</td>
                    <td>
                        <button class="btn-delete" data-id = ${response[i].id}>Delete</button>
                    </td>
                </tr>
            `);
        }
    });
}

function postSong() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/songs',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getSongs();
    });
}

function deleteSong(){
    let songID = $(this).data().id;
    $.ajax({
        method: 'DELETE',
        url: `/songs/${songID}`
    })
    .then(function (response) {
        console.log('Deleted it!');
        getSongs();
    }).catch(function (error) {
        console.log('Error deleting', error);
    });
}