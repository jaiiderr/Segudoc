document.addEventListener('DOMContentLoaded', function() {
    const drop = document.querySelector('.drop-area');
    const fileInput = document.getElementById('file-input');
    const fileText = document.getElementById('file-text');
    const documentImage = document.getElementById('document');

    // Función para actualizar la imagen según el tipo de archivo
    function updateFileImage(file) {
        if (file.name.endsWith('.pdf')) {
            documentImage.src = 'https://cdn-icons-gif.flaticon.com/17110/17110610.gif'; // PDF
        } else if (file.name.endsWith('.docx')) {
            documentImage.src = 'https://cdn-icons-png.flaticon.com/128/1325/1325825.png'; // DOCX
        } else if (file.name.endsWith('.txt')) {
            documentImage.src = 'https://cdn-icons-gif.flaticon.com/11237/11237458.gif'; // TXT
        } else {
            documentImage.src = 'https://cdn-icons-gif.flaticon.com/11237/11237477.gif'; // Imagen predeterminada
        }
    }

    let isOverdrop = false;

    
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileText.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
        } else {
            fileText.textContent = 'Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo';
        }
    });
    

    // Prevent default behavior for drag and drop on the whole document
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (isOverdrop) {
            e.dataTransfer.dropEffect = 'copy'; // Indica que se permite la copia
        } else {
            e.dataTransfer.dropEffect = 'none'; // Indica que no se permite
        }
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
    });

    // Detect when dragging enters the container
    drop.addEventListener('dragenter', () => {
        isOverdrop = true;
        drop.classList.add('dragging');
    });

    // Detect when dragging leaves the container
    drop.addEventListener('dragleave', (e) => {
        // Check if the mouse has actually left the container
        if (!drop.contains(e.relatedTarget)) {
            isOverdrop = false;
            drop.classList.remove('dragging');
        }
    });

    // Handle the drop event within the container
    drop.addEventListener('drop', (e) => {
        e.preventDefault();
        if (isOverdrop) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileText.textContent = `${files[0].name}`;
                updateFileImage(files[0])

                // Create a new event to trigger the form submission
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                drop.closest('form').dispatchEvent(submitEvent);

                drop.classList.remove('dragging');
            }
        }
    });
});
