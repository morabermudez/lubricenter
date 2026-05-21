# Guía de Migración: Lubricenter Pro a Flask

Sigue estos pasos para ejecutar este proyecto en tu computadora local usando Visual Studio Code y Flask.

## 1. Requisitos Previos
- Instalar **Python 3.x**.
- Tener **Visual Studio Code** instalado.

## 2. Configuración del Entorno
Crea una carpeta nueva en tu PC y dentro de VS Code abre la terminal y ejecuta:

```bash
# Crear entorno virtual
python -m venv venv
# Activar (Windows)
.\venv\Scripts\activate
# Activar (Mac/Linux)
source venv/bin/activate
# Instalar Flask
pip install flask
```

## 3. Código del Servidor (app.py)
Crea un archivo `app.py` y pega este código:

```python
from flask import Flask, render_template, request, session, redirect, url_for
import json

app = Flask(__name__)
app.secret_key = 'lubricenter_pro_key'

# Datos de ejemplo para inventario
inventory_data = [
    {"name": "Royal Purple High Mileage 5W-30", "sku": "LUB-RP-5W30-HM", "category": "Aceite de Motor", "stock": 4},
    {"name": "Bosch Premium Oil Filter 3330", "sku": "FIL-B-3330", "category": "Filtros", "stock": 42},
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/booking', methods=['GET', 'POST'])
def booking():
    if request.method == 'POST':
        # Simulamos guardar en JSON (session)
        session['booking'] = {
            'name': request.form.get('name'),
            'oil': request.form.get('oil'),
            'total': request.form.get('total')
        }
        return redirect(url_for('confirmation'))
    return render_template('booking.html')

@app.route('/inventory')
def inventory():
    return render_template('inventory.html', products=inventory_data)

@app.route('/confirmation')
def confirmation():
    return render_template('confirmation.html', booking=session.get('booking'))

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

## 4. Plantilla Base (templates/layout.html)
Crea la carpeta `templates` y dentro `layout.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    <style>
        .velocity-gradient { background: linear-gradient(135deg, #881337 0%, #4c0519 100%); }
    </style>
</head>
<body class="bg-gray-50">
    {% block content %}{% endblock %}
</body>
</html>
```

## 5. Notas sobre el Calendario e Inventario
Para que el buscador de inventario funcione igual que ahora, deberás usar **JavaScript**:

```javascript
// Ejemplo para el buscador en inventory.html
document.getElementById('search').addEventListener('input', function(e) {
    const text = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.product-row');
    rows.forEach(row => {
        const name = row.querySelector('.product-name').innerText.toLowerCase();
        row.style.display = name.includes(text) ? '' : 'none';
    });
});
```
