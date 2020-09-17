work = [];

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
        console.log(job);
        var list = $('<li>' + job.name + '</li>');
        list.append(span);
        console.log(list);
        if (job.done) {
            list.addClass("checked");
        }
        $('#mytodo').append(list);
    });
}
$(document).ready(function () {
    updateList();
    const urlParams = new URLSearchParams(window.location.search);
    const isNew = urlParams.get('new');
    let title = "";
    console.log(urlParams);
    if (isNew === 'true') {
        title = urlParams.get('title');
    } else {

        // updateList();
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
        updateList();
    });



    $('#myInput').keypress(function (e) {
        if (e.which === 13) {
            $('.addBtn').click();
        }
    });



    $('.close').click(function () {
        $(this).parent().remove();
    });

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

        if (isNew) {
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

                    if (!result.completed) {
                        showServerErrors(result.errors);
                    } else {

                        // window.location.replace("http://localhost:3000/list");
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    showServerErrors(error);
                });
        }
        console.log(new_work);
    });
});