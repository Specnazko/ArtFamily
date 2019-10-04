'use strict'

const userImg = document.querySelector('main');
const userClick = document.querySelector('body')

function openImg (e) {
    if (e.target.matches('.img')) {
        const imgWrapper = document.querySelector('.open-img-wrapper');
        const imgO = document.querySelector('.open-img');
        const img = document.querySelector('.full-img');
        const src = e.target.getAttribute('src');
        img.setAttribute('src', src);
        imgWrapper.style.display = 'flex';
        imgO.style.display = 'flex';

        function closeImg (e) {
            if (!e.target.matches('.full-img')) {
                imgWrapper.style.display = 'none';
                imgO.style.display = 'none';
            }
        }
        imgWrapper.addEventListener ('click', closeImg);
    }
    return;
}

userImg.addEventListener('click', openImg);

function requestUserCLick (e) {
    if (e.target.matches('.user-nickname')) {
        const userId = e.target.getAttribute('id');
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `userClick/${userId}`);
        xhr.send(); 
        xhr.onload = function () {
            return;
        }    
    }  
}

userClick.addEventListener('click', requestUserCLick)