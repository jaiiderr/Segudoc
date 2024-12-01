/*bloque para que se mantenga estatica la barra*/
document.querySelectorAll('.nav-list a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


function handleFileSelect() {
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const analyzeButton = document.getElementById('analizar-button');

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;

        // Display the file name and hide the file input
        fileNameDisplay.textContent = `Archivo seleccionado: ${fileName}`;
        fileNameDisplay.style.display = 'block';
        fileInput.style.display = 'none';

        // Show the analyze button
        analyzeButton.style.display = 'inline-block';
    }
}

/*funcion para aparecer titulo del resultado*/
