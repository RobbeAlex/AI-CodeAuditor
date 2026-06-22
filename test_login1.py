def conectar_base_datos():
    # Mala práctica: Credenciales quemadas en el código
    usuario = "admin"
    password_db = "supersecreto123!"
    
    conexion = f"mysql://{usuario}:{password_db}@localhost:3306/mi_bd"
    print("Conectado a: " + conexion)
    return conexion
