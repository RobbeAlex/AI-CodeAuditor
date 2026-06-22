def calcular_total(lista_precios):
    total: float = 0.0

    if not lista_precios:
        return total
    
    for item in lista_precios:
        try:
            precio = float(item)
            
            if precio < 0:
                print(f"Vulnerabilidad: Se omitió un valor negativo: {precio}")
                continue
                
            total += precio
            
        except (ValueError, TypeError):
            print(f"Vulnerabilidad: El elemento '{item}' no es un número válido y será ignorado.")
            continue
            
    return total

if __name__ == "__main__":
    datos_prueba = [10.50, 20.00, "5.00", 5.0]
    resultado_final = calcular_total(datos_prueba)
    print(f"Total calculado: {resultado_final:.2f}")
