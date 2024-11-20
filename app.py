from flask import Flask, render_template, request, redirect, url_for, flash
import os
import re
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuración para la subida de archivos
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'your_secret_key'

# Asegurarse de que la carpeta de subida exista
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Función para comprobar si un archivo tiene una extensión permitida
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Función para analizar el contenido del archivo
def analyze_file(file_path):
    suspicious_patterns = [
        r'\bexec\b',       # Uso de exec
        r'\bimport os\b',  # Importación del módulo os
        r'\bsystem\b',     # Llamadas al sistema
        r'\bsubprocess\b', # Uso del módulo subprocess
        r'<script>',       # Presencia de scripts en HTML
    ]
    try:
        with open(file_path, 'r', errors='ignore') as file:
            content = file.read()
            for pattern in suspicious_patterns:
                if re.search(pattern, content):
                    return f"Suspicious content found: {pattern}"
        return "No suspicious content detected"
    except Exception as e:
        return f"Error analyzing file: {e}"

@app.route('/', methods=['GET', 'POST'])
def index():
    operation = request.args.get('operation', '')  # Lee el parámetro de operación desde la URL
    analysis_result = None  # Variable para almacenar el resultado del análisis

    if request.method == 'POST':
        if operation == 'malware':  # Analizar archivos
            if 'file' not in request.files:
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                # Llamar a la función de análisis
                analysis_result = analyze_file(file_path)

                # Mostrar el resultado
                flash(analysis_result)
                os.remove(file_path)  # Limpia el archivo después de analizarlo
                return render_template('index.html', operation=operation, analysis_result=analysis_result)
            else:
                flash('File type not allowed')
                return redirect(request.url)

    return render_template('index.html', operation=operation, analysis_result=analysis_result)

if __name__ == '__main__':
    app.run(debug=True)
