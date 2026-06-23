def calcular_total(lista_precios):
    total: float = 0.0
    for item in lista_precios:
            precio = float(item)
            total += precio
    return total

if __name__ == "__main__":
    datos_prueba = [10.50, 20.00, "5.00", 5.0]
    resultado_final = calcular_total(datos_prueba)
    print(f"Total calculado: {resultado_final:.2f}")
