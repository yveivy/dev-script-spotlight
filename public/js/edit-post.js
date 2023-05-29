async function editFormHandler(event) {
    console.log('editFormHandler is being called');
    event.preventDefault();

    const title = document.querySelector('textarea[name="post-title"]').value;
    const body = document.querySelector('textarea[name="post-body"]').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title, body
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard/');

    } else {
        alert(response.statusText);
    }
}

document.querySelector('.update-btn').addEventListener('click', editFormHandler);
