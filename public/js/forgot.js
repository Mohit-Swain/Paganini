function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function showError(name) {
    // console.log('e' + name);
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
    $('#recovery_mail').click(function (res) {
        let email = $('#Email').val() || '';
        email = email.trim();
        if (validateEmail(email)) {
            showOk('#Email');
        } else {
            showError('#Email');
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                email: email
            }),
            redirect: 'follow'
        };

        fetch("http://localhost:3000/api/send_recovery_mail", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

                if (!result.completed) {
                    showServerErrors(result.errors);
                } else {
                    $('#submit-feedback').show();
                    // console.log(result);
                    setTimeout(() => {
                        window.location.replace("http://localhost:3000/");
                    }, 6000);
                }
            })
            .catch(error => console.log('error', error));
    });
});