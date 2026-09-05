"""
Genera src/content/catalogo.json a partir del export del punto de venta.

    python scripts/generar-catalogo.py [ruta/al/Plantilla_Productos.xlsx]

El export trae 1029 renglones tal como los teclearon en la caja: TODO EN
MAYUSCULAS, sin acentos, con categorias repetidas ("OTROS" y "OTRAS"), codigos
internos ("C1", "D1") y variantes de un mismo servicio. Nada de eso se puede
enseñar tal cual en una web, asi que este script lo limpia. Se guarda para que
cuando cambien la lista de precios no haya que rehacer la limpieza a mano.

Lo que hace, en orden:
  - descarta los departamentos internos y los productos no marcados para venta
  - pasa los nombres de MAYUSCULAS a texto legible y les devuelve los acentos
  - junta "OTROS" y "OTRAS", que son el mismo cajon con dos nombres
  - saca los servicios de molienda a su propia lista, sin las variantes de caja
  - de cada categoria deja unos pocos productos de muestra y cuenta el resto
"""

import json
import re
import sys
from collections import OrderedDict, defaultdict
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "Plantilla_Productos.xlsx"
SALIDA = RAIZ / "src" / "content" / "catalogo.json"

#: Cuántos productos se enseñan de cada categoría. El resto se cuenta ("y N más").
POR_CATEGORIA = 5

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
    "kilogramo": "kilogramo", "articulo": "artículo", "botanico": "botánico",
    # encontradas barriendo el catálogo por terminaciones que suelen llevar tilde
    "clasica": "clásica", "camaron": "camarón", "corazon": "corazón",
    "bombon": "bombón", "chiltepin": "chiltepín", "algodon": "algodón",
    "garrafon": "garrafón", "acitron": "acitrón", "exotica": "exótica",
    "citrico": "cítrico", "tajin": "Tajín",
}

#: Palabras que van en minúscula aunque estén dentro del nombre.
MENUDAS = {"de", "del", "la", "las", "el", "los", "y", "o", "con", "sin", "para", "en", "a", "al"}

#: Los servicios de molienda, ya consolidados. El export los trae repetidos por
#: variantes de cobro ("Molienda 45", "Molienda Maiz Kilo"), que dentro de la
#: caja distinguen tarifas pero de cara al cliente son el mismo servicio.
SERVICIOS = [
    {"nombre": "Molienda de maíz", "nota": "Nixtamalizado, para pozole o para masa"},
    {"nombre": "Nixtamalización y molienda", "nota": "El proceso completo, de grano a masa"},
    {"nombre": "Molienda de café", "nota": "Al punto que pidas"},
    {"nombre": "Molienda de especias y granos", "nota": "Molemos lo que traigas"},
    {"nombre": "Molienda de moles", "nota": "Pastas de mole a tu receta"},
    {"nombre": "Molienda de pan", "nota": "Pan molido fresco"},
]


def bonito(texto: str) -> str:
    """De MAYUSCULAS DEL PUNTO DE VENTA a texto que se pueda leer."""
    texto = re.sub(r"\s+", " ", texto.strip())
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
    return bool(re.fullmatch(r"[A-Z]\d+", categoria))


def main() -> None:
    if not ENTRADA.exists():
        sys.exit(f"No encuentro {ENTRADA}")

    hoja = openpyxl.load_workbook(ENTRADA, data_only=True)["Plantilla"]
    filas = list(hoja.iter_rows(values_only=True))
    cabecera = [str(c).strip().lower() if c else "" for c in filas[0]]
    col = {n: i for i, n in enumerate(cabecera)}
    DESC = "descripción *" if "descripción *" in col else "descripcion *"

    def dato(fila, nombre):
        i = col.get(nombre)
        valor = fila[i] if i is not None and i < len(fila) else None
        return str(valor).strip() if valor is not None else ""

    arbol = defaultdict(lambda: defaultdict(list))
    for fila in filas[1:]:
        if not dato(fila, DESC):
            continue
        departamento = dato(fila, "departamento")
        if not departamento or departamento in FUERA or departamento == "SERVICIOS":
            continue
        if dato(fila, "(s/n) mostrar en ventas") == "n":
            continue
        categoria = dato(fila, "categoria")
        if not categoria or es_codigo(categoria) or categoria == "OTRAS":
            categoria = "OTROS"
        arbol[departamento][categoria].append({
            "nombre": bonito(dato(fila, DESC)),
            "favorito": dato(fila, "(s/n) favorito") == "s",
        })

    departamentos = []
    for nombre in sorted(arbol, key=lambda d: -sum(len(p) for p in arbol[d].values())):
        categorias = []
        # "Otros" siempre al final: es el cajón de sastre, no una categoría real
        for cat, productos in sorted(
            arbol[nombre].items(), key=lambda x: (x[0] == "OTROS", -len(x[1]), x[0])
        ):
            # primero los marcados como favoritos en la caja, luego alfabético
            orden = sorted(productos, key=lambda p: (not p["favorito"], p["nombre"]))
            categorias.append(OrderedDict([
                ("nombre", bonito(cat)),
                ("total", len(productos)),
                ("muestra", [p["nombre"] for p in orden[:POR_CATEGORIA]]),
            ]))
        departamentos.append(OrderedDict([
            ("nombre", bonito(nombre)),
            ("total", sum(len(p) for p in arbol[nombre].values())),
            ("categorias", categorias),
        ]))

    SALIDA.write_text(
        json.dumps(
            OrderedDict([
                ("generado", "scripts/generar-catalogo.py, desde el export del punto de venta"),
                ("servicios", SERVICIOS),
                ("departamentos", departamentos),
            ]),
            ensure_ascii=False, indent=2,
        ) + "\n",
        encoding="utf-8",
    )

    total = sum(d["total"] for d in departamentos)
    muestra = sum(len(c["muestra"]) for d in departamentos for c in d["categorias"])
    categorias = sum(len(d["categorias"]) for d in departamentos)
    print(f"{SALIDA.relative_to(RAIZ)}")
    print(f"  {len(departamentos)} departamentos · {categorias} categorías · {total} productos")
    print(f"  {muestra} productos de muestra · {len(SERVICIOS)} servicios")


if __name__ == "__main__":
    main()
