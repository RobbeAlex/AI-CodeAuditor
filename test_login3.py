def calcular_total(lista_precios):
    total = 0.0
    for precio in lista_precios:
        total += float(precio)
    return total

precios = [10.50, 20.00, "5.00", 15.75]

total_calculado = calcular_total(precios)

print(f"El total de la compra es: {total_calculado:.2f}")
