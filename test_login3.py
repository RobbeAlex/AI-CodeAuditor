def calcular_total(lista_precios):
    total = 0.0
    for precio in lista_precios:
        try:
            precio = float(precio)
            
            if precio < 0:
                print(f"Advertencia: Se omitió un valor negativo: {precio}")
                continue
                
            total += precio
        except (ValueError, TypeError):
            print(f"Error: El elemento {precio} no es un número válido y será ignorado.")
            continue
            
    return total

precio = [10.50, 20.00, 5.00, 15.75, "roberto", -40]
total_calculado = calcular_total(precio)
print(f"El total de la compra es: {total_calculado:.2f}")
