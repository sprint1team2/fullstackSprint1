// DELETE THIS FILE LATER (unless it is needed later)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const responseContainer = document.getElementById('responseContainer');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = form.querySelector('input[name=username]').value;
        
        fetch('/new', {
            method: 'POST',
            body: JSON.stringify({ username }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            // responseContainer.innerHTML += data.additionalContent;

            // const newElement = document.createElement('div');
            // newElement.innerHTML = data.additionalContent;
            // responseContainer.appendChild(newElement);

            responseContainer.innerHTML += data;
        })
        .catch(error => {
            console.error('Error:', error);
        })
    });
});