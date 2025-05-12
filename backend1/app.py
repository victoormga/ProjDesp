from flask import Flask, jsonify, request

app = Flask(__name__)
tareas = []
contador = 1

@app.route('/api/tareas/', methods=['GET'])
def listar_tareas():
    return jsonify({"backend": "backend1", "tareas": tareas})

@app.route('/api/tareas/<int:id>', methods=['GET'])
def obtener_tarea(id):
    tarea = next((t for t in tareas if t["id"] == id), None)
    return jsonify({"backend": "backend1", "tarea": tarea})

@app.route('/api/tareas/', methods=['POST'])
def crear_tarea():
    global contador
    datos = request.json
    tarea = {"id": contador, "descripcion": datos.get("descripcion")}
    tareas.append(tarea)
    contador += 1
    return jsonify({"backend": "backend1", "tarea": tarea})

@app.route('/api/tareas/<int:id>', methods=['DELETE'])
def eliminar_tarea(id):
    global tareas
    tareas = [t for t in tareas if t["id"] != id]
    return jsonify({"backend": "backend1", "mensaje": "Eliminada"})

@app.route('/api/tareas/<int:id>', methods=['PUT'])
def actualizar_tarea(id):
    datos = request.json
    for t in tareas:
        if t["id"] == id:
            t["descripcion"] = datos.get("descripcion")
            return jsonify({"backend": "backend1", "tarea": t})
    return jsonify({"backend": "backend1", "mensaje": "No encontrada"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
