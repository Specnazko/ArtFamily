'use strict'

const user = window.location.pathname.split("/")[window.location.pathname.split("/").length-2];


function loadContent () {
    let userData;
    const request = new Promise( function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `loadContent`);
        xhr.send();
        xhr.onload = function () {
            resolve (xhr.response);
        }    
        
    });
    

    const load = function () {
        request.then(
            result => {
                userData = JSON.parse(result);
                console.log(userData);

                const image = document.querySelector('.image');
                userData.images.forEach (function (e){
                
                document.querySelector('.images-container').insertAdjacentHTML('beforeend', `<img src="../${userData.id}/img/${e}" alt="" class="image">`);
                
                });

            },
            error => console.log('Error')
        );
    }
    
    load ();
}
loadContent();
