work = [];

function myAlertSave() {
    $('#tweetIt').show();
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
        span.on('click',function () {
            $(this).parent().remove();
            $('#save').prop('disabled', false);

        })
        var list = $('<li>' + job.name + '</li>');
        list.append(span);
        if (job.done) {
            list.addClass("checked");
        }
        list.on('click',function () {
            $(this).toggleClass('checked');
            $('#save').prop('disabled', false);
        });
        $('#mytodo').append(list);
    });
}
$(function () {      
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

        fetch("/todo/postGetTodoById", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.completed === false) {
                    showServerErrors(result.errors);
                    if (result.errorCode === 500) {
                        window.location.replace("/api/logout");
                    }
                } else {
                    $('#title').html(result.result.title);

                    work = result.result.todo;
                    updateList();
                    if(result.result.twitterPostId){
                        twttr.ready((par) =>{
                            twttr.widgets.createTweet(
                                result.result.twitterPostId,
                                document.getElementById('wjs'),
                                {
                                  align: 'center'
                                })
                                .then(function (el) {
                                  console.log("Tweet displayed.");
                                });
                        });
                    }
                    else{
                        $('#wjs').html('<p class="text-center text-secondary">No tweets are made by this Todo List ('+ result.result.title +')<p>')
                    }
                    

                    // window.location.replace("/list");
                }
            })
            .catch(error => {
                showServerErrors(error);
            });
    }


    $('#save').prop('disabled', true);
    $('#mytodo li').on('click',function () {
        $(this).toggleClass('checked');
        $('#save').prop('disabled', false);
    });

    $('.addBtn').on('click',function () {
        var value = $('#myInput').val();
        if(value.length>80){
            alert('The ToDo list can\'t have more than 80 chars');
            return;
        }
        if (value) {
            var span = $('<span />').addClass('close').text('\u00D7');
            span.on('click',function () {
                $(this).parent().remove();
            })
            var list = $('<li>' + value + '</li>');
            list.append(span);
            list.on('click',function () {
                $(this).toggleClass('checked');
            });

            $('#mytodo').prepend(list);
            $('#myInput').val("");
            $('#save').prop('disabled', false);
        }
    });



    $('#myInput').on('keypress',function (e) {
        if (e.which === 13) {
            $('.addBtn').trigger('click');
        }
    });

    $('#back').on('click',function () {
        window.history.back();
    })

    $('#save').on('click',function () {
        var new_work = [];
        var len = $('#mytodo').children().length;
        if (len == 0) {
            return;
        }
        for (var i = 0; i < len; i++) {
            let list = $('#mytodo').children()[i];
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

            fetch("/todo/postAddList", requestOptions)
                .then(response => response.json())
                .then(result => {

                    if (result.completed === false) {
                        showServerErrors(result.errors);
                        if (result.errorCode === 500) {
                            window.location.replace("/api/logout");
                        }
                    } else {
                        window.location.replace("/list");
                    }
                })
                .catch(error => {
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

            fetch("/todo/updateTodoById", requestOptions)
                .then(response => response.json())
                .then(result => {
                    
                    if (result.completed === false) {    
                        showServerErrors(result.errors);
                        if (result.errorCode === 500) {
                            window.location.replace("/api/logout");
                        }
                    } else {
                        myAlertSave();
                    }
                })
                .catch(error => {
                    showServerErrors(error);
                });
        }
        $('#save').prop('disabled', true);
    });

    // Tweet
    $('#tweetIt').on('click',function(Event){
        let id = urlParams.get('id');
        if(!id){
            alert('No Data Id found');
            return;
        }     

        if(!$('#save').prop('disabled')){
            alert('Your Updated ToDo is not Saved');
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"dataId":id});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/todo/postToTwitter", requestOptions)
        .then(response => response.json())
        .then(result => {

            if(result.completed === true){
                // ok
                if(!result.result.tweetId) 
                    return;

                $('#tweetIt').hide();
                twttr.ready((par) =>{
                    twttr.widgets.createTweet(
                        result.result.tweetId,
                        document.getElementById('wjs'),
                        {
                          align: 'center'
                        })
                        .then(function (el) {
                          console.log("Tweet displayed.");
                          $("html, body").animate({ scrollTop: $("#wjs").scrollTop() }, 500);
                        });
                });

            }
            else{
                if(typeof result.errors[0] === 'object'){
                    showServerErrors(result.errors[0].message);
                    if (result.errors[0].statsCode === 401) {
                        alert('Try reconnecting to your twitter account');
                    }
                }
                else{
                    showServerErrors(result.errors);
                    if (result.errorCode === 500) {
                        window.location.replace("/api/logout");
                    }
                }
            }
        })
        .catch(error => {
            showServerErrors(error);
        });
    });
});