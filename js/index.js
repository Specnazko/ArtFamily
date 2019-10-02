'use strict'

const userImg = document.querySelector('main');

function openImg (e) {
    if (e.target.matches('.img')) {
        const imgWrapper = document.querySelector('.open-img-wrapper');
        const img = document.querySelector('.full-img');
        const src = e.target.getAttribute('src');
        img.setAttribute('src', src);
        imgWrapper.style.display = 'flex';

        function closeImg (e) {
            if (!e.target.matches('.full-img')) imgWrapper.style.display = 'none';
        }
        imgWrapper.addEventListener ('click', closeImg);
    }
    return;
}

userImg.addEventListener('click', openImg);