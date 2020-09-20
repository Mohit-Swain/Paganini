work = [];

function myAlertSave() {
    $("#my-alert").show();
    setTimeout(function () {
        $("#my-alert").hide();
    }, 2000);
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

function updateList() {
    work.forEach(function (job) {
        var span = $('<span />').addClass('close').text('\u00D7');
        span.click(function () {
            $(this).parent().remove();
            $('#save').prop('disabled', false);

        })
        var list = $('<li>' + job.name + '</li>');
        list.append(span);
        if (job.done) {
            list.addClass("checked");
        }
        list.click(function () {
            $(this).toggleClass('checked');
            $('#save').prop('disabled', false);
        });
        $('#mytodo').append(list);
    });
}
$(document).ready(function () {
    updateList();
    const urlParams = new URLSearchParams(window.location.search);
    const isNew = urlParams.get('new');
    let title = "";
    let id = "";
    if (isNew === "true") {
        title = urlParams.get('title');
        $('#title').html(title);
    } else if (isNew === "false") {
        id = urlParams.get('id');
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                todoId: id
            }),
            redirect: 'follow'
        };

        fetch("http://localhost:3000/todo/postGetTodoById", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

                if (result.completed === false) {
                    showServerErrors(result.errors);
                    if (result.errorCode === 500) {
                        window.location.replace("http://localhost:3000/api/logout");
                    }
                } else {
                    $('#title').html(result.result.title);

                    work = result.result.todo;
                    updateList();
                    // window.location.replace("http://localhost:3000/list");
                }
            })
            .catch(error => {
                console.log('error', error)
                showServerErrors(error);
            });
    }
    $('#save').prop('disabled', true);
    $('#mytodo li').click(function () {
        $(this).toggleClass('checked');
    });

    $('.addBtn').click(function () {
        var value = $('#myInput').val();
        if (value) {
            var span = $('<span />').addClass('close').text('\u00D7');
            span.click(function () {
                $(this).parent().remove();
            })
            var list = $('<li>' + value + '</li>');
            list.append(span);
            list.click(function () {
                $(this).toggleClass('checked');
            });

            $('#mytodo').prepend(list);
            $('#myInput').val("");
            $('#save').prop('disabled', false);
        }
        // updateList();
    });



    $('#myInput').keypress(function (e) {
        if (e.which === 13) {
            $('.addBtn').click();
        }
    });

    $('#back').click(function () {
        window.history.back();
    })



    $('#save').click(function () {
        var new_work = [];
        var len = $('#mytodo').children().length;
        if (len == 0) {
            return;
        }
        for (var i = 0; i < len; i++) {
            let list = $('#mytodo').children()[i];
            // console.log(list.innerText.slice(0, -1));
            // console.log(list.className)
            let obj = {
                name: list.innerText.slice(0, -1).replace(/^\s+|\s+$/g, ''),
                done: (list.className === "checked")
            };
            new_work.push(obj);
        }

        if (isNew === "true") {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    title: title,
                    work: new_work
                }),
                redirect: 'follow'
            };

            fetch("http://localhost:3000/todo/postAddList", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);

                    if (result.completed === false) {
                        showServerErrors(result.errors);
                        if (result.errorCode === 500) {
                            window.location.replace("http://localhost:3000/api/logout");
                        }
                    } else {
                        window.location.replace("http://localhost:3000/list");
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    showServerErrors(error);
                });
        } else if (isNew === 'false') {
            // update
            id = urlParams.get('id');
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({
                    todoId: id,
                    new_todos: new_work
                }),
                redirect: 'follow'
            };

            fetch("http://localhost:3000/todo/updateTodoById", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);

                    if (result.completed === false) {
                        showServerErrors(result.errors);
                        if (result.errorCode === 500) {
                            window.location.replace("http://localhost:3000/api/logout");
                        }
                    } else {
                        myAlertSave();
                        // updateList();
                        // window.location.replace("http://localhost:3000/list");
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    showServerErrors(error);
                });
        }
        $('#save').prop('disabled', true);

    });
});