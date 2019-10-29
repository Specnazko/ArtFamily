'use strict'
const userImg = document.querySelector('.images-container');
const userClick = document.querySelector('body');

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

            const processingResulRegister = function () {
                requestRegisterUser.then(
                    result => {
                        let flag = JSON.parse(result);
                        
                        if (flag) {
                            document.querySelector('.FormWrapper').style.display = 'none';
                            document.querySelector('.loginForm').style.display = 'none';
                            document.querySelector('.registerForm').style.display = 'none';
                        } else {
                            document.querySelector('.registerLogin').insertAdjacentHTML('afterend', `<span class="UserNameError">Username is not available</span>`);
                        }
                    },
                    error => console.log('Error')
                );
            }
            
            processingResulRegister ();
    }

}

function loadContent () {
    let userData;
    const request = new Promise( function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `../users/loadContent`);
        xhr.send();
        xhr.onload = function () {
            resolve (xhr.response);
        }    
        
    });
    

    const load = function () {
        request.then(
            result => {
                userData = JSON.parse(result);

                document.querySelector('.userIcon').setAttribute('src', `../users/${userData.id}/${userData.userIcon}`);
                document.querySelector('.userName > span').innerHTML = userData.userName;
                document.querySelector('.userInfo > span').innerHTML = userData.userInfo;

                userData.images.forEach (function (e){
                    document.querySelector('.images-container').insertAdjacentHTML('beforeend', `<div class="image-wrapper"><img src="../users/${userData.id}/img/${e}" alt="" class="image"></div>`);
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
userClick.addEventListener('click', processingUserCLick);