from flask import Flask, render_template, request, redirect, flash
import os
import re
from PyPDF2 import PdfReader
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'your_secret_key'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_date(date_str):
    try:
        date = datetime.strptime(date_str[:14], "D:%Y%m%d%H%M%S")
        return date.strftime("%d de %B de %Y, %I:%M:%S %p")
    except Exception:
        return date_str

def analyze_file(file_path):
    suspicious_patterns = [
        r'\bexec\b', r'\bimport os\b', r'\bsystem\b', r'\bsubprocess\b', r'<script>',
    ]
    try:
        with open(file_path, 'r', errors='ignore') as file:
            content = file.read()
            for pattern in suspicious_patterns:
                match = re.search(pattern, content)
                if match:
                    return f"Contenido sospechoso encontrado: '{match.group(0)}' coincide con el patrón '{pattern}'"
        return "No se detectó contenido sospechoso."
    except Exception as e:
        return f"Error al analizar el archivo: {e}"


def extract_pdf_metadata(file_path):
    try:
        reader = PdfReader(file_path)
        metadata = reader.metadata
        formatted_metadata = {}
        for key, value in metadata.items():
            if key in ['/CreationDate', '/ModDate'] and value:
                formatted_metadata[key.replace('/', '')] = format_date(value)
            else:
                formatted_metadata[key.replace('/', '')] = value
        return formatted_metadata
    except Exception as e:
        return {"Error": f"No se pudieron extraer metadatos: {e}"}

@app.route('/', methods=['GET', 'POST'])
def index():
    analysis_result = None
    pdf_metadata = None

    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No se encontró el archivo')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No seleccionaste un archivo')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            if filename.lower().endswith('.pdf'):
                pdf_metadata = extract_pdf_metadata(file_path)
                analysis_result = analyze_file(file_path)  # También analizamos el contenido del PDF
            else:
                analysis_result = analyze_file(file_path)

            os.remove(file_path)  # Limpia el archivo después de analizarlo
        else:
            flash('Tipo de archivo no permitido')
            return redirect(request.url)

    return render_template('index.html', analysis_result=analysis_result, pdf_metadata=pdf_metadata)

if __name__ == '__main__':
    app.run(debug=True)
