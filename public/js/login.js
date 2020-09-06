function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
var ErrorCount = 0;

function showError(name) {
    // console.log('e' + name);
    ErrorCount++;
    $(name).removeClass('is-valid');
    $(name).addClass('is-invalid');
    $(name + '-feedback').css('display', 'block');
}

function showOk(name) {
    // console.log('o' + name);
    $(name).removeClass('is-invalid');
    $(name).addClass('is-valid');
    $(name + '-feedback').css('display', 'none');
}

function showServerErrors(err) {
    if (Array.isArray(err)) {
        err.forEach(error => {
            alert('Server: ' + error);
        });
    } else {
        alert('Server: ' + error);
    }
}
$(document).ready(function () {
    $('#signIn').click(function (res) {
        let email = $('#Email').val() || '';
        let password = $('#Password').val();
        ErrorCount = 0;
        email = email.trim();
        if (validateEmail(email)) {
            showOk('#Email');
        } else {
            showError('#Email');
        }
        console.log(typeof (password));
        if (typeof (password) === 'string') {
            password = password.trim();
            if (password.length < 8) {
                showError('#Password');
            }
        } else {
            showError('#Password');
        }
        if (ErrorCount > 0) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                email: email,
                password: password
            }),
            redirect: 'follow'
        };

        fetch("http://localhost:3000/api/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.completed) {
                    showServerErrors(result.errors);
                } else {
                    console.log(result);
                    window.location.replace("http://localhost:3000/");
                }
            })
            .catch(error => console.log('error', error));
    });
});