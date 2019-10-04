'use strict'
const userImg = document.querySelector('.images-container');
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

                const image = document.querySelector('.image');
                userData.images.forEach (function (e){
                
                document.querySelector('.images-container').insertAdjacentHTML('beforeend', `<div class="image-wrapper"><img src="../${userData.id}/img/${e}" alt="" class="image"></div>`);
                
                });

            },
            error => console.log('Error')
        );
    }
    
    load ();
}
loadContent();


function openImg (e) {
    if (e.target.matches('.image')) {
        const imgWrapper = document.querySelector('.open-img-wrapper');
        const imgO = document.querySelector('.open-img');
        const img = document.querySelector('.full-img');
        const src = e.target.getAttribute('src');
        img.setAttribute('src', src);
        imgWrapper.style.display = 'flex';
        imgO.style.display = 'flex';
        const arrImg = document.querySelectorAll('.image');
        let index;
        for (let i=0; i<arrImg.length; i++) {
            if (src == arrImg[i].getAttribute('src')) index = i;
        }

        console.log(index);
        function navigationImg (e) {
            
            if (e.target.matches('.next-img')){

                index++;
                if (index == arrImg.length) index=0;
                img.setAttribute('src', arrImg[index].getAttribute('src'));

            }else if ( e.target.matches('.early-img')) {

                index--;
                if (index == -1) index=arrImg.length-1;
                img.setAttribute('src', arrImg[index].getAttribute('src'));

            }else if (!e.target.matches('.full-img')) {
                imgWrapper.style.display = 'none';
                imgO.style.display = 'none';
            }
        }
        imgWrapper.addEventListener ('click', navigationImg);

    }
    return;
}

userImg.addEventListener('click', openImg);