document.addEventListener('DOMContentLoaded', function() {
    
    const pElement = document.querySelector('#howmany p');

    if (localStorage.length === 0) {
        pElement.textContent = "0"; 
    } else {
        pElement.textContent = localStorage.length;
    }
});

