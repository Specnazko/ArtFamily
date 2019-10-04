'use strict'

const userImg = document.querySelector('main');

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