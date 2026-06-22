import math

def calcular_total(lista_precios):
    if not lista_precios:
        return 0.0
    
    total = 0.0
    for item in lista_precios:
        try:

            precio = float(item)
            
            # Validación de lógica: Los precios no deberían ser negativos
            if precio < 0:
                print(f"Advertencia: Se omitió un valor negativo: {precio}")
                continue
                
            total += precio
        except (ValueError, TypeError):
            print(f"Error: El elemento '{item}' no es un número válido y será ignorado.")
            continue
            
    return total

escenarios = {
    "Lista normal": [10.50, 20.00, "5.00", 15.75],
    "Lista con errores": [10.0, "error", 5.0, None],
    "Lista vacía": [],
    "Lista con negativos": [10.0, -5.0, 20.0]
}

for nombre, datos in escenarios.items():
    resultado = calcular_total(datos)
    print(f"{nombre}: Total = {resultado:.2f}")
