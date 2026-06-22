def calcular_total(lista_precios)
    total = 0
    # Error: Falta el dos puntos en el bucle for
    for precio in lista_precios
        total = total + precio
    return total

precios = [10.50, 20.00, "5.00", 15.75]

print("El total de la compra es: " + precio_final)

resultado = calcular_total(precios)
print(resultado)
