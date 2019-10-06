'use strict'

const userImg = document.querySelector('main');
const userClick = document.querySelector('body')


function loadUsers () {
    let usersData;
    const request = new Promise( function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `loadUsers`);
        xhr.send();
        xhr.onload = function () {
            resolve (xhr.response);
        }    
        
    });
    
    const load = function () {
        request.then(
            result => {
                usersData = JSON.parse(result);
                const usersList = Object.keys(usersData);

                function loadUserTables () {
                    for (let i=0; i<usersList.length; i++) {
                        document.querySelector('main')
                            .insertAdjacentHTML('beforeend', 
                                `<div class="user-table">
                                    <div class="user-table-info">
                                        <img src="users/${usersList[i]}/${usersData[usersList[i]].userIcon}" alt="user-icon" class="user-icon">
                                        <a href="/user.html" id="${usersList[i]}" class="user-nickname">${usersData[usersList[i]].userName}</a>
                                    </div>
                                    <div class="user-table-images ${usersList[i]}">
                                    </div>                            
                                </div>`
                            );
                            for (let j=usersData[usersList[i]].images.length-1; j>=0; j--) {
                                document.querySelector(`.${usersList[i]}`)
                                .insertAdjacentHTML('beforeend', 
                                    `<img src="users/${usersList[i]}/img/${usersData[usersList[i]].images[j]}" alt="" class="img">`);
                            }
                    }
                }
                loadUserTables();

            },
            error => console.log('Error')
        );
    }
    
    load ();
}
loadUsers();



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