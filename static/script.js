document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const fileInput = document.getElementById('file-input');

    let isOverContainer = false;

    // Prevent default behavior for drag and drop on the whole document
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (isOverContainer) {
            e.dataTransfer.dropEffect = 'copy'; // Indica que se permite la copia
        } else {
            e.dataTransfer.dropEffect = 'none'; // Indica que no se permite
        }
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
    });

    // Detect when dragging enters the container
    container.addEventListener('dragenter', () => {
        isOverContainer = true;
        container.classList.add('dragging');
    });

    // Detect when dragging leaves the container
    container.addEventListener('dragleave', (e) => {
        // Check if the mouse has actually left the container
        if (!container.contains(e.relatedTarget)) {
            isOverContainer = false;
            container.classList.remove('dragging');
        }
    });

    // Handle the drop event within the container
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if (isOverContainer) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;

                // Create a new event to trigger the form submission
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                container.closest('form').dispatchEvent(submitEvent);

                container.classList.remove('dragging');
            }
        }
    });
});
