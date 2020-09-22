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
        alert('Server: ' + err);
    }
}

$(document).ready(function () {
    $('#Reset').click(function (res) {
        let password = $('#password').val() || '';
        let cpassword = $('#confirm-password').val() || '';
        let token = $('#token').val().trim();
        let userId = $('#userId').val().trim();
        if (!token || !userId) {
            alert('Somethings Wrong with the token, and I can feel it');
            return;
        }
        password = password.trim();
        cpassword = cpassword.trim();
        ErrorCount = 0;

        if (password.length >= 8) {
            showOk('#password');
        } else {
            showError('#password');
            return;
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
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({
                new_password: password,
                token: token,
                userId: userId
            }),
            redirect: 'follow'
        };
        console.log('fetch ' + requestOptions.body);
        fetch("http://localhost:3000/api/changePassword", requestOptions)
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then(result => {
                if (!result.completed) {
                    showServerErrors(result.errors);
                } else {
                    // console.log(result);
                    $('#submit-feedback').show();
                    setTimeout(() => {
                        window.location.replace("http://localhost:3000/login");
                    }, 4000);
                }
            })
            .catch(error => {
                console.log(error);
                showServerErrors(error);
            });
    });
});