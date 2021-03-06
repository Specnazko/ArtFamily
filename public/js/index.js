'use strict'


const userImg = document.querySelector('main');
const userClick = document.querySelector('body');
let counterUsers = 0;

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : false;
  }

function logoutUser(id) {
    document.cookie = "token=; max-age=-1";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/logout/${id}`);
    xhr.send();
    credentials ();
}

function credentials () {
    if (getCookie('token') == false) return null;
    let str = getCookie('token');
    let userCredId = '';
    let userCredName = '';
    for (let i=0; i<str.length; i++) {
        if (str[i] == ':') break;
        userCredId += str[i];
    }
    for (let i=0; i<userCredId.length; i++) {
        if (i == 0) {
            userCredName += str[i].toUpperCase();
            continue;
        }
        if (str[i] == '_') {
            userCredName += ' ';
            i++;
            userCredName += str[i].toUpperCase();
            continue;
        }
        userCredName += str[i];
    }

    
    
    document.querySelector('.signInContainer').innerHTML = `<a href="/user.html" id="${userCredId}" class="user-nickname">${userCredName}</a>`;
    document.querySelector('.signInContainer').insertAdjacentHTML('beforeend', `<img src="img/logout.png" class="logoutIcon alt="">`);

    let logoutButton = document.querySelector('.logoutIcon');
    logoutButton.addEventListener('click', ()=>{logoutUser(userCredId)});
    
}

credentials ();

function loginUser (e) {
    const loginFormElements = document.querySelector('.loginForm');
    let formData = new FormData (loginFormElements);
    if (formData.get('signInLogin')!="" 
        && formData.get('signInPassword')!="") {
            const requestLoginUser = new Promise( function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/loginUser');
                xhr.send(formData);
                xhr.onload = function () {
                    resolve (xhr.response);
                }    

            });

            const processingLoginUser = function () {
                requestLoginUser.then(
                    result => {
                        let flag = JSON.parse(result);
                        if (flag != false) {
                            document.querySelector('.FormWrapper').style.display = 'none';
                            document.querySelector('.loginForm').style.display = 'none';
                            document.querySelector('.registerForm').style.display = 'none';
                            document.cookie = `token=${flag.id}:${flag.token}; path=/`;
                            credentials ();
                        } else {
                            document.querySelector('.signInPassword').insertAdjacentHTML('afterend', `<span class="UserNameError">User name or password is not correct</span>`);
                        }
                    },
                    error => console.log('Error')
                );
            }
            
            processingLoginUser ();
    }
}


function registerNewUser (e) {
    const formElements = document.querySelector('.registerForm');
    let formData = new FormData (formElements);
    if (formData.get('registerLogin')!="" 
        && formData.get('registerPassword')!=""
        && formData.get('registerName')!="") {
            const requestRegisterUser = new Promise( function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/registerNewUser');
                xhr.send(formData);
                xhr.onload = function () {
                    resolve (xhr.response);
                }    

            });

            const processingResultRegister = function () {
                requestRegisterUser.then(
                    result => {
                        let flag = JSON.parse(result);
                        
                        if (flag != false) {
                            document.querySelector('.FormWrapper').style.display = 'none';
                            document.querySelector('.loginForm').style.display = 'none';
                            document.querySelector('.registerForm').style.display = 'none';
                            document.cookie = `token=${flag.id}:${flag.token}; path=/; max-age=36000`;
                            credentials ();
                        } else {
                            document.querySelector('.registerLogin').insertAdjacentHTML('afterend', `<span class="UserNameError">Username is not available</span>`);
                        }
                    },
                    error => console.log('Error')
                );
            }
            
            processingResultRegister ();
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
                                for (let j=usersData[usersList[i]].images.length-1; j>=usersData[usersList[i]].images.length-7; j--) {
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


                const search = document.querySelector('.search');
                search.addEventListener("keyup", (e) => {
                    if (e.code === 'Enter') {
                        for (let i=0; i<usersList.length; i++) {
                            if (usersData[usersList[i]].userName == search.value) {
                                document.querySelector('main')
                                .innerHTML=`
                                    <div class="user-table">
                                        <div class="user-table-info">
                                            <img src="users/${usersList[i]}/${usersData[usersList[i]].userIcon}" alt="user-icon" class="user-icon">
                                            <a href="/user.html" id="${usersList[i]}" class="user-nickname">${usersData[usersList[i]].userName}</a>
                                        </div>
                                        <div class="user-table-images ${usersList[i]}">
                                        </div>                            
                                    </div>`;
                                for (let j=usersData[usersList[i]].images.length-1; j>=usersData[usersList[i]].images.length-7; j--) {
                                    document.querySelector(`.${usersList[i]}`)
                                    .insertAdjacentHTML('beforeend', 
                                        `<img src="users/${usersList[i]}/img/${usersData[usersList[i]].images[j]}" alt="" class="img">`);
                                }
                                break;
                            }
                        }
                      }
                });

                
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

            if (e.target.matches('.signInButton')) {
                loginUser(e);
            }

            if (e.target.matches('.createAnAccount')) {
                const registerButton = document.querySelector('.registerButton')
                let inputUserIcon = document.querySelector('.inputUserIcon');

                FormWrapper.style.display = 'flex';
                loginForm.style.display = 'none';
                registerForm.style.display = 'flex';

                inputUserIcon.addEventListener('change', (e)=> {
                    let fileName = '';
                    let labelUserIcon = document.querySelector('.downloadUserIcon');
                    fileName = e.target.value.split( '\\' ).pop();
                    labelUserIcon.innerHTML = fileName;
                });
                
                registerButton.addEventListener('click', registerNewUser);
            }


        }

        FormWrapper.addEventListener('click', processingFormCLick)
    }

}

userClick.addEventListener('click', processingUserCLick)