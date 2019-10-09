'use strict'

const userImg = document.querySelector('main');
const userClick = document.querySelector('body');
let counterUsers = 0;

function registerNewUser (e) {
    console.log(e);
    const formElements = document.querySelector('.registerForm');
    let formData = new FormData (formElements);
    if (formData.get('registerLogin')!="" 
        && formData.get('registerPassword')!=""
        && formData.get('registerName')!="") {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/registerNewUser');
            xhr.send(formData);
        }

}

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
                
                    for (let i=counterUsers; i<usersList.length && i<counterUsers+9; i++) {
                        if(document.querySelector(`.${usersList[i]}`) === null) {
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
                    
                    counterUsers += 9;
                }
                loadUserTables();
                function populate() {
                      let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
                      if (windowRelativeBottom == document.documentElement.clientHeight)
                      loadUserTables();
                    
                  }
                if (counterUsers<=usersList.length) {
                    window.addEventListener('scroll', populate);
                };

            },
            error => console.log(error)
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

function processingUserCLick (e) {
    if (e.target.matches('.user-nickname')) {
        const userId = e.target.getAttribute('id');
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `userClick/${userId}`);
        xhr.send(); 
        xhr.onload = function () {
            return;
        }    
    }
    if (e.target.matches('.signIn') || e.target.matches('.signInIcon')) {
        const FormWrapper = document.querySelector('.FormWrapper');
        const loginForm = document.querySelector('.loginForm');
        const registerForm = document.querySelector('.registerForm');

        FormWrapper.style.display = 'flex';
        loginForm.style.display = 'flex';

        function processingFormCLick (e) {
            if (e.target.matches('.FormWrapper')){
                FormWrapper.style.display = 'none';
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
            }

            if (e.target.matches('.createAnAccount')) {
                const registerButton = document.querySelector('.registerButton')
                FormWrapper.style.display = 'flex';
                loginForm.style.display = 'none';
                registerForm.style.display = 'flex';

                registerButton.addEventListener('click', registerNewUser);
            }


        }

        FormWrapper.addEventListener('click', processingFormCLick)
    }

}

userClick.addEventListener('click', processingUserCLick)