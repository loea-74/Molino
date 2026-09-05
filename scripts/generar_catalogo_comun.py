"""
Lo que comparten crear-control.py y generar-catalogo.py.

Vive aparte para que la limpieza de nombres sea la misma en los dos: si el
archivo de control enseñara un nombre y la página otro, no habría manera de
saber cuál manda.
"""

import re
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
EXPORT = RAIZ / "Plantilla_Productos.xlsx"

#: Departamentos que son de uso interno, no catálogo de cara al público.
FUERA = {"PRODUCCION", "D1"}

#: Palabras que en el export perdieron la tilde.
TILDES = {
    "maiz": "maíz", "maices": "maíces", "cafe": "café", "azucar": "azúcar",
    "limon": "limón", "anis": "anís", "oregano": "orégano", "almibar": "almíbar",
    "chia": "chía", "arandano": "arándano", "arandanos": "arándanos",
    "mazapan": "mazapán", "ajonjoli": "ajonjolí", "pina": "piña",
    "jalapeno": "jalapeño", "sesamo": "sésamo", "curcuma": "cúrcuma",
    "pimenton": "pimentón", "mani": "maní", "platano": "plátano",
    "platanos": "plátanos", "anon": "anón", "rabano": "rábano",
    "azafran": "azafrán", "nixtamalizacion": "nixtamalización",
    "articulo": "artículo", "botanico": "botánico",
    "clasica": "clásica", "camaron": "camarón", "corazon": "corazón",
    "bombon": "bombón", "chiltepin": "chiltepín", "algodon": "algodón",
    "garrafon": "garrafón", "acitron": "acitrón", "exotica": "exótica",
    "citrico": "cítrico", "tajin": "Tajín",
    # segunda pasada, con palabras que llevan ñ: "PIÑON" traía la eñe pero no
    # la tilde, así que la entrada "pinon" nunca casaba
    "piñon": "piñón", "pelon": "pelón", "macarron": "macarrón",
    "jazmin": "jazmín", "estragon": "estragón", "jamon": "jamón",
    "balsamico": "balsámico", "japones": "japonés", "organica": "orgánica",
    "organico": "orgánico", "cucharon": "cucharón", "helices": "hélices",
    "pinguica": "pingüica",
}

#: Palabras que van en minúscula aunque estén dentro del nombre.
MENUDAS = {"de", "del", "la", "las", "el", "los", "y", "o", "con", "sin", "para", "en", "a", "al"}


def bonito(texto: str) -> str:
    """De MAYUSCULAS DEL PUNTO DE VENTA a texto que se pueda leer."""
    texto = re.sub(r"\s+", " ", str(texto).strip())
    salida = []
    for i, palabra in enumerate(texto.split(" ")):
        baja = palabra.lower()
        # las medidas se quedan en minúscula: 500ml, 1kg
        if re.fullmatch(r"[\d.,]+(ml|l|kg|g|gr|pz|pzs|oz)?", baja):
            salida.append(baja)
            continue
        baja = TILDES.get(baja, baja)
        if i > 0 and baja in MENUDAS:
            salida.append(baja)
            continue
        salida.append(baja[:1].upper() + baja[1:])
    return " ".join(salida)


def es_codigo(categoria: str) -> bool:
    """"C1", "D3" y demás son códigos de caja, no nombres de categoría."""
    return bool(re.fullmatch(r"[A-Z]\d+", str(categoria)))


def leer_export(ruta: Path = EXPORT):
    """
    Lee el export del punto de venta.

    Devuelve (productos, servicios). Cada producto trae su clave, el nombre tal
    cual salió de la caja y el nombre ya limpio, para que el archivo de control
    pueda enseñar los dos y no haya dudas de qué renglón es cuál.
    """
    if not ruta.exists():
        return [], []

    hoja = openpyxl.load_workbook(ruta, data_only=True)["Plantilla"]
    filas = list(hoja.iter_rows(values_only=True))
    cabecera = [str(c).strip().lower() if c else "" for c in filas[0]]
    col = {n: i for i, n in enumerate(cabecera)}

    # Varias cabeceras del export llevan un asterisco de "obligatorio"
    # ("clave1 *", "descripción *"). Se busca por prefijo para no depender de él.
    def indice(nombre):
        if nombre in col:
            return col[nombre]
        for c, i in col.items():
            if c.rstrip(" *") == nombre:
                return i
        return None

    def dato(fila, nombre):
        i = indice(nombre)
        valor = fila[i] if i is not None and i < len(fila) else None
        return str(valor).strip() if valor is not None else ""

    productos, servicios = [], []
    for fila in filas[1:]:
        nombre = dato(fila, "descripción") or dato(fila, "descripcion")
        if not nombre:
            continue
        departamento = dato(fila, "departamento")
        if not departamento or departamento in FUERA:
            continue
        if dato(fila, "(s/n) mostrar en ventas") == "n":
            continue
        if departamento == "SERVICIOS":
            servicios.append({"clave": dato(fila, "clave1"), "nombre": bonito(nombre)})
            continue
        categoria = dato(fila, "categoria")
        if not categoria or categoria == "OTRAS":
            categoria = "OTROS"
        productos.append({
            "clave": dato(fila, "clave1"),
            "departamento": departamento,
            "categoria": categoria,
            "nombre_original": nombre,
            "nombre": bonito(nombre),
            "favorito": dato(fila, "(s/n) favorito") == "s",
        })
    return productos, servicios
