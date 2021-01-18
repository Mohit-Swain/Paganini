function showServerErrors(err) {
    if (Array.isArray(err)) {
        err.forEach(error => {
            alert('Server: ' + error);
        });
    } else {
        alert('Server: ' + JSON.stringify(err));
    }
}

todos = [];

function DeleteList(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: JSON.stringify({
            todoId: id
        }),
        redirect: 'follow'
    };

    fetch("/list/deleteListById", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.completed) {
                if (result.errorCode === 500) {
                    window.location.replace("/api/logout");
                }
                showServerErrors(result.errors);
            } else {
                console.log('deleted');
            }
        })
        .catch(error => console.log('error ', error));
}

function updateList() {
    todos.forEach(function (job) {
        var span = $('<span />').addClass('close').html('<img src="images/delete_bin.png" alt="Delete List"></span>');
        var list = $('<li>' + job.title + '</li>');
        span.click(function (event) {
            if (window.confirm('Are You sure you want to delete ' + job.title)) {
                $(this).parent().remove();
                DeleteList(job._id);
            } else {
                event.preventDefault();
            }
        });
        list.click(function (e) {
            if (e.target !== this) {
                return;
            }
            // window.location.replace("/todo:" + job._id);
            window.location.href = "/todo?new=false&id=" + job._id;
        })
        list.append(span);
        $('#List').append(list);
    });
}

function createPagination(currentPage, totalPages) {
    $('#pages').twbsPagination({
        startPage: currentPage,
        totalPages: totalPages,
        visiblePages: 5,
        hideOnlyOnePage: true,
        cssStyle: '',
        prev: '<span aria-hidden="true">&laquo;</span>',
        next: '<span aria-hidden="true">&raquo;</span>',
        onPageClick: function (event, page) {
            if (page != currentPage)
                window.location.replace("/list?page=" + page);
        }

    });

}

$(document).ready(function () {
    $('#create').click(function () {
        let val = $('#title').val().trim();
        if (val.length <= 5) {
            $('#title').addClass('is-invalid');
            return;
        }
        // window.location.replace("/todo?new=true&title=" + val);
        window.location.href = "/todo?new=true&title=" + val
    });



    const urlParams = new URLSearchParams(window.location.search);
    let pageNo = urlParams.get('page');
    const perPage = 10;
    pageNo = parseInt(pageNo);
    if (!pageNo || isNaN(pageNo)) {
        window.location.replace("/list?page=1");
        return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            pageNo: pageNo,
            perPage: perPage
        }),
        redirect: 'follow'
    };

    fetch("/list/postList", requestOptions)
        .then(response => response.json())
        .then(result => {

            if (!result.completed) {
                if (result.errorCode === 500) {
                    window.location.replace("/api/logout");
                }
                showServerErrors(result.errors);
            } else {
                if (result.result.page > result.result.pages) {
                    window.location.replace("/list?page=" + pageNo);
                    return;
                }
                todos = result.result.todos;
                updateList();
                var currentPage = result.result.page;
                var totalPages = result.result.pages;
                createPagination(currentPage, totalPages);
                // console.log(currentPage);
                // console.log(totalPages);
                // window.location.replace("/");
            }
        })
        .catch(error => console.log('error', error));

});