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
    // console.log('insignup');
    $('#signUp').click(function (res) {
        let name = $('#name').val() || '';
        let email = $('#email').val() || '';
        let password = $('#password').val() || '';
        let cpassword = $('#confirm-password').val() || '';
        email = email.trim();
        password = password.trim();
        cpassword = cpassword.trim();
        ErrorCount = 0;
        if (!validateEmail(email)) {
            showError('#email');
        } else {
            showOk('#email');
        }

        if (password.length >= 8) {
            showOk('#password');
        } else {
            showError('#password');
        }
        // console.log(password);
        // console.log(cpassword);
        if (cpassword.length >= 8 && password === cpassword) {
            showOk('#confirm-password');
        } else {
            showError('#confirm-password');
        }
        if (ErrorCount > 0) {
            ErrorCount = 0;
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            }),
            redirect: 'follow'
        };
        console.log('fetch ' + requestOptions.body);
        fetch("http://localhost:3000/api/signup", requestOptions)
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then(result => {
                if (!result.completed) {
                    showServerErrors(result.errors);
                } else {
                    window.location.replace("http://localhost:3000/login");
                }
            })
            .catch(error => {
                showServerErrors(error);
            });
    });
});