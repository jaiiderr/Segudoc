document.addEventListener('DOMContentLoaded', function () {
    const drop = document.querySelector('.drop-area');
    const fileInput = document.getElementById('file-input');
    const fileText = document.getElementById('file-text');
    const documentImage = document.getElementById('document');
    let respue = document.getElementById("respuesta");
    let boton = document.getElementById("analizar");
    const form = document.querySelector('form');
    let isOverdrop = false;

    // Comprobar si el refresh proviene del envío del formulario
    if (sessionStorage.getItem('formSubmitted') === 'true') {
        respue.style.display = "block"; // Mostrar el div si se envió el formulario
    } else {
        respue.style.display = "none"; // Ocultar el div si es un refresh normal
    }

    // Detectar cambios en el archivo seleccionado
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileText.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
            updateFileImage(fileInput.files[0]);
            respue.style.display = "none";
        } else {
            fileText.textContent = 'Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo';
        }
    });

    // Manejador para el botón "Analizar"
    boton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir comportamiento predeterminado
        if ((fileInput.files.length > 0)||(files.length > 0)) {
            sessionStorage.setItem('formSubmitted', 'true'); // Indicar que el formulario fue enviado
            form.submit(); // Enviar el formulario
        } else {
            alert("Por favor selecciona un documento para analizar.");
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

    // Detectar cuando el arrastre entra al área
    drop.addEventListener('dragenter', () => {
        isOverdrop = true;
        drop.classList.add('dragging');
    });

    // Detectar cuando el arrastre sale del área
    drop.addEventListener('dragleave', (e) => {
        // Verificar si el mouse realmente salió del contenedor
        if (!drop.contains(e.relatedTarget)) {
            isOverdrop = false;
            drop.classList.remove('dragging');
        }
    });

    // Manejar el evento de soltar dentro del contenedor
    drop.addEventListener('drop', (e) => {
        e.preventDefault();
        if (isOverdrop) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileText.textContent = `${files[0].name}`;
                updateFileImage(files[0]);
                respue.style.display = "none";
                drop.classList.remove('dragging');

                // Create a new event to trigger the form submission
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                drop.closest('form').dispatchEvent(submitEvent);

                drop.classList.remove('dragging');
            }
        }
    });

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
});

