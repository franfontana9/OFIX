#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera TFG-OFIX-Final.docx — versión COMPLETA basada en el texto literal
de la tesis OFIX original (TM-06-OFiX.pdf), reorganizado según la estructura
oficial del TFG — Licenciatura en Negocios Digitales (UdeSA).

POLÍTICA DE EDICIÓN (según directiva del autor):
- NEGRO normal       → texto literal de la tesis original, preservado.
- ROJO + NEGRITA     → secciones/títulos faltantes según la guía oficial.
- AMARILLO + naranja → texto propuesto por el editor académico (mínimo y
                        explícitamente marcado).
"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_COLOR_INDEX
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


FONT_NAME = "Arial"
RED = RGBColor(0xC0, 0x00, 0x00)
BLACK = RGBColor(0x00, 0x00, 0x00)
GREY = RGBColor(0x55, 0x55, 0x55)
BLUE = RGBColor(0x1F, 0x3A, 0x68)
EDITOR_COLOR = RGBColor(0xB8, 0x52, 0x00)

doc = Document()

normal = doc.styles["Normal"]
normal.font.name = FONT_NAME
normal.font.size = Pt(12)
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.space_after = Pt(6)

rpr = normal.element.get_or_add_rPr()
rfonts = rpr.find(qn("w:rFonts"))
if rfonts is None:
    rfonts = OxmlElement("w:rFonts")
    rpr.append(rfonts)
rfonts.set(qn("w:ascii"), FONT_NAME)
rfonts.set(qn("w:hAnsi"), FONT_NAME)
rfonts.set(qn("w:cs"), FONT_NAME)

for sec in doc.sections:
    sec.top_margin = Cm(2.5)
    sec.bottom_margin = Cm(2.5)
    sec.left_margin = Cm(3)
    sec.right_margin = Cm(3)


def _set_run(run, size=12, bold=False, italic=False, color=BLACK, name=FONT_NAME, highlight=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = color
    if highlight is not None:
        run.font.highlight_color = highlight
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:ascii"), name)
    rfonts.set(qn("w:hAnsi"), name)
    rfonts.set(qn("w:cs"), name)


def page_break():
    p = doc.add_paragraph()
    p.add_run().add_break(WD_BREAK.PAGE)


def section_title(text, missing=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run(text)
    _set_run(r, size=16, bold=True, color=(RED if missing else BLACK))


def h1(text, missing=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text)
    _set_run(r, size=14, bold=True, color=(RED if missing else BLACK))


def h2(text, missing=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    _set_run(r, size=12, bold=True, color=(RED if missing else BLACK))


def h3(text, missing=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    _set_run(r, size=12, italic=True, color=(RED if missing else BLACK))


def para(text, justify=True):
    """Párrafo de texto LITERAL de la tesis original — negro normal."""
    p = doc.add_paragraph()
    if justify:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r = p.add_run(text)
    _set_run(r, size=12)


def para_editor(text, justify=True):
    """Párrafo de PROPUESTA DEL EDITOR — amarillo + naranja, explícitamente
    marcado."""
    p = doc.add_paragraph()
    if justify:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r = p.add_run("[Propuesta del editor — revisar] ")
    _set_run(r, size=11, bold=True, italic=True,
             color=EDITOR_COLOR, highlight=WD_COLOR_INDEX.YELLOW)
    r2 = p.add_run(text)
    _set_run(r2, size=12, color=EDITOR_COLOR, highlight=WD_COLOR_INDEX.YELLOW)


def bullets(items):
    """Bullets literales de la tesis original."""
    for it in items:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Cm(0.6)
        r = p.add_run(it)
        _set_run(r, size=12)


def missing_note(text="[FALTA DESARROLLAR ESTA SECCIÓN SEGÚN LA GUÍA OFICIAL]"):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run(text)
    _set_run(r, size=12, bold=True, color=RED)


def note_grey(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run("Nota del editor: ")
    _set_run(r, size=11, bold=True, color=GREY)
    r2 = p.add_run(text)
    _set_run(r2, size=11, italic=True, color=GREY)


def add_image(filename, width_cm=14, caption=None):
    """Inserta imagen desde /Users/fran/Desktop/Tesis/imagenes/{filename}.
    Centrada, con caption opcional."""
    import os
    path = f"/Users/fran/Desktop/Tesis/imagenes/{filename}"
    if not os.path.exists(path):
        # marcar faltante si no existe
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(f"[Imagen no encontrada: {filename}]")
        _set_run(r, size=11, italic=True, color=RED)
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(path, width=Cm(width_cm))
    if caption:
        p2 = doc.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rc = p2.add_run(caption)
        _set_run(rc, size=10, italic=True, color=GREY)


def add_table(headers, rows, col_widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Light Grid Accent 1"
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ""
        p = hdr[i].paragraphs[0]
        r = p.add_run(h)
        _set_run(r, size=11, bold=True)
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            p = cells[i].paragraphs[0]
            r = p.add_run(str(v))
            _set_run(r, size=11)
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in t.rows:
                row.cells[i].width = Cm(w)
    doc.add_paragraph()


# =========================================================================
# CARÁTULA
# =========================================================================
def build_caratula():
    for _ in range(3):
        doc.add_paragraph()
    for txt, size, bold in [
        ("Universidad de San Andrés", 16, True),
        ("Escuela de Negocios", 14, True),
        ("Licenciatura en Negocios Digitales", 13, False),
    ]:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(txt)
        _set_run(r, size=size, bold=bold)

    for _ in range(4):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Trabajo Final de Graduación")
    _set_run(r, size=18, bold=True)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("OFIX")
    _set_run(r, size=24, bold=True, color=BLUE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Taller Trabajo de Graduación — Equipo 6")
    _set_run(r, size=13, italic=True)

    for _ in range(5):
        doc.add_paragraph()

    for line in [
        "Integrantes: Rocco Pellegrino — Francisco Fontana — Priscilla Arslan",
        "Emails: rpellegrino@udesa.edu.ar · fontanaf@udesa.edu.ar · parslan@udesa.edu.ar",
        "Mentor/a: Matías Mella",
        "Tutor/a: Carolina Ballatore",
        "Buenos Aires, Argentina — 2026",
    ]:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(line)
        _set_run(r, size=12)

    page_break()


# =========================================================================
# RESUMEN EJECUTIVO
# =========================================================================
def build_resumen():
    section_title("Resumen Ejecutivo")
    para(
        "OFIX es una plataforma digital de marketplace que conecta de "
        "forma ágil, segura y formal a trabajadores de oficios —plomeros, "
        "electricistas, gasistas, cerrajeros, pintores y técnicos de "
        "mantenimiento— con hogares y pymes gastronómicas en Argentina. "
        "La propuesta nace de un problema estructural: en un país donde "
        "el 43,2% de los trabajadores opera en la informalidad y donde "
        "en oficios la cifra supera el 60%, los hogares y las pymes "
        "dependen mayoritariamente del boca a boca para resolver "
        "urgencias técnicas, sin transparencia de precios, sin "
        "verificación de identidad ni respaldo ante fallas."
    )
    para(
        "La validación empírica de la oportunidad se sustenta en una "
        "investigación de campo de doble lado: 102 respuestas de demanda "
        "(69 hogares y 25 pymes gastronómicas) y 21 respuestas de "
        "trabajadores de oficios, complementadas con ocho entrevistas "
        "en profundidad y un benchmark exhaustivo de once competidores "
        "locales e internacionales. El 96% de los encuestados contrató "
        "al menos un trabajador en el último año, el 69% manifestó "
        "predisposición a utilizar una plataforma digital de servicios "
        "y el 90% de los trabajadores la usaría para obtener clientes "
        "con cobro asegurado y reputación validada."
    )
    para(
        "El segmento objetivo inicial son los hogares y las pymes "
        "gastronómicas de la Ciudad Autónoma de Buenos Aires y el Gran "
        "Buenos Aires, con expansión gradual a las principales ciudades "
        "del país y, hacia el quinto año, salida regional a Uruguay y "
        "Chile. El SAM subregional (Argentina + Chile + Uruguay) se "
        "estima en USD 2,9 mil millones; el SOM Argentina se ubica entre "
        "USD 2,85 y USD 5,70 millones según escenario de adopción."
    )
    para(
        "El diferencial competitivo se construye sobre cuatro pilares "
        "ausentes en el resto del mercado argentino: verificación de "
        "identidad y reputación interna desde el onboarding, "
        "geolocalización integrada con Google Maps, pago digital "
        "protegido vía Mercado Pago y cobertura asegurada por servicio. "
        "El modelo de ingresos combina comisión por transacción (10–15%) "
        "cobrada al cliente, servicios premium para pymes, suscripciones "
        "para trabajadores y ventas complementarias de seguros y "
        "publicidad segmentada."
    )
    para(
        "El equipo fundador está compuesto por tres roles complementarios: "
        "Rocco Pellegrino como CEO/CPO con responsabilidad sobre visión y "
        "producto, Francisco Fontana como CTO a cargo de tecnología, "
        "infraestructura y seguridad, y Priscilla Arslan como COO/Growth "
        "liderando operaciones, marketing y expansión. Durante el cuarto "
        "trimestre de 2026 se incorporarán dos roles adicionales —Customer "
        "Support y Ejecutivo Comercial B2B—, alcanzando un equipo de "
        "cinco personas al cierre del primer año."
    )
    para(
        "Las proyecciones financieras, expresadas en dólares "
        "estadounidenses y descontadas a un WACC del 27% (Ke 27,32% sobre "
        "la base de tasa libre de riesgo + beta sectorial 1,75 + prima "
        "por riesgo país argentino 16,02%), son las siguientes: la "
        "inversión inicial requerida asciende a USD 87.694 (con una "
        "necesidad acumulada de capital de USD 122.302 al cierre del "
        "año 1); los ingresos crecen de USD 693.651 en el año 1 a USD "
        "4.012.723 en el año 5; el EBITDA alcanza USD 340.647 al quinto "
        "año (8,5% sobre ingresos) y el resultado neto USD 215.204. El "
        "Valor Actual Neto del proyecto es de USD 82.015 sin perpetuidad "
        "y USD 345.724 incluyendo valor terminal, con una Tasa Interna "
        "de Retorno del 48% y del 77% respectivamente, ambos "
        "sustancialmente superiores al WACC. El período de recupero "
        "tradicional es de 35 meses (2,88 años) y el descontado de 44 "
        "meses (3,70 años), consistentes con los estándares de la "
        "industria de marketplaces digitales en etapa temprana."
    )
    page_break()


# =========================================================================
# ÍNDICE
# =========================================================================
def build_indice():
    section_title("Índice de contenidos")
    note_grey(
        "Índice automático. Para regenerarlo en Word: clic derecho sobre el "
        "bloque siguiente → Actualizar campos → Actualizar toda la tabla."
    )
    p = doc.add_paragraph()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.text = r'TOC \o "1-3" \h \z \u'
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    placeholder = OxmlElement("w:t")
    placeholder.text = "Actualizar este índice en Word con clic derecho → Actualizar campos."
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run = p.add_run()
    run._element.append(fld_begin)
    run._element.append(instr)
    run._element.append(fld_sep)
    run._element.append(placeholder)
    run._element.append(fld_end)
    page_break()


# =========================================================================
# AGRADECIMIENTOS
# =========================================================================
def build_agradecimientos():
    section_title("Agradecimientos")
    para(
        "Este Trabajo Final de Graduación es el resultado de un proceso "
        "que excedió ampliamente la mera elaboración de un documento "
        "académico. Por ello, queremos dejar constancia de nuestro "
        "reconocimiento a quienes hicieron posible el recorrido."
    )
    para(
        "A la Universidad de San Andrés y a la Escuela de Negocios, por "
        "ofrecer el marco institucional y las herramientas conceptuales "
        "que dieron forma a este proyecto. La cursada de la Licenciatura "
        "en Negocios Digitales nos permitió articular saberes que, "
        "tomados por separado, difícilmente habrían cristalizado en un "
        "plan de negocio integral como el que aquí se presenta."
    )
    para(
        "A Matías Mella, nuestro mentor, le agradecemos la disposición "
        "y la franqueza con que acompañó cada definición estratégica. "
        "Sus observaciones, especialmente en los momentos de mayor "
        "incertidumbre sobre el alcance del MVP y el modelo de negocio, "
        "resultaron determinantes para sostener el rigor del trabajo. A "
        "Carolina Ballatore, nuestra tutora académica, le debemos la "
        "guía metodológica y la mirada paciente que ordenaron el "
        "proceso desde el primer borrador."
    )
    para(
        "A los hogares, las pymes gastronómicas y los trabajadores de "
        "oficios que aceptaron compartir su experiencia en entrevistas "
        "y encuestas, nuestro reconocimiento explícito: su voz es la "
        "evidencia empírica que sostiene la totalidad del análisis. "
        "Mención particular merece el equipo de Reeparando, que abrió "
        "su operativa al examen y permitió comprender desde adentro la "
        "dinámica real del sector."
    )
    para(
        "Finalmente, a nuestras familias y a la cohorte 2026 de la "
        "Licenciatura, gracias por el sostén cotidiano durante un año "
        "que combinó exigencia académica y construcción de proyecto."
    )
    page_break()


# =========================================================================
# INTRODUCCIÓN
# =========================================================================
def build_introduccion():
    section_title("Introducción")
    para(
        "El presente Trabajo Final de Graduación expone el plan de "
        "negocio del producto digital OFIX, una plataforma de "
        "marketplace orientada a la contratación formal, segura y "
        "transparente de trabajadores de oficios en Argentina. El "
        "proyecto se inscribe en el campo de los negocios digitales y "
        "articula los marcos conceptuales y las herramientas adquiridas "
        "a lo largo de la Licenciatura en investigación de mercado, "
        "diseño de producto, modelo de negocio, marketing digital, "
        "finanzas, aspectos legales y operaciones."
    )

    h1("Motivación y relevancia")
    para(
        "La contratación de trabajadores de oficios en Argentina "
        "configura un mercado masivo y recurrente, atravesado por dos "
        "fenómenos estructurales que se refuerzan mutuamente: una "
        "informalidad laboral que alcanza el 43,2 % a nivel general y "
        "supera el 60 % en los rubros vinculados a oficios técnicos, "
        "y una dependencia casi absoluta del boca a boca como canal de "
        "contratación. Del lado de la demanda, los hogares y las "
        "pequeñas empresas resuelven sus necesidades técnicas en "
        "condiciones de baja trazabilidad, opacidad de precios y "
        "ausencia de garantías. Del lado de la oferta, los "
        "trabajadores enfrentan ingresos volátiles, dificultades para "
        "cobrar y escasa visibilidad profesional. Esa doble fricción "
        "es la oportunidad que el presente trabajo se propone "
        "transformar en una propuesta de plataforma digital capaz de "
        "aportar formalidad, confianza y eficiencia al sector."
    )

    h1("Objetivo general")
    para(
        "Diseñar un plan de negocio integral para el lanzamiento de "
        "OFIX, identificando la oportunidad de mercado, definiendo el "
        "alcance del Mínimo Producto Viable, evaluando el modelo "
        "económico-financiero asociado y proyectando la implementación "
        "del primer año de operación y la trayectoria de escalabilidad "
        "regional a cinco años."
    )

    h1("Objetivos específicos")
    bullets([
        "Caracterizar el problema en los tres segmentos de usuarios "
        "afectados: hogares, pymes gastronómicas y trabajadores de "
        "oficios.",
        "Validar la oportunidad mediante investigación cualitativa "
        "(entrevistas en profundidad) y cuantitativa (encuesta con 102 "
        "respuestas de demanda y 21 de oferta).",
        "Definir la propuesta de valor diferencial y el alcance del "
        "MVP a partir de una priorización MoSCoW.",
        "Construir el Business Model Canvas y el Value Proposition "
        "Canvas, y dimensionar la oportunidad mediante el cálculo de "
        "TAM, SAM y SOM.",
        "Diseñar la estrategia de marketing digital y el plan de medios "
        "validado con pruebas reales de campañas en Meta Ads y Google "
        "Ads.",
        "Proyectar la estructura económico-financiera del proyecto y "
        "sus principales indicadores (CAC, LTV, P&L, TIR y VAN).",
        "Identificar el marco regulatorio y los aspectos legales "
        "relevantes para una plataforma de intermediación de servicios "
        "en Argentina.",
        "Elaborar el plan de implementación trimestral del primer año, "
        "el análisis de riesgos y la proyección de escalabilidad "
        "regional.",
    ])

    h1("Metodología")
    para(
        "El trabajo combina fuentes primarias y secundarias. Las "
        "fuentes primarias se construyen sobre cuatro instrumentos: "
        "una encuesta cuantitativa con 102 respuestas del lado de la "
        "demanda y 21 del lado de la oferta; ocho entrevistas en "
        "profundidad distribuidas entre los tres segmentos objetivo "
        "—dos a trabajadores (un electricista y un pintor), tres a "
        "pymes gastronómicas (La Birra Bar, un restaurante familiar de "
        "San Isidro y Fratelli Pastas), dos a hogares y una a una "
        "administradora de consorcios—; una entrevista en profundidad "
        "al competidor Reeparando para comprender la operativa real "
        "del sector; y pruebas reales de campañas de adquisición "
        "ejecutadas durante 2025 en Meta Ads y Google Ads con "
        "presupuestos controlados."
    )
    para(
        "Como fuentes secundarias se utilizan datos oficiales del "
        "INDEC sobre informalidad laboral y mercado de trabajo, "
        "informes de CIPPEC sobre los costos económicos y sociales de "
        "la informalidad, proyecciones macroeconómicas de BBVA "
        "Research, estadísticas de adopción digital de DataReportal, "
        "trabajos del CONICET sobre regulación del trabajo de "
        "plataformas en Argentina, información de ARCA respecto de la "
        "inscripción societaria, y datos públicos de plataformas "
        "comparables —TaskRabbit, Thumbtack, IguanaFix, GetNinjas, "
        "Zolvers, HomeSolution, Habitissimo, Angi, Airtasker, Urban "
        "Company y Porch Group—."
    )

    h1("Estructura del documento")
    para(
        "El documento se organiza en siete capítulos sucesivos. El "
        "Capítulo I aborda la evaluación del problema, los usuarios "
        "afectados, el mapeo causal, las User Personas y los hallazgos "
        "de la investigación primaria, incluyendo las ocho entrevistas "
        "en profundidad y las síntesis cuantitativas. El Capítulo II "
        "desarrolla la solución de producto digital: descripción "
        "preliminar, MVP, Business Model Canvas, Value Proposition "
        "Canvas, FODA, benchmark competitivo de once plataformas, "
        "matriz de posicionamiento, prototipo navegable, "
        "dimensionamiento de mercado (TAM, SAM, SOM) y los análisis "
        "estratégicos PESTEL, cinco fuerzas de Porter, cadena de valor "
        "y tipología de Barney. El Capítulo III aborda el plan de "
        "marketing y la estrategia de adquisición segmentada por tipo "
        "de usuario, incluyendo el embudo de conversión AARRR. El "
        "Capítulo IV detalla la composición del equipo, las "
        "habilidades técnicas, de liderazgo y blandas, y la evolución "
        "esperada de la estructura. El Capítulo V cubre el modelo "
        "económico-financiero —costos variables, costos fijos, "
        "proyección PxQ, P&L, unit economics, NOF, CAPEX, flujo de "
        "fondos libres, TIR, VAN y escenario macroeconómico—. El "
        "Capítulo VI desarrolla los aspectos legales por trimestre. "
        "El Capítulo VII presenta el plan de implementación operativa "
        "del primer año y la proyección de escalabilidad regional. El "
        "documento cierra con conclusiones generales, bibliografía en "
        "formato APA y anexos."
    )
    page_break()


# =========================================================================
# CAPÍTULO I — EVALUACIÓN DEL PROBLEMA
# =========================================================================
def build_capitulo_I():
    section_title("Capítulo I — Evaluación del problema")

    # 1.1 Descripción del problema (texto literal de la tesis - p.2)
    h1("1.1 Descripción del problema")
    para(
        "En el contexto argentino, la contratación de trabajadores de oficio "
        "—plomería, electricidad, cerrajería, gas, entre otros— se encuentra "
        "atravesada por el alto nivel de desempleo sumado a la informalidad "
        "laboral. La mayoría de estos trabajadores carece de mecanismos para "
        "construir reputación profesional, acceder de manera estable a nuevos "
        "clientes o contar con coberturas básicas frente a accidentes o "
        "enfermedades."
    )
    para(
        "Hoy la solución es fragmentada: los hogares y pequeños comercios "
        "dependen del boca a boca, grupos de WhatsApp o publicaciones en "
        "redes/plataformas generalistas (p. ej., Facebook Marketplace), con "
        "resultados heterogéneos y poca verificación. Existen plataformas "
        "locales que listan profesionales o generan leads (p. ej., "
        "HomeSolution, Habitissimo) y verticales más acotadas por rubro "
        "(p. ej., Zolvers para limpieza), pero su alcance es parcial: la "
        "contratación, el pago y la garantía del servicio suelen ocurrir por "
        "fuera, sin resolver de punta a punta los problemas de confianza, "
        "transparencia de precios, cobro seguro y respaldo."
    )
    para(
        "A su vez, los hogares y, en particular, las pequeñas empresas "
        "(incluyendo gastronómicas), enfrentan dificultades para resolver "
        "urgencias técnicas con rapidez y confianza, dado que la oferta que "
        "existe actualmente resulta fragmentada, poco transparente y sin "
        "garantías de calidad. Esta situación genera una problemática masiva "
        "que afecta tanto a quienes demandan el servicio (individuales y "
        "pymes) como a quienes ofrecen servicios, y que justifica el "
        "desarrollo de soluciones digitales capaces de aportar formalidad, "
        "seguridad y más eficiencia en el mercado."
    )

    # 1.2 Evidencias del problema (texto literal - p.2-4)
    h1("1.2 Evidencias del problema")
    h2("1.2.1 Causas y datos del problema")
    bullets([
        "Alta informalidad estructural en Argentina: la tasa general de "
        "informalidad laboral es 43,2% de los ocupados (Mercado De Trabajo. "
        "Tasas e Indicadores Socioeconómicos (EPH). Segundo Trimestre De "
        "2025, 2025). Esto implica que casi la mitad de la fuerza laboral "
        "carece de registro, protección y derechos formales.",
        "Sectores más críticos: construcción, servicios personales y "
        "reparaciones. En estas ramas directamente asociadas a los oficios "
        "que demandan hogares y pymes gastronómicas la informalidad es "
        "sostenidamente superior al promedio nacional. En algunos trimestres "
        "llega a superar el 60%, mostrando un problema estructural más "
        "grande (Mercado De Trabajo. Indicadores De Informalidad Laboral "
        "(EPH). Cuarto Trimestre De 2023 a Cuarto Trimestre De 2024, 2025).",
        "Composición de la informalidad: se distingue entre asalariados no "
        "registrados y cuentapropistas. Esto evidencia que tanto quienes "
        "trabajan bajo relación de dependencia como independientes sufren la "
        "falta de formalización (Mercado De Trabajo. Indicadores De "
        "Informalidad Laboral (EPH). Cuarto Trimestre De 2023 a Cuarto "
        "Trimestre De 2024, 2025).",
        "Consecuencias para los trabajadores informales: menores ingresos, "
        "falta de acceso a protección social, menor estabilidad laboral y "
        "mayor exposición a riesgos (accidentes, enfermedades).",
        "Existen regímenes como el Monotributo Social, pero la mayoría de "
        "los trabajadores carece de herramientas efectivas para formalizarse "
        "o acceder a coberturas y seguros (AFIP, Informe de Monotributo "
        "Social, 2022).",
        "Conexión con el problema de los oficios: los trabajadores de oficio "
        "forman parte de los grupos más afectados. Suelen carecer de "
        "mecanismos de formalización, reputación profesional validada y "
        "coberturas básicas, lo que refuerza la necesidad de soluciones que "
        "aporten confianza, trazabilidad y respaldo.",
        "Los hogares y pymes gastronómicas dependen del boca a boca, eso "
        "predomina para contratar oficios, deja muy baja la trazabilidad y "
        "garantías y a su vez genera riesgos y desconfianza en el cliente. "
        "Muchas veces esta informalidad atrae técnicos que no están "
        "preparados para los trabajos en los que se los contrata.",
    ])

    h2("1.2.2 Citas textuales de entrevistas")
    bullets([
        "«Sí, tuvimos un hombre que nos arregló 3 veces lo mismo y se siguió "
        "rompiendo.»",
        "«Lo que más me preocupa es que sea inexperimentado y arruine algo "
        "más allá de lo que está roto.»",
        "«No se me ocurre porque siempre que necesito algo llamó por teléfono "
        "y es muy engorroso cuando me dicen que no pueden venir en el día o "
        "me dicen que vienen y no vienen.»",
        "«Es muy difícil lograr que venga la persona.»",
    ])

    # 1.3 Usuarios afectados (literal - p.4-5)
    h1("1.3 Usuarios afectados")
    bullets([
        "Trabajadores de oficios: enfrentan ingresos inestables, falta de "
        "acceso a clientes y ausencia de cobertura laboral.",
        "Hogares urbanos: necesitan confianza, transparencia en precios y "
        "respaldo en caso de fallas.",
        "Pymes gastronómicas: priorizan rapidez, disponibilidad 24/7, "
        "facturación formal y garantía en los trabajos.",
    ])
    para(
        "Realizamos entrevistas a distintos perfiles de usuarios con el "
        "objetivo de validar la existencia del problema."
    )
    bullets([
        "Trabajadores de oficio: entrevistamos a un electricista y a un "
        "pintor.",
        "Pymes gastronómicas: conversamos con la encargada/gerente de La "
        "Birra Bar y con los dueños de un restaurante familiar. También con "
        "la administradora de un consorcio.",
        "Hogares: entrevistamos a una mujer de 65 años que vive con su "
        "marido, ambos jubilados, y a una mujer de 44 años que vive con sus "
        "tres hijas.",
    ])

    # 1.4 Mapeo del problema (literal - p.7-8)
    h1("1.4 Mapeo del problema")
    para(
        "Realizamos el mapeo del problema para ordenar y comprender en "
        "profundidad la situación que queremos investigar. En el centro "
        "colocamos el problema principal: la dificultad para conectar a "
        "trabajadores de oficios con clientes de manera rápida, confiable y "
        "segura."
    )
    para(
        "A partir de allí, identificamos las causas estructurales: la alta "
        "informalidad del sector, la fuerte dependencia del boca a boca, la "
        "falta de plataformas confiables y accesibles, los precios poco "
        "transparentes, la baja digitalización en pagos y reseñas, y la "
        "fragmentación del mercado."
    )
    para(
        "Luego analizamos las consecuencias según cada actor."
    )
    para(
        "En el caso de las PYMEs gastronómicas, se traduce en pérdida de "
        "tiempo al buscar proveedores confiables, dificultades para resolver "
        "urgencias, precios poco claros y riesgo de incumplimientos que "
        "afectan su operación."
    )
    para(
        "Para los hogares y familias, genera inseguridad al dejar entrar a "
        "un desconocido, desconfianza por experiencias previas, poca "
        "transparencia en precios y la necesidad de recurrir solo a "
        "conocidos."
    )
    para(
        "Finalmente, los trabajadores enfrentan ingresos inestables, "
        "dificultades para cobrar en tiempo y forma, baja visibilidad "
        "(dependencia de contactos personales) y pocas oportunidades de "
        "formalización laboral."
    )
    para(
        "Este mapeo nos permite tener una visión más completa del problema, "
        "ver cómo se relacionan las causas con las consecuencias y "
        "comprender que afecta de manera directa tanto a los clientes "
        "(hogares y pymes gastronómicas) como a los trabajadores de oficio."
    )
    add_image("p07_img01.png", width_cm=15,
              caption="Figura. Mapeo del problema OFIX.")

    # 1.5 User Personas (literal - p.8-10)
    h1("1.5 User Personas")
    h2("1.5.1 User Persona: Pyme Gastronómica")
    add_image("p08_img01.png", width_cm=15,
              caption="Figura. User Persona 1 — Pyme Gastronómica.")
    para(
        "Decidimos trabajar con una pyme porque los pequeños comercios, como "
        "los restaurantes, suelen tener urgencias que no pueden esperar: un "
        "problema eléctrico, una pérdida de agua o un horno que se rompe en "
        "pleno servicio. En general, no cuentan con una red de proveedores "
        "confiables y terminan resolviendo a último momento, con poca "
        "claridad en los costos y sin garantía. Este perfil nos ayuda a "
        "entender cómo viven la problemática los negocios chicos, que además "
        "dependen de estos servicios para poder seguir funcionando."
    )
    h2("1.5.2 User Persona: Trabajador de Oficio")
    add_image("p09_img01.png", width_cm=15,
              caption="Figura. User Persona 2 — Trabajador de Oficio.")
    para(
        "El trabajador independiente es un actor central de la problemática, "
        "ya que representa la oferta de servicios. Su experiencia permite "
        "entender las principales dificultades del sector: la dependencia "
        "del boca a boca para conseguir clientes, la inestabilidad en los "
        "ingresos, los problemas para cobrar a tiempo y la falta de "
        "visibilidad de su trabajo."
    )
    para(
        "Incluirlo como user persona es clave porque muestra la otra cara "
        "del mercado: no solo las necesidades de quienes contratan, sino "
        "también los desafíos de quienes ofrecen su oficio. Este perfil "
        "evidencia cómo la informalidad y la falta de canales confiables "
        "limitan sus oportunidades de crecimiento y estabilidad."
    )
    h2("1.5.3 User Persona: Persona Particular")
    add_image("p06_img01.png", width_cm=15,
              caption="Figura. User Persona 3 — Persona Particular.")
    para(
        "En este caso elegimos a una mujer joven de 30 años que se muda sola "
        "a su departamento. Es un momento de vida donde surgen distintas "
        "necesidades de servicios del hogar y todavía no tiene a quién "
        "recurrir con confianza. Pertenece a la clase media (NSE C2–C3): "
        "tiene independencia económica, pero busca claridad en los precios "
        "y seguridad en el servicio. Este perfil refleja cómo la "
        "problemática impacta en la vida cotidiana, generando mucha "
        "incertidumbre, estrés y la necesidad de contar con un trabajador "
        "confiable y accesible."
    )

    # 1.6 Hipótesis (literal - p.10)
    h1("1.6 Hipótesis")
    para(
        "Si se desarrolla una plataforma digital que conecte a trabajadores "
        "de oficios con hogares y pymes gastronómicas, ofreciendo "
        "verificación de perfiles, precios claros, pagos digitales y "
        "respaldo en cada contratación, entonces se podrá reducir la "
        "desconfianza, acelerar la resolución de urgencias y favorecer la "
        "formalización laboral en un sector caracterizado por la "
        "informalidad y la fragmentación."
    )

    # 1.7 Investigación de mercado (literal - p.10-12)
    h1("1.7 Investigación de mercado")

    h2("1.7.1 Síntesis sobre la investigación de Pymes Gastronómicas y "
       "Hogares")
    para(
        "En total recolectamos 102 respuestas de personas (individuales) y "
        "pymes gastronómicas. Tuvimos 69 respuestas de personas particulares "
        "y en menor medida por Pymes gastronómicas con 25 respuestas. Un "
        "primer dato clave es que el 96% de los encuestados contrató al "
        "menos un trabajador en el último año, lo que nos confirma la "
        "importancia y frecuencia de esta necesidad."
    )
    h3("Insights")
    bullets([
        "La informalidad laboral en oficios supera el 60% → genera "
        "desconfianza y riesgos para hogares y pymes gastronómicas.",
        "Los trabajadores de oficio carecen de reputación válida y "
        "protección social → ingresos inestables e incertidumbre.",
        "Los hogares y pymes dependen del boca a boca → baja trazabilidad, "
        "dificultad para conseguir técnicos confiables.",
        "La experiencia de usuario es frustrante: incumplimientos, "
        "reparaciones mal hechas, falta de respuesta rápida.",
    ])
    h3("¿Cómo encuentran a los trabajadores?")
    para("Los canales más utilizados para conseguir trabajadores fueron:")
    bullets([
        "Recomendación de conocidos (alrededor del 92,5%).",
        "Redes sociales como Facebook, Instagram o WhatsApp (cerca del "
        "7,5%).",
        "En menor medida, búsquedas en Google u otros medios tradicionales "
        "(6,5%).",
    ])
    para(
        "Esto confirma que existe una dependencia casi total del boca a "
        "boca, mientras que los canales digitales aún no ofrecen un espacio "
        "seguro, confiable y centralizado que concentre la oferta."
    )
    h3("Las dificultades más mencionadas")
    para(
        "Si bien un 40% indicó que en su última experiencia «no tuvo "
        "dificultades», entre quienes sí señalaron problemas, los más "
        "frecuentes fueron:"
    )
    bullets([
        "Demoras en la respuesta o en la llegada del trabajador (30%).",
        "Falta de claridad en los precios (20%).",
        "Desconfianza en la persona contratada (15%).",
    ])
    para(
        "En la escala de 1 a 5, la dificultad promedio para encontrar un "
        "trabajador de confianza fue 3,9, con una mediana de 4. Esto muestra "
        "que la mayoría percibe la tarea como bastante difícil y engorrosa."
    )
    h3("Los factores que más se valoran")
    para("Al momento de contratar, los encuestados destacan principalmente:")
    bullets([
        "Seguridad y confianza (55% del total).",
        "Recomendaciones de otros clientes (45%).",
        "Precio claro (40%).",
    ])
    para(
        "Estos resultados confirman que la confianza y la transparencia son "
        "mucho más determinantes que el costo en sí mismo."
    )
    h3("La predisposición al momento de usar una aplicación")
    para(
        "Al momento de consultar sobre la posibilidad de contar con una "
        "aplicación que muestre trabajadores verificados, con reseñas, "
        "precios claros y pagos digitales las respuestas y opiniones más "
        "destacadas fueron las siguientes:"
    )
    bullets([
        "69% dijo que sí la usaría.",
        "28% respondió «tal vez».",
        "Solo 3% dijo que no la usaría.",
    ])
    para(
        "En este caso el nivel de aceptación es muy alto, especialmente si "
        "tomamos en cuenta que el mercado aún depende por completo del boca "
        "a boca. En ambos casos (particulares y pymes gastronómicas) "
        "mostraron una predisposición positiva para usar la app, aunque las "
        "pymes gastronómicas tendieron a valorar más la rapidez de respuesta "
        "y la confiabilidad."
    )

    h2("1.7.2 Síntesis sobre la investigación de trabajadores")
    para(
        "En total recolectamos 21 respuestas de trabajadores de distintos "
        "oficios. La mayoría cuenta con una larga trayectoria en el rubro: "
        "el 47,6% lleva más de 10 años trabajando y un 33,3% entre 4 y 10 "
        "años, lo que muestra que se trata de personas con experiencia "
        "consolidada. En cuanto a la formación, un 42,9% estudió para "
        "ejercer el oficio, otro 42,9% aprendió en la práctica y un grupo "
        "menor se capacitó a través de cursos o matrícula."
    )
    h3("¿Cómo consiguen clientes?")
    para("Los resultados confirman una fuerte dependencia del boca a boca:")
    bullets([
        "El 85,7% consigue trabajos por recomendación de conocidos.",
        "Un 33,3% a través de redes sociales (Facebook, Instagram, "
        "WhatsApp).",
        "Los canales digitales más formales (plataformas) apenas alcanzan "
        "un 4,8%, lo que refleja la falta de herramientas confiables y "
        "visibles para ampliar su alcance.",
    ])
    h3("Las dificultades más mencionadas")
    para("Los principales problemas que enfrentan los trabajadores son:")
    bullets([
        "Falta de difusión de sus servicios (47,6%).",
        "Mucha competencia y pocos trabajos (42,9%).",
        "Falta de confianza del cliente (28,6%).",
        "Dificultades con el pago (28,6%).",
    ])
    para(
        "A pesar de que un 23,8% declaró no tener grandes inconvenientes, "
        "la mayoría muestra barreras claras para crecer y sostener la "
        "actividad."
    )
    h3("Dificultad para conseguir nuevos clientes")
    para(
        "En una escala de 1 a 5, la dificultad promedio fue 3,5, con más de "
        "la mitad de los encuestados señalando valores entre 4 y 5. Esto "
        "indica que conseguir nuevos clientes es un desafío recurrente y "
        "desgastante."
    )
    h3("Los factores que más valoran")
    para("Al momento de obtener un nuevo trabajo, los aspectos más valorados son:")
    bullets([
        "Que les lleguen más pedidos frecuentes (33,3%).",
        "Que el cliente confíe en ellos (28,6%).",
        "Poder mostrar su experiencia y reseñas (28,6%).",
        "En menor medida, que el pago sea rápido y seguro (9,5%).",
    ])
    para(
        "Esto confirma que la continuidad laboral y la confianza pesan "
        "tanto o más que el aspecto económico inmediato."
    )
    h3("La predisposición al momento de usar una aplicación")
    para(
        "Cuando se consultó sobre una aplicación que los conecte con "
        "clientes cercanos, permita mostrar reseñas, acordar precios claros "
        "y cobrar digitalmente, el resultado fue contundente:"
    )
    bullets([
        "90% afirmó que la usaría.",
        "10% respondió «tal vez».",
        "Ningún trabajador indicó que no la usaría.",
    ])
    para(
        "Entre los beneficios más destacados mencionaron la posibilidad de "
        "conseguir más clientes, trabajar con mayor continuidad, contar con "
        "más seguridad en los cobros y facilitar la llegada a nuevas "
        "oportunidades."
    )

    # 1.8 Insights de cada entrevista (literal - p.12-15)
    h1("1.8 Insights principales de cada entrevista")

    h2("Entrevista 1 — Encargada en La Birra Bar (PyME gastronómica)")
    para(
        "La encargada de La Birra Bar comentó que en el rubro gastronómico "
        "necesitan contratar trabajadores de oficio con muchísima "
        "frecuencia, casi cada una o dos semanas. El mayor problema que "
        "enfrentan es conseguir disponibilidad inmediata, porque cuesta "
        "encontrar alguien que pueda ir en el momento. También mencionó su "
        "preocupación por los precios abusivos en situaciones de emergencia "
        "y la falta de transparencia en los costos. Ha tenido experiencias "
        "negativas con arreglos mal hechos que se rompen enseguida, lo que "
        "refuerza la importancia de confiar en recomendaciones del barrio. "
        "Para ella, sería muy valioso contar con una plataforma que ofrezca "
        "precios claros, reseñas confiables y cercanía geográfica. Sin "
        "embargo, mantiene cierta desconfianza respecto a los pagos online "
        "y se pregunta qué porcentaje del dinero le llega realmente al "
        "trabajador."
    )

    h2("Entrevista 2 — Ama de casa, jubilada (hogar)")
    para(
        "La entrevistada comentó que suele necesitar oficios de manera "
        "ocasional, salvo jardinería, que requiere con más frecuencia. "
        "Relató la dificultad que enfrenta para conseguir trabajadores "
        "confiables en la Costa y la desconfianza que le genera cuando le "
        "piden un pago adelantado sin siquiera ver el problema. Ha tenido "
        "malas experiencias con incumplimientos de horarios, trabajos mal "
        "realizados y situaciones que la hicieron sentir incómoda en su "
        "propia casa. Para ella, la seguridad al contratar proviene de "
        "recomendaciones y de ver trabajos previos. Valora la idea de una "
        "plataforma con precios claros y opiniones, aunque le preocupa la "
        "posibilidad de que las reseñas sean falsas."
    )

    h2("Entrevista 3 — Mujer independiente, madre de dos hijas (hogar urbano)")
    para(
        "Esta entrevistada encuentra trabajadores únicamente a través de "
        "recomendaciones personales o por el consorcio. Expresó sus "
        "principales miedos: dejar entrar a desconocidos a su casa y ser "
        "estafada con los precios. Ha tenido dolores frecuentes con "
        "trabajos mal realizados y la dificultad de conseguir alguien "
        "realmente «bueno». Le gustaría poder contar con trabajadores "
        "matriculados o calificados, porque eso le daría mayor seguridad. "
        "Considera que una plataforma sería excelente siempre que tenga "
        "filtros de calidad y matrícula, e incluso sugirió un modelo de "
        "suscripción que asegure el acceso a profesionales serios."
    )

    h2("Entrevista 4 — Electricista (trabajador)")
    para(
        "El electricista contó que consigue clientes casi exclusivamente "
        "por recomendación o boca a boca. Su principal dificultad es "
        "mantenerse competitivo en un mercado donde el precio termina "
        "siendo determinante. Señaló como ventaja de la informalidad la "
        "flexibilidad para manejar tiempos y negociar pagos, aunque "
        "reconoció que los dolores vienen por el lado de la logística, los "
        "traslados y la estacionalidad de la demanda. Una plataforma le "
        "resultaría útil como vidriera y herramienta de marketing, siempre "
        "y cuando las reseñas funcionen como una garantía. Pidió que "
        "existan filtros detallados por tipo de trabajo, nivel de "
        "complejidad y matrícula. Su mayor miedo es quedar expuesto a "
        "críticas negativas públicas o a una visibilidad que considere "
        "excesiva."
    )

    h2("Entrevista 5 — Pintor (trabajador)")
    para(
        "El pintor señaló que la mayoría de sus clientes llegan por "
        "recomendación y que las redes sociales no le generan demasiados "
        "resultados. Sus principales dolores son la estacionalidad del "
        "trabajo, la competencia desleal con precios bajos y la inseguridad "
        "en los pagos. Además, manifestó frustración porque muchos clientes "
        "no valoran el oficio. Como solución, pide más visibilidad que no "
        "dependa del boca a boca, presupuestos claros y pagos seguros. "
        "Usaría una plataforma para mostrar sus trabajos, recibir reseñas "
        "y llegar a nuevos clientes, aunque ve como riesgo la posibilidad "
        "de reseñas injustas o la falta de control sobre quién puede "
        "registrarse como trabajador."
    )

    h2("Entrevista 6 — Dueña de restaurante en San Isidro (PyME gastronómica)")
    para(
        "La dueña del restaurante describió problemas constantes en cocina, "
        "salón y electricidad, que la obligan a contratar oficios "
        "prácticamente todos los meses. Uno de sus grandes dolores es la "
        "imposibilidad de conseguir disponibilidad inmediata cuando surge "
        "una urgencia. También destacó la molestia de los precios poco "
        "claros, los sobrecargos y las reparaciones que fallan. Confía en "
        "las referencias personales y valora mucho poder pagar con medios "
        "digitales. Sobre una plataforma, dijo que sería «un golazo» porque "
        "le daría rapidez, confianza y transparencia en los precios. El "
        "único riesgo que ve es que los valores terminen siendo más altos, "
        "aunque estaría dispuesta a pagarlos si el servicio es realmente "
        "confiable."
    )

    h2("Entrevista 7 — Emprendedor (Fratelli Pastas, PyME)")
    para(
        "Este emprendedor necesita trabajadores al menos una vez al mes y "
        "suele conseguirlos a través de grupos de WhatsApp, un método que "
        "considera desordenado. Mencionó como principal dolor la falta de "
        "confianza y la ausencia de mecanismos de reclamo cuando un "
        "trabajo sale mal. También resaltó la dificultad de coordinar "
        "horarios en situaciones de urgencia. Ve una plataforma como algo "
        "«genial», sobre todo por la rapidez, la claridad en los precios "
        "y la seguridad. No identificó riesgos concretos y la considera de "
        "alta utilidad para pymes que recién empiezan."
    )

    h2("Entrevista 8 — Administradora de consorcios")
    para(
        "La administradora explicó que contrata oficios todos los días: "
        "plomería, electricidad, pintura y más. A pesar de tener "
        "proveedores con años de experiencia, dijo que sigue siendo muy "
        "difícil encontrar personas realmente confiables. Ha tenido "
        "dolores con incumplimientos aun cuando hay facturas de por medio, "
        "riesgos legales y obras que quedan paradas. Trabaja con una base "
        "de proveedores estables y recomendaciones, pero reconoce que "
        "siempre hay rotación. Las urgencias le generan especial "
        "preocupación, ya que los fines de semana o feriados directamente "
        "no consigue personal. Subrayó la importancia de contar con "
        "seguridad contractual, incluyendo seguros y cláusulas de "
        "accidentes. Considera que una plataforma sería «buenísima» si "
        "suma reseñas, historial de trabajos, precios comparables y pagos "
        "seguros, y reclamó además una versión adaptada para "
        "administradores de edificios. Para ella, el rubro de "
        "mantenimiento edilicio es especialmente riesgoso y exige "
        "confianza, respaldo legal y disponibilidad inmediata."
    )

    # 1.9 Conclusiones del Entregable 1 (literal - p.24)
    h1("1.9 Conclusiones de la investigación inicial")
    para(
        "En líneas generales, la encuesta valida con evidencia empírica la "
        "hipótesis del proyecto: existe una necesidad y es real. A menudo, "
        "los clientes se enfrentan con distintas dificultades que se "
        "vinculan principalmente a la confianza, la transparencia y los "
        "tiempos de respuesta."
    )
    para(
        "Las personas y pymes gastronómicas muestran una buena y alta "
        "predisposición en adoptar una solución que sea digital y pueda de "
        "algún modo mejorar estas problemáticas."
    )

    page_break()


# =========================================================================
# CAPÍTULO II — SOLUCIÓN PRODUCTO DIGITAL
# =========================================================================
def build_capitulo_II():
    section_title("Capítulo II — Solución Producto Digital")

    # 2.1 Descripción preliminar (literal p.5)
    h1("2.1 Descripción preliminar de la solución")
    para(
        "La solución propuesta consiste en el desarrollo de una plataforma "
        "digital (WebApp) disponible como aplicación móvil y web, que "
        "conecta de forma ágil y segura a trabajadores de oficios "
        "(plomeros, electricistas, gasistas, cerrajeros, pintores, entre "
        "otros) con hogares y pymes gastronómicas. El objetivo es facilitar "
        "la contratación de servicios confiables, con precios claros, "
        "respaldo y un sistema de reseñas que brinde mayor seguridad a los "
        "clientes y a su vez oportunidad de formalizar a los trabajadores."
    )

    # 2.2 Deseabilidad (literal p.5)
    h1("2.2 Deseabilidad")
    para(
        "Actualmente, los usuarios resuelven sus necesidades a través de "
        "métodos manuales e ineficientes: recomendaciones boca a boca, "
        "clasificados digitales sin garantías o contactos informales sin "
        "reputación ni respaldo. Esto genera desconfianza, falta de "
        "transparencia y riesgos económicos."
    )
    para("La propuesta se diferencia porque ofrece:")
    bullets([
        "Confianza: perfiles verificados con identidad y antecedentes.",
        "Seguridad: microseguros incluidos en cada contratación.",
        "Formalidad: emisión de facturas simples para clientes que lo "
        "requieran (hogares y especialmente pymes gastronómicas).",
        "Disponibilidad: agenda inmediata para urgencias y opción de "
        "programar servicios recurrentes.",
    ])

    # 2.3 Factibilidad técnica (literal p.6) — equivale al stack
    h1("2.3 Factibilidad técnica y stack tecnológico")
    para(
        "El producto será una aplicación móvil y web app con funcionalidades "
        "de geolocalización, agenda, sistema de reputación, pagos digitales "
        "y emisión de comprobantes. Las tecnologías principales a emplear "
        "serían:"
    )
    bullets([
        "Frontend: frameworks móviles (Flutter/React Native).",
        "Backend: servicios en la nube (AWS/GCP) con API REST.",
        "Pagos digitales: integración con pasarelas locales (Mercado Pago, "
        "Modo, Ualá).",
        "Pagos en efectivo.",
        "Verificación de identidad: API RENAPER / servicios KYC.",
        "Verificación de títulos.",
        "Seguros embebidos: APIs de aseguradoras locales para activar "
        "cobertura por transacción.",
    ])

    # 2.4 Viabilidad — modelo de ingresos (literal p.6)
    h1("2.4 Modelo de negocio")
    para("El modelo de negocio se basará en:")
    bullets([
        "Comisión por transacción (10–15%) cobrada al cliente.",
        "Servicios premium para pymes gastronómicas: urgencias express y "
        "contratos de mantenimiento recurrente.",
        "Suscripciones para trabajadores: planes con mayor visibilidad en "
        "la app.",
        "Ingresos complementarios: venta de seguros adicionales y "
        "publicidad segmentada de marcas vinculadas a oficios.",
    ])

    # 2.5 MoSCoW (literal p.24-25)
    h1("2.5 Priorización del MVP (MoSCoW)")
    add_image("p24_img01.png", width_cm=15,
              caption="Figura. Matriz MoSCoW de priorización del MVP.")
    para(
        "Aplicamos la matriz MoSCoW, que nos permitió organizar las "
        "funcionalidades según su nivel de prioridad dentro del desarrollo "
        "del MVP."
    )
    para(
        "En la categoría Must Have definimos las funciones indispensables "
        "para validar la propuesta de valor: el registro y login de "
        "usuarios, la creación de perfiles, la búsqueda y filtrado de "
        "trabajadores, la solicitud de trabajo, el sistema básico de "
        "reputación, la integración de pagos digitales dentro de la app, el "
        "onboarding inicial y la integración básica con aseguradoras para "
        "brindar respaldo ante incidentes."
    )
    para(
        "En Should Have incorporamos elementos importantes pero no críticos "
        "para el funcionamiento inicial, como el chat interno entre cliente "
        "y trabajador, una agenda o calendario simple, el historial de "
        "trabajos, las notificaciones básicas y la opción de guardar "
        "trabajadores como favoritos."
    )
    para(
        "En Could Have incluimos funcionalidades complementarias, como el "
        "mapa interactivo de trabajadores cercanos, la landing page pública "
        "con explicación del uso y beneficios, y un panel de estadísticas "
        "para los trabajadores."
    )
    para(
        "Finalmente, en Won't Have dejamos fuera de alcance aquellas "
        "funcionalidades que exceden el marco del MVP, como el matching "
        "inteligente con IA, la automatización avanzada de agenda y "
        "reputación, o las alianzas estratégicas a gran escala."
    )

    # 2.6 Roadmap 5 años (literal p.25-26)
    h1("2.6 Roadmap de producto (2026–2030)")
    add_image("p25_img01.png", width_cm=15,
              caption="Figura. Roadmap de producto 2026–2030.")
    para(
        "El roadmap de OFiX traza la evolución progresiva del proyecto "
        "durante cinco años, articulando el desarrollo tecnológico, la "
        "estrategia comercial y el crecimiento territorial de la "
        "plataforma. La planificación se estructura en versiones anuales "
        "del producto, donde cada iteración amplía las funcionalidades, "
        "mejora la experiencia del usuario y fortalece el modelo de "
        "negocio."
    )
    h2("2.6.1 Versión 1.0 — 2026 (Validación)")
    para(
        "Durante 2026, OFiX lanza su MVP funcional (versión 1.0), con el "
        "objetivo de validar el producto y el encaje con el mercado. Se "
        "desarrollan las funciones básicas de registro y login de usuarios, "
        "creación de perfiles, búsqueda y filtrado de técnicos, reputación, "
        "pagos digitales y una integración inicial con aseguradoras. "
        "Paralelamente, se implementan campañas en Meta Ads y Google para "
        "captar usuarios con urgencias barriales, la campaña institucional "
        "«OFIX te cuida» para generar confianza, y alianzas con "
        "aseguradoras locales que brinden respaldo a las contrataciones. "
        "El alcance territorial incluye CABA y GBA como áreas de prueba y "
        "consolidación inicial."
    )
    h2("2.6.2 Versión 2.0 — 2027 (Escalado y Monetización)")
    para(
        "En 2027, se despliega la versión 2.0 – Escalado y Monetización, "
        "incorporando nuevas herramientas como chat interno, calendario de "
        "trabajos, módulo de presupuestos, panel B2B y sistema de "
        "notificaciones push. Esta etapa apunta a optimizar la coordinación "
        "entre cliente y trabajador e introducir los primeros mecanismos de "
        "monetización. El marketing se centra en campañas de temporada, "
        "contenido digital y acciones con microinfluencers para reforzar la "
        "confianza. A nivel de alianzas, se establecen convenios con "
        "cámaras de comercio, proveedores y plataformas gastronómicas, "
        "mientras el territorio se amplía al interior bonaerense y grandes "
        "ciudades como La Plata, Rosario y Córdoba."
    )
    h2("2.6.3 Versión 3.0 — 2028 (Profesionalización del Ecosistema)")
    para(
        "Durante 2028, OFiX alcanza su versión 3.0 – Profesionalización del "
        "Ecosistema, consolidando el modelo operativo y mejorando la "
        "gestión de datos. Se desarrollan dashboards de métricas, "
        "cotización automática, historial avanzado de servicios y "
        "algoritmos de precios dinámicos. También se implementa IA para "
        "matching inteligente entre usuarios y técnicos, mejorando la "
        "precisión en la selección de perfiles. En paralelo, se lanza un "
        "newsletter personalizado para fidelizar usuarios y se crean los "
        "Embajadores de marca —técnicos destacados que representan los "
        "valores del proyecto—. El año concluye con una presencia nacional "
        "fortalecida y alianzas con inmobiliarias, consorcios y fabricantes "
        "de herramientas."
    )
    h2("2.6.4 Versión 4.0 — 2029 (Inteligencia y Automatización)")
    para(
        "El año 2029 marca el inicio de la versión 4.0 – Inteligencia y "
        "Automatización, orientada a integrar tecnologías de IA y machine "
        "learning. Se suman módulos de diagnóstico por imagen, predicción "
        "de demanda por zona y optimización de performance backend. El "
        "marketing se centra en la retención de usuarios mediante "
        "automatización y en la construcción de comunidad con eventos para "
        "pymes. En esta etapa también se concretan las primeras "
        "integraciones regionales con medios de pago locales y la llegada "
        "a Uruguay y Chile."
    )
    h2("2.6.5 Versión 5.0 — 2030 (Plataforma Predictiva)")
    para(
        "Finalmente, en 2030, se lanza la versión 5.0 – Plataforma "
        "Predictiva, donde OFiX consolida su madurez tecnológica y "
        "operativa. La aplicación incorpora IA predictiva para "
        "mantenimiento, recomendaciones automáticas basadas en historial y "
        "soporte multimoneda, apuntando a la escalabilidad regional. Se "
        "afianzan las estrategias de retención automatizada y se consolida "
        "la presencia de OFiX en Latinoamérica como plataforma integral "
        "para la gestión confiable de servicios y oficios."
    )

    # 2.7 BMC (literal p.26-27)
    h1("2.7 Business Model Canvas (BMC)")
    add_image("p26_img01.png", width_cm=15,
              caption="Figura. Business Model Canvas (BMC) de OFIX.")
    para(
        "En el caso de OFIX, el Business Model Canvas permitió estructurar "
        "y visualizar los principales componentes del modelo de negocio."
    )
    para(
        "Identificamos como segmentos clave a los trabajadores de oficios "
        "independientes, que buscan mayor visibilidad, estabilidad e "
        "ingresos formales, junto con hogares y pymes gastronómicas, que "
        "necesitan resolver problemas técnicos de forma confiable, rápida "
        "y segura."
    )
    para(
        "La propuesta de valor se centra en digitalizar la relación entre "
        "ambos, ofreciendo técnicos verificados, pagos protegidos, "
        "reputación validada, transparencia en precios y seguimiento "
        "post-servicio."
    )
    para(
        "Para llegar a estos clientes, el canal principal es la plataforma "
        "digital (app/web), complementada con campañas digitales, redes "
        "sociales y marketing de contenido."
    )
    para(
        "La relación con los clientes se construye a través de reseñas y "
        "calificaciones mutuas, soporte digital personalizado y una "
        "comunidad activa en redes."
    )
    para(
        "El modelo se apoya en actividades clave como el desarrollo y "
        "mantenimiento de la plataforma, la adquisición y validación de "
        "usuarios, la gestión de reputación y el soporte post-servicio."
    )
    para(
        "Estas actividades requieren recursos estratégicos como la "
        "tecnología, la red de técnicos validados, la confianza de marca, "
        "la base de datos de clientes y el equipo de desarrollo, legal y "
        "marketing."
    )
    para(
        "Entre los socios clave se destacan las instituciones de formación "
        "técnica y cámaras de pymes, que aportan legitimidad y difusión; "
        "las aseguradoras, en caso de convenios para cobertura de "
        "servicios; y partners de marketing o programas públicos de "
        "formalización laboral."
    )
    para(
        "Las integraciones tecnológicas (pasarelas de pago o verificación "
        "de identidad) se consideran recursos clave, no socios, ya que "
        "funcionan como herramientas del sistema."
    )
    para(
        "Las fuentes de ingresos provienen de comisiones por transacción, "
        "suscripciones premium para técnicos, planes B2B de mantenimiento "
        "para pymes y, a futuro, publicidad segmentada."
    )
    para(
        "Finalmente, la estructura de costos incluye el desarrollo "
        "tecnológico, marketing digital, soporte, asesoría legal y "
        "expansión a nuevos mercados, asegurando la escalabilidad y "
        "sostenibilidad del proyecto."
    )

    # 2.8 VPC (literal p.27-29)
    h1("2.8 Value Proposition Canvas")
    h2("2.8.1 Personas y Pymes gastronómicas")
    add_image("p27_img01.png", width_cm=15,
              caption="Figura. Value Proposition Canvas — Hogares y Pymes "
                      "gastronómicas.")
    para(
        "En el caso de hogares y pymes gastronómicas, el Value Proposition "
        "Canvas refleja que sus principales necesidades son resolver "
        "reparaciones urgentes, asegurar el mantenimiento de sus "
        "instalaciones y coordinar diferentes oficios de manera rápida y "
        "confiable. Actualmente enfrentan dolores como la informalidad en "
        "las contrataciones, la dificultad para encontrar técnicos "
        "calificados, la desconfianza por riesgos de fraude o mala calidad "
        "y la pérdida de tiempo en búsquedas informales."
    )
    para(
        "Cuando logran resolver sus problemas, los clientes valoran "
        "beneficios como el acceso a técnicos de confianza, la rapidez de "
        "respuesta, la transparencia en precios y la conveniencia de tener "
        "un único contacto que resuelva todo. Sin embargo, estos beneficios "
        "son limitados y dependen de contactos personales o "
        "recomendaciones."
    )
    para(
        "La propuesta de valor de nuestra plataforma responde a estas "
        "necesidades a través de una base de técnicos verificados con "
        "reputación validada, un sistema de reseñas y puntuación, pagos "
        "digitales seguros, posibilidad de comparar precios antes de "
        "contratar, geolocalización y un servicio de atención al cliente "
        "en caso de inconvenientes. De esta forma, se reduce la "
        "desconfianza y la informalidad, mientras se generan beneficios "
        "claros en términos de rapidez, transparencia y seguridad para "
        "hogares y pymes gastronómicas."
    )

    h2("2.8.2 Trabajadores de oficio")
    add_image("p28_img01.png", width_cm=15,
              caption="Figura. Value Proposition Canvas — Trabajadores de "
                      "oficio.")
    para(
        "En el caso de los trabajadores de oficio, el Value Proposition "
        "Canvas muestra que su principal necesidad es acceder a un flujo "
        "constante de clientes que les permita generar ingresos estables y "
        "construir una reputación profesional. Actualmente, consiguen "
        "trabajos de manera informal a través del boca a boca, cobran en "
        "efectivo o transferencias sin garantías y dependen de mantener una "
        "red de contactos personales para no quedarse sin trabajo."
    )
    para(
        "Esto se traduce en dolores como la inestabilidad de ingresos, los "
        "problemas para cobrar, la falta de visibilidad frente a "
        "competidores y la desconfianza de los clientes al no contar con un "
        "respaldo formal. Si bien hoy disfrutan de ciertos beneficios como "
        "la libertad para manejar su tiempo, la posibilidad de negociar "
        "precios y los pagos inmediatos en efectivo, estas ventajas son "
        "limitadas y no les aseguran crecimiento ni continuidad."
    )
    para(
        "La propuesta de valor de nuestra plataforma aborda directamente "
        "estas problemáticas ofreciendo una base de clientes más amplia, "
        "un sistema de pagos seguros, perfiles profesionales con reseñas y "
        "reputación validada, geolocalización para conectar con clientes "
        "cercanos y una agenda digital para organizar mejor su trabajo. "
        "De esta manera, los trabajadores logran mayor estabilidad de "
        "ingresos, formalización, visibilidad en el mercado y "
        "oportunidades de crecimiento profesional."
    )

    # 2.9 Análisis FODA (literal p.30-35)
    h1("2.9 Análisis FODA")
    h2("2.9.1 Fortalezas")
    para(
        "OFIX se destaca por contar con una propuesta de valor clara y "
        "diferenciada, que busca conectar trabajadores calificados con "
        "hogares y pymes gastronómicas que necesitan servicios confiables "
        "y rápidos. La plataforma aborda una problemática real: la "
        "informalidad laboral y la dificultad para encontrar profesionales "
        "verificados en el rubro de mantenimiento y reparaciones."
    )
    para(
        "El desarrollo de un MVP enfocado y escalable, con funcionalidades "
        "esenciales como el registro de usuarios, creación de perfiles, "
        "sistema de búsqueda, solicitud de trabajo y reputación, permite "
        "validar el modelo de manera ágil y eficiente."
    )
    para(
        "Además, el proyecto cuenta con un equipo con visión tecnológica y "
        "social, que prioriza la experiencia del usuario y la generación "
        "de confianza mediante reseñas, valoraciones y procesos de "
        "verificación. Combinando el impacto social, diseño y enfoque "
        "intuitivo, se genera una base sólida para poder lanzar la "
        "plataforma."
    )
    bullets([
        "Geolocalización integrada con Google Maps: permite conectar a los "
        "usuarios con trabajadores cercanos, reduciendo tiempos de espera "
        "y mejorando la eficiencia en servicios urgentes.",
        "Propuesta de valor diferenciada: enfoque en oficios (plomería, "
        "gas, electricidad, limpieza, mantenimiento, etc.) y "
        "especialización en atender tanto hogares como PYMES "
        "gastronómicas.",
        "Confianza y respaldo asegurado: el usuario paga un precio "
        "levemente superior, pero obtiene trabajo garantizado, cobertura "
        "ante fallas y trabajadores verificados.",
        "Verificación de identidad y reputación interna: los perfiles de "
        "trabajadores cuentan con validación de datos, reseñas y "
        "puntuaciones, generando credibilidad desde el primer contacto.",
        "Experiencia de usuario intuitiva y moderna: diseño UX/UI centrado "
        "en la facilidad de uso, tanto para clientes como para "
        "prestadores, en formato responsive (desktop y mobile).",
        "MVP funcional y escalable: permite validar el modelo con bajo "
        "costo inicial, incorporando funcionalidades clave (login, perfil, "
        "solicitud, chat, reseñas, pagos).",
        "Modelo digital transparente: precios visibles, calificaciones "
        "públicas y canales de comunicación claros dentro de la app.",
        "Visión social y de formalización laboral: busca transformar el "
        "trabajo informal en oportunidades estables y trazables, con "
        "beneficios tanto para el trabajador como para el cliente.",
        "Capacidad de segmentación geográfica y profesional: el sistema "
        "puede filtrar trabajadores por zona, especialidad y "
        "disponibilidad, optimizando la coincidencia entre oferta y "
        "demanda.",
        "Potencial de alianzas estratégicas: posibilidad de convenios con "
        "aseguradoras, cámaras de oficios y municipios para aumentar "
        "confianza y difusión.",
    ])

    h2("2.9.2 Oportunidades")
    para(
        "En el contexto actual hay una gran oportunidad de crecimiento "
        "para OFIX. El aumento del uso de plataformas digitales y la "
        "expansión del trabajo independiente post pandemia favorecen la "
        "adopción de soluciones que profesionalicen los servicios bajo "
        "demanda."
    )
    para(
        "Asimismo, existe una gran oportunidad de integrar herramientas "
        "externas que potencien el valor de la aplicación, como Mercado "
        "Pago para los pagos digitales o Google Maps para la "
        "geolocalización de trabajadores y clientes. Estas integraciones "
        "podrían mejorar la experiencia del usuario, generar confianza y "
        "facilitar la contratación por cercanía."
    )
    para(
        "Por otro lado, la falta de soluciones locales confiables en "
        "Latinoamérica abre la puerta a la expansión regional, mientras "
        "que las alianzas con aseguradoras, cámaras de oficios o programas "
        "públicos orientados a la formalización del trabajo podrían "
        "fortalecer la reputación y alcance del proyecto. En conjunto, las "
        "tendencias del mercado muestran una oportunidad clara para "
        "posicionar OFIX como una plataforma innovadora y socialmente "
        "importante."
    )
    bullets([
        "La alta informalidad laboral continúa siendo una oportunidad "
        "estructural: el 43,2% de los trabajadores argentinos se encuentra "
        "en la informalidad, y en rubros como la construcción o el "
        "servicio doméstico la cifra supera el 65%. Esto evidencia un "
        "mercado potencial para plataformas que promuevan la "
        "formalización, capacitación y trazabilidad laboral (Instituto "
        "Nacional De Estadística Y Censos De La República Argentina, "
        "n.d.).",
        "La adopción de tecnologías digitales creció de forma sostenida. "
        "Argentina cuenta con una penetración de Internet del 88,4% y más "
        "de 31 millones de usuarios de redes sociales. Esto demuestra la "
        "madurez del ecosistema digital y la oportunidad de captar tanto "
        "clientes como trabajadores a través de canales online (Kemp, "
        "n.d.).",
        "El auge de las billeteras virtuales y medios de pago digitales "
        "también potencia el modelo de OFIX. Más del 70% de los argentinos "
        "adultos utiliza algún medio de pago electrónico principalmente "
        "Mercado Pago y MODO, lo que facilita transacciones seguras dentro "
        "de la app (Pedotti, 2025).",
        "Integraciones tecnológicas disponibles: posibilidad de sumar "
        "pagos digitales, facturación automática, reseñas verificadas y "
        "geolocalización en tiempo real (Reinhold, 2025).",
        "La demanda de seguridad, respaldo y formalidad en los servicios "
        "del hogar y mantenimiento comercial sigue en aumento. Los "
        "usuarios priorizan la confianza, la reputación y la cobertura "
        "ante fallas por sobre el precio, replicando la tendencia "
        "observada en sectores como delivery o movilidad (Mercado Libre, "
        "2025).",
        "Además, existe un espacio vacío en el mercado local: actualmente "
        "no hay una plataforma integral argentina que combine "
        "geolocalización, reputación verificada, seguros y trazabilidad "
        "del servicio, lo que permite a OFIX posicionarse como un actor "
        "innovador y confiable.",
        "Creciente aceptación de precios diferenciados por servicios "
        "premium: los usuarios están dispuestos a pagar un poco más por "
        "tener respaldo y garantía (modelo validado por Zolvers y "
        "TaskRabbit).",
        "Alianzas B2B potenciales: oportunidad de vincularse con cadenas "
        "gastronómicas, aseguradoras o proveedores de materiales.",
        "Las políticas públicas orientadas a la formalización y "
        "digitalización del trabajo (como el programa «Empleo en tu "
        "Barrio» y las iniciativas de «Argentina Programa 4.0») crean un "
        "entorno favorable para alianzas público-privadas que impulsen la "
        "adopción de la plataforma.",
    ])

    h2("2.9.3 Debilidades")
    para(
        "Entre las principales debilidades de OFIX se encuentra la limitada "
        "disponibilidad de recursos económicos para invertir en marketing, "
        "desarrollo y soporte técnico en la fase inicial. Esto implica que "
        "la captación de usuarios dependerá fuertemente de estrategias "
        "orgánicas, campañas digitales localizadas y programas de "
        "referidos."
    )
    para(
        "Otra debilidad es que la verificación de perfiles y antecedentes "
        "puede requerir integraciones o servicios costosos que aún no "
        "están contemplados en el MVP."
    )
    para(
        "Por último, al tratarse de un emprendimiento en etapa temprana, "
        "la capacidad de atención al usuario y respuesta ante incidencias "
        "podría verse limitada, lo que exige diseñar procesos claros y "
        "escalables a futuro."
    )
    bullets([
        "Falta de capital inicial: limitaciones para inversión en "
        "marketing, soporte y desarrollo tecnológico avanzado.",
        "Dificultad para generar masa crítica: el modelo depende del "
        "equilibrio entre oferta (trabajadores) y demanda (clientes).",
        "Alta dependencia de la confianza inicial: sin casos de éxito o "
        "reseñas, los primeros usuarios pueden mostrarse reticentes a usar "
        "la app.",
        "Proceso de verificación costoso y complejo: integrar validaciones "
        "documentales o antecedentes puede requerir inversión adicional.",
        "Soporte y atención al cliente limitados en etapa MVP: la falta de "
        "un equipo grande puede afectar la respuesta ante reclamos o "
        "urgencias.",
        "Complejidad operativa del modelo con seguros: gestionar garantías "
        "o seguros de servicio implica estructura administrativa y "
        "seguimiento.",
        "Desafío en la retención de trabajadores: la fidelización de "
        "prestadores calificados requiere incentivos y confianza en la "
        "plataforma.",
        "Dependencia de la conexión y acceso digital: segmentos con baja "
        "alfabetización tecnológica pueden quedar excluidos.",
        "Limitaciones legales y fiscales: la formalización implica "
        "requisitos de monotributo y facturación, que algunos trabajadores "
        "podrían rechazar.",
    ])

    h2("2.9.4 Amenazas")
    para(
        "El entorno competitivo representa uno de los principales "
        "desafíos. Existen plataformas consolidadas en el sector, que "
        "cuentan con recursos, usuarios y posicionamiento. Diferenciarse "
        "de ellas requerirá una propuesta de valor centrada en la "
        "confianza, la simplicidad y la especialización local y la "
        "implementación de actividades dentro de la app que se diferencien."
    )
    para(
        "Asimismo, la desconfianza cultural hacia los pagos digitales y "
        "las nuevas plataformas puede ralentizar la adopción inicial, "
        "especialmente en segmentos menos digitalizados, esto es más una "
        "amenaza en las personas adultas ya que la mayoría de los jóvenes "
        "se maneja con pagos digitales en su día a día."
    )
    para(
        "A nivel macroeconómico, factores como la inflación, la "
        "inestabilidad económica o posibles cambios regulatorios en el "
        "trabajo independiente podrían afectar la demanda y la "
        "operatividad del negocio pero en baja escala ya que en situaciones "
        "de emergencia, los usuarios deben de contratar el servicio igual. "
        "Finalmente, el riesgo de incumplimientos o malas experiencias por "
        "parte de los usuarios también constituye una amenaza a la "
        "reputación, por lo que será clave implementar mecanismos de "
        "reputación, soporte y mediación sólidos desde las primeras "
        "etapas."
    )
    bullets([
        "Alta informalidad laboral en el país: en Argentina "
        "aproximadamente el 42% de los ocupados trabaja en condiciones "
        "informales, sin acceso a derechos laborales básicos (Resaltador, "
        "2025).",
        "Sector informal en los oficios y domésticos: por ejemplo, en "
        "servicio doméstico la tasa de informalidad alcanza 77% y en "
        "construcción 67%. Esto implica que muchos potenciales "
        "trabajadores de OFIX operan ya en la informalidad y pueden ver la "
        "plataforma como un coste o riesgo (Resaltador, 2025).",
        "Marco regulatorio para trabajo en plataformas poco desarrollado "
        "/ en debate: en Argentina la regulación del trabajo realizado vía "
        "plataformas digitales plantea desafíos propios, sin un esquema "
        "plenamente consolidado. Esto genera incertidumbre sobre "
        "obligaciones laborales, impuestos, retenciones o vínculos "
        "laborales de los prestadores (Pereyra, 2022).",
        "Dependencia de digitalización / brechas tecnológicas: el alto "
        "nivel de informalidad y el sector de bajos ingresos implica que "
        "parte de la oferta o demanda target tiene menor acceso a "
        "herramientas digitales, lo cual limita la adopción de plataformas "
        "digitales como OFIX (Unidas, n.d.).",
        "Inestabilidad económica e inflación: puede reducir la demanda de "
        "servicios y complicar la operatoria de pagos (Inflación: Estas "
        "Son Las Causas Y Herramientas Para Combatirla, 2025).",
        "Entrada de actores internacionales: plataformas globales como "
        "TaskRabbit podrían desembarcar en Latinoamérica a mediano plazo.",
        "Presencia de modelos informales y gratuitos: redes sociales y "
        "grupos de Facebook siguen siendo canales de contratación sin "
        "costo ni regulación (Electricistas De Argentina, n.d.).",
        "Resistencia cultural a la formalización: muchos trabajadores "
        "prefieren operar en negro para evitar impuestos o trámites "
        "(Origlia, 2024).",
        "Regulaciones laborales o impositivas cambiantes: podrían "
        "incrementar los costos operativos del modelo formal.",
        "Barreras tecnológicas: limitaciones en la adopción de pagos "
        "digitales o conectividad en zonas periféricas.",
        "La entrada de posibles actores internacionales como TaskRabbit. "
        "Actualmente está posicionado en Europa y Estados Unidos. Hoy en "
        "día la app está presente en 40 ciudades y continúa con planes de "
        "expansión hacia otros países. Aún no hay planes sobre expansión a "
        "Latinoamérica.",
    ])

    # 2.10 Benchmark — 11 competidores (literal p.15-22 y p.37-42)
    h1("2.10 Marco competitivo: Benchmark")
    para(
        "El benchmarking realizado permite comparar las principales "
        "plataformas de servicios y oficios —tanto locales como "
        "internacionales— con el objetivo de identificar buenas prácticas, "
        "brechas de mercado y oportunidades estratégicas para OFIX."
    )

    h2("2.10.1 Reeparando — Entrevista en profundidad")
    para(
        "La empresa analizada funciona como intermediaria entre clientes y "
        "trabajadores de oficios/hogar. La estructura es clara: cuentan con "
        "una persona de ventas, alguien que gestiona clientes y un "
        "publicista; mientras que los trabajadores solo ejecutan los "
        "servicios en nombre de la empresa. Inicialmente comenzaron "
        "ofreciendo reparaciones, pero el mercado y la demanda los empujó "
        "a sumar servicios de limpieza, donde encontraron un nicho con gran "
        "oferta de postulantes. Actualmente trabajan con dos verticales "
        "principales: reparaciones del hogar y limpieza, y proyectan "
        "desarrollar un portal web exclusivo para limpieza."
    )
    h3("Modelo de captación de trabajadores")
    bullets([
        "Reclutamiento a través de plataformas de empleo, donde los "
        "candidatos envían CVs.",
        "Alta rotación y perfiles muy variados (21 a 55 años).",
        "Evaluación práctica: se prioriza la experiencia real y lo que "
        "cada persona sabe hacer, incluso si sólo se postula como "
        "«ayudante».",
        "Condición de contratación: monotributo, aunque no todos los "
        "trabajadores quieren facturar.",
        "La empresa intenta blanquear lo más posible por cuestiones "
        "impositivas y de seguros.",
    ])
    h3("Gestión y garantías")
    bullets([
        "Los clientes valoran la «cara visible» de la empresa, que "
        "responde cuando un trabajador falla.",
        "Ejemplo: en casos donde un pintor comete un error y desaparece, "
        "la empresa cubre el trabajo y asume la garantía.",
        "Esto implica un costo adicional pero fortalece la confianza del "
        "cliente.",
    ])
    h3("Pagos y financiamiento")
    bullets([
        "Para clientes: aceptan efectivo, transferencia y tarjeta (incluso "
        "en cuotas).",
        "Para trabajadores: el pago es inmediato, independientemente de "
        "que la empresa reciba el dinero días después (ej. acreditación "
        "de tarjeta en 5 días).",
    ])
    h3("Principales aprendizajes del benchmark")
    bullets([
        "El nicho de limpieza es masivo y con sobreoferta de mano de obra.",
        "La garantía institucional de la empresa genera confianza frente a "
        "la informalidad de algunos técnicos.",
        "La gestión de pagos diferidos al cliente vs. pago inmediato al "
        "trabajador es un desafío financiero operativo.",
        "La calidad técnica y, sobre todo, el trato con el cliente son "
        "factores críticos. Un trabajador hábil pero con maltrato puede "
        "dañar la experiencia.",
        "La formalización parcial (monotributo + seguros) es una ventaja "
        "competitiva, pero se enfrenta a la resistencia de algunos "
        "trabajadores que prefieren la informalidad.",
    ])

    h2("2.10.2 HomeSolution")
    para(
        "En Argentina, HomeSolution se presenta como una de las plataformas "
        "de oficios más completas del mercado. Su propuesta se basa en "
        "conectar usuarios que necesitan resolver reparaciones o mejoras en "
        "el hogar con técnicos y profesionales disponibles. El "
        "funcionamiento es bastante simple: el cliente publica una "
        "necesidad, recibe múltiples presupuestos y luego decide con quién "
        "trabajar. El modelo es lead-gen, es decir, la plataforma actúa "
        "como intermediaria para el contacto y la reputación, pero en la "
        "práctica los pagos y acuerdos se terminan cerrando por fuera. "
        "Esto genera visibilidad y competencia entre profesionales, pero "
        "limita el control de la experiencia y deja expuesto al cliente a "
        "riesgos de incumplimiento o falta de garantías. Desde un análisis "
        "de benchmark, HomeSolution muestra que existe una demanda latente "
        "por comparadores de precios y perfiles, aunque la falta de un "
        "esquema integral de pagos digitales y seguros abre una brecha que "
        "OFIX podría capitalizar."
    )

    h2("2.10.3 Habitissimo")
    para(
        "Habitissimo, de origen español, tiene presencia en Argentina y "
        "opera con una lógica similar a HomeSolution. El foco está en "
        "ofrecer un directorio digital de profesionales donde los clientes "
        "publican proyectos y reciben presupuestos de manera gratuita. Su "
        "fortaleza es la amplitud de categorías y la capacidad de reunir "
        "una gran base de profesionales en un solo lugar, lo que "
        "simplifica la búsqueda para el usuario. Sin embargo, al igual que "
        "en otros modelos de generación de leads, Habitissimo no controla "
        "el pago ni el cumplimiento del servicio. Esto lo convierte más en "
        "una plataforma de visibilidad que en un ecosistema de confianza. "
        "En términos de benchmark, su principal aporte es la validación de "
        "que los clientes buscan alternativas digitales para comparar "
        "presupuestos y reputación, aunque sigue presente la debilidad "
        "estructural: la experiencia completa no está garantizada."
    )

    h2("2.10.4 Zolvers")
    para(
        "Zolvers nació en Argentina con un enfoque diferenciado: en lugar "
        "de abarcar todos los oficios, se especializó en tareas domésticas "
        "y limpieza, donde la informalidad y la inseguridad eran problemas "
        "muy marcados. La plataforma innovó al ofrecer perfiles "
        "verificados, historial de trabajadoras y contratación digital, lo "
        "que le permitió captar usuarios preocupados por la confianza y la "
        "formalización. Este diferencial fue su mayor fortaleza, ya que "
        "resolvió uno de los principales «pains» de este mercado: la "
        "incertidumbre al contratar. Sin embargo, al mantenerse en un "
        "nicho específico, su alcance es más limitado frente a "
        "marketplaces generalistas. Para OFIX, Zolvers sirve como ejemplo "
        "de cómo la verificación de trabajadores puede transformarse en "
        "una ventaja competitiva clara y un elemento clave de la propuesta "
        "de valor, más aún si se combina con pagos digitales y soporte "
        "posventa."
    )

    h2("2.10.5 IguanaFix")
    para(
        "IguanaFix fue uno de los casos más relevantes de Argentina. Nació "
        "como una app que ofrecía servicios de reparación y mantenimiento, "
        "con técnicos verificados y sistema de reputación, y llegó a "
        "levantar capital para expandirse a Brasil. En su momento fue un "
        "referente de innovación local, validando que existía un mercado "
        "dispuesto a contratar oficios por vía digital. Sin embargo, su "
        "actividad en Argentina fue disminuyendo y hoy su presencia se "
        "concentra más en Brasil. Desde el análisis de benchmark, "
        "IguanaFix deja varias lecciones: por un lado, que el mercado "
        "local tiene interés por una solución tecnológica; por otro, que "
        "la escalabilidad y la retención de usuarios no son fáciles en un "
        "contexto de alta informalidad y baja bancarización. La clave que "
        "OFIX puede tomar de este antecedente es la necesidad de construir "
        "confianza y asegurar transacciones dentro de la plataforma para "
        "evitar fugas y sostener el modelo a largo plazo."
    )

    h2("2.10.6 Taskrabbit")
    para(
        "En el plano internacional, Taskrabbit es un referente "
        "indiscutido. Operando en EE. UU. y varios países de Europa, su "
        "modelo es end-to-end: los clientes pueden reservar el servicio, "
        "pagar dentro de la app, y cuentan con soporte y garantías. La "
        "empresa cobra un «service fee» al cliente y un «trust & support "
        "fee» adicional, lo que le permite monetizar sin friccionar tanto "
        "la relación con los trabajadores. Este modelo logra lo que las "
        "plataformas argentinas todavía no: generar confianza completa a "
        "través de la digitalización de toda la experiencia, desde la "
        "contratación hasta el pago y el respaldo en caso de problemas. "
        "Para OFIX, Taskrabbit es un espejo de hacia dónde puede "
        "evolucionar: convertirse en un estándar de seguridad y "
        "formalización en un mercado donde la informalidad es la regla."
    )

    h2("2.10.7 Thumbtack")
    para(
        "En EE. UU., Thumbtack ofrece un modelo más cercano al de "
        "HomeSolution o Habitissimo, basado en leads. Los profesionales "
        "pagan por cada conexión con un cliente potencial, pero la "
        "plataforma no interviene en el pago ni en la ejecución del "
        "servicio. Su fortaleza radica en la escala: opera en múltiples "
        "categorías y genera un volumen altísimo de interacciones, lo que "
        "le da robustez como intermediario. Sin embargo, la crítica "
        "habitual es que este modelo puede generar frustración en los "
        "profesionales, que pagan por leads que a veces no se concretan en "
        "trabajos reales. El aprendizaje de benchmark es claro: si OFIX "
        "decidiera adoptar un modelo de leads, debería complementarlo con "
        "mecanismos de garantía para los trabajadores, a fin de evitar "
        "desconfianza y desgaste."
    )

    h2("2.10.8 Angi (ex Angie's List)")
    para(
        "Angi, también en EE. UU., lleva el modelo de leads a un nivel "
        "más sofisticado. Combina leads pagos con planes de suscripción "
        "premium para los profesionales, cobrando entre 15 y 85 dólares "
        "por contacto según rubro y ubicación. Este sistema le da "
        "ingresos recurrentes y previsibles, pero también enfrenta "
        "críticas similares a las de Thumbtack: los profesionales corren "
        "el riesgo de pagar por oportunidades que no siempre se convierten "
        "en trabajos. Desde el análisis, Angi muestra que el modelo de "
        "monetización puede ser muy rentable, pero también exige balances "
        "delicados entre el valor que se promete y lo que efectivamente "
        "reciben los usuarios. OFIX podría tomar de Angi la lógica de "
        "planes escalonados, pero con mayor foco en la seguridad de la "
        "transacción."
    )

    h2("2.10.9 Airtasker")
    para(
        "Airtasker, de origen australiano, adopta un esquema híbrido muy "
        "interesante. Cobra al profesional una comisión que varía entre "
        "12,5% y 20% según su nivel dentro de la plataforma, y además "
        "aplica un cargo fijo al cliente por cada reserva. Este modelo "
        "combina lo mejor de ambos mundos: ingresos diversificados y una "
        "estructura que incentiva a los profesionales a subir de nivel, "
        "ya que la comisión disminuye. En términos de experiencia, "
        "Airtasker garantiza pagos seguros y un marco transparente, algo "
        "que aumenta la satisfacción tanto del cliente como del "
        "trabajador. Para OFIX, este caso demuestra que es posible diseñar "
        "un sistema de incentivos alineado: más trabajo y mejor reputación "
        "para el profesional implica menores costos, lo cual refuerza la "
        "retención."
    )

    h2("2.10.10 Urban Company")
    para(
        "Urban Company, de India, es el caso más avanzado del sector, al "
        "punto de considerarse un modelo «full-stack». No solo conecta "
        "clientes con trabajadores, sino que además capacita a los "
        "profesionales, les provee insumos y herramientas, y establece "
        "estándares de calidad. Esto le permite cobrar tanto comisiones "
        "como planes de suscripción, y asegurar una experiencia homogénea "
        "para el cliente. Su expansión a Medio Oriente y Asia es prueba de "
        "que este modelo es altamente escalable, aunque también más "
        "complejo en términos operativos. Desde el benchmark, la lección "
        "para OFIX es que ofrecer servicios adicionales (formación, "
        "certificaciones, garantías) puede convertirse en un diferencial "
        "fuerte frente a competidores locales que solo generan contactos."
    )

    h2("2.10.11 Porch Group")
    para(
        "Finalmente, Porch Group en EE. UU. representa un enfoque "
        "diferente. En lugar de centrarse exclusivamente en la conexión "
        "cliente-profesional, integra software y servicios con "
        "constructoras, aseguradoras y retailers. Su modelo es más B2B "
        "que B2C, pero su relevancia está en mostrar cómo se puede "
        "generar valor adicional a través de alianzas estratégicas. Para "
        "OFIX, esto abre la posibilidad de explorar convenios con "
        "consorcios, aseguradoras o proveedores de materiales, de modo de "
        "diversificar ingresos y construir un ecosistema más robusto."
    )

    h2("2.10.12 Síntesis del benchmarking")
    para(
        "En el panorama argentino, Reeparando y HomeSolution representan "
        "la competencia directa más cercana. Ambas conectan clientes con "
        "técnicos, pero sin integrar completamente la experiencia digital. "
        "Reeparando se destaca por su respaldo posventa y formalización "
        "parcial, mientras que HomeSolution ofrece transparencia mediante "
        "un comparador de presupuestos. Sin embargo, ambas presentan "
        "limitaciones en la digitalización de pagos, el seguimiento de "
        "trabajos y la escalabilidad. Zolvers, aunque enfocada en el nicho "
        "de limpieza, marca un precedente importante en términos de "
        "verificación de identidad y reputación, elementos clave para "
        "generar confianza en mercados informales. Por su parte, IguanaFix "
        "validó la demanda digital en el rubro de reparaciones, pero su "
        "declive operativo demuestra la dificultad de sostener retención y "
        "liquidez en contextos locales."
    )
    para(
        "En el plano internacional, TaskRabbit funciona como benchmark "
        "aspiracional: su modelo end-to-end —que integra contratación, "
        "pago y garantía en un mismo flujo— simboliza el estándar más alto "
        "de confianza y control de la experiencia. Este enfoque es "
        "complementado por Airtasker, que introduce un sistema de "
        "reputación con comisiones variables, y Urban Company, que "
        "expande el modelo hacia un ecosistema completo de "
        "profesionalización y equipamiento."
    )
    para(
        "En este contexto, OFIX se posiciona como una propuesta intermedia "
        "entre la informalidad local y la digitalización total de los "
        "referentes globales. Su diferencial clave reside en la "
        "geolocalización integrada con Google Maps, que optimiza la "
        "respuesta ante urgencias y mejora la eficiencia operativa. A esto "
        "se suma un enfoque dual (usuarios y trabajadores), un sistema de "
        "reputación y la proyección de incorporar matching inteligente y "
        "pagos automatizados."
    )
    para(
        "En síntesis, OFIX combina la confianza y cercanía de los modelos "
        "locales con la eficiencia digital de las plataformas "
        "internacionales, ocupando un espacio estratégico en el mercado: "
        "el de una solución confiable, rápida y tecnológicamente escalable "
        "para servicios del hogar y pymes gastronómicas."
    )

    # 2.11 Matriz de posicionamiento (literal p.42-50)
    h1("2.11 Matriz de posicionamiento")
    para(
        "La siguiente matriz muestra cómo OFIX se posiciona frente a las "
        "principales plataformas del sector en función de dos variables "
        "clave: la calidad del servicio —entendida como el grado de "
        "profesionalismo, cumplimiento y experiencia del usuario final— y "
        "la integración tecnológica con geolocalización mediante Google "
        "Maps."
    )
    para(
        "En el eje horizontal (X) se evalúa el grado en que las "
        "plataformas incorporan herramientas digitales avanzadas para "
        "mejorar la trazabilidad, el emparejamiento y la eficiencia "
        "operativa:"
    )
    bullets([
        "Uso de API de Google Maps o servicios equivalentes.",
        "Geolocalización en tiempo real de técnicos y usuarios.",
        "Asignación automática por cercanía.",
        "Seguimiento del desplazamiento y tiempos estimados.",
        "Interfaz con mapa interactivo y trazabilidad visual del servicio.",
    ])
    para(
        "A la izquierda bajo nivel de integración (procesos manuales o sin "
        "geolocalización). Mientras que a la derecha se muestra el alto "
        "nivel de integración (geolocalización avanzada y automatización "
        "total)."
    )
    para("En el eje vertical (Y) se evalúa la calidad del servicio:")
    bullets([
        "Profesionalismo y capacitación de los técnicos.",
        "Puntualidad y cumplimiento de lo pactado.",
        "Calidad del resultado final.",
        "Claridad en precios, presupuestos y condiciones.",
        "Eficiencia y soporte durante el proceso de contratación.",
        "Satisfacción de los usuarios (reseñas, puntuación, repetición del "
        "servicio).",
    ])
    para(
        "Abajo se ubica la baja calidad (servicio inconsistente o sin "
        "control de estándares) y arriba la alta calidad (profesionalismo, "
        "cumplimiento y satisfacción sostenida)."
    )
    add_image("p42_img01.png", width_cm=15,
              caption="Figura. Matriz de posicionamiento — OFIX frente a "
                      "competidores.")
    para(
        "La matriz refleja cómo OFIX se posiciona dentro del mercado de "
        "plataformas de oficios en función de dos variables clave: la "
        "integración tecnológica con geolocalización y la calidad del "
        "servicio. Mientras la mayoría de los competidores locales, como "
        "Zolvers o Reeparando, ofrecen soluciones funcionales pero con "
        "procesos todavía manuales o poco automatizados, OFIX se diferencia "
        "por incorporar desde su diseño herramientas de trazabilidad en "
        "tiempo real y localización mediante Google Maps, lo que mejora "
        "la eficiencia y la experiencia del usuario."
    )
    para(
        "En el cuadrante superior derecho, OFIX y TaskRabbit representan "
        "las propuestas con mayor nivel de desarrollo tecnológico y "
        "estándares de calidad. Sin embargo, OFIX se destaca por ser la "
        "única alternativa local que busca profesionalizar el sector de "
        "oficios combinando tecnología, formalidad y atención humana en un "
        "mismo servicio."
    )
    h2("2.11.1 Análisis comparativo (Trustpilot y Google)")
    para(
        "Tomando como referencia la información disponible en la web y las "
        "reseñas publicadas por los usuarios, se realizó un análisis "
        "comparativo del posicionamiento de las principales plataformas "
        "del sector. Para este estudio se evaluaron dos dimensiones: la "
        "calidad del servicio y el nivel de integración tecnológica con "
        "geolocalización, asignando valores del 1 al 5, donde 1 representa "
        "el nivel más bajo y 5 el más alto."
    )
    para(
        "En primer lugar, Zolvers presenta un desempeño intermedio, con 1 "
        "en integración tecnológica y 3 en calidad. La plataforma no "
        "cuenta con herramientas de geolocalización ni trazabilidad, lo "
        "que limita la coordinación entre usuarios y trabajadores. En "
        "Google acumula alrededor de 750 reseñas con una puntuación "
        "promedio de 3,7 estrellas, reflejando experiencias muy diversas. "
        "Algunos usuarios destacan la facilidad de uso y la variedad de "
        "opciones, mientras que otros mencionan cancelaciones, demoras y "
        "falta de respuesta por parte del soporte. En general, se percibe "
        "como un servicio útil, aunque con una ejecución irregular."
    )
    para(
        "Ejemplos: «Hemos utilizado el servicio varias veces y han "
        "desmejorado muchísimo», «La aplicación es intuitiva y segura», "
        "«Tuve problemas de pago y la app no se responsabilizó»."
    )
    para(
        "En segundo lugar, Reparando muestra una percepción más sólida, "
        "con 2 en integración tecnológica y 4 en calidad. Si bien no "
        "incorpora geolocalización avanzada, se destaca por la atención "
        "personalizada y la buena comunicación con los clientes. Su "
        "calificación general en Google es de 5 estrellas (56 reseñas), "
        "donde los usuarios resaltan la prolijidad, puntualidad y "
        "amabilidad del personal técnico, junto con la eficiencia en la "
        "resolución de urgencias."
    )
    para(
        "Ejemplos: «Súper prolijos y a tiempo con lo pactado», «Excelente "
        "atención y trabajo profesional», «Resolvieron una urgencia "
        "eléctrica el mismo día»."
    )
    para(
        "Por su parte, IguanaFix exhibe un rendimiento más inestable, con "
        "3 en integración tecnológica y 3 en calidad. Si bien ofrece una "
        "amplia red de técnicos y cierta ubicación referencial del "
        "profesional, las reseñas muestran problemas de coordinación, "
        "demoras en presupuestos y dificultades en la relación con los "
        "prestadores. Las experiencias son mixtas, con algunos usuarios "
        "satisfechos y otros que reportan sobreprecios o falta de "
        "seguimiento."
    )
    para(
        "Ejemplos: «Me cobraron una visita y nunca enviaron el "
        "presupuesto», «El técnico llegó puntual y cumplió bien el "
        "trabajo», «No pagan a los profesionales y sobrefacturan los "
        "servicios»."
    )
    para(
        "Finalmente, TaskRabbit se posiciona como el referente "
        "internacional del sector, con 4 en integración tecnológica y 4 en "
        "calidad. Aunque no opera localmente, en plataformas globales como "
        "Trustpilot recibe valoraciones «Excelentes», destacándose por su "
        "usabilidad, profesionalismo de los trabajadores y eficiencia del "
        "servicio."
    )
    para(
        "Ejemplos: «App clara y fácil de usar», «Los profesionales "
        "trabajan con responsabilidad», «Solo sugerir mejoras menores en "
        "la carga de información o formatos de archivo»."
    )
    para(
        "El análisis muestra que el mercado argentino de plataformas de "
        "oficios es diverso pero todavía inmaduro, con propuestas que "
        "logran conectar usuarios y técnicos, aunque presentan "
        "limitaciones en trazabilidad, consistencia y automatización."
    )
    para(
        "En este escenario, OFIX busca diferenciarse al ofrecer una "
        "solución integral que combine tecnología avanzada, validación "
        "profesional y atención humana. Su integración con Google Maps, "
        "el seguimiento en tiempo real y la garantía de respaldo la "
        "posicionan en el cuadrante de alta calidad y alta integración "
        "tecnológica, consolidándose como la alternativa local con mayor "
        "potencial para elevar los estándares del sector."
    )
    para(
        "El tamaño de los logotipos en la matriz representa la visibilidad "
        "actual de cada competidor. Zolvers e IguanaFix conservan "
        "reconocimiento por su antigüedad y volumen de usuarios; "
        "Reparando gana espacio gracias a su reputación creciente; "
        "TaskRabbit, aunque referente global, no tiene operación local."
    )
    para(
        "Por su parte, OFIX se proyecta como la plataforma líder en "
        "innovación y profesionalismo, capaz de combinar eficiencia "
        "tecnológica, confianza y cercanía humana."
    )

    # 2.12 Prototipo (literal p.50-67)
    h1("2.12 Desarrollo UX/UI y prototipado")

    h2("2.12.0 Prototipo en baja fidelidad")
    para("Prototipo en baja del lado de los usuarios:")
    add_image("p31_img01.png", width_cm=15,
              caption="Figura. Prototipo en baja — lado de los usuarios.")
    para("Prototipo en baja del lado de los trabajadores:")
    add_image("p32_img01.png", width_cm=15,
              caption="Figura. Prototipo en baja — lado de los trabajadores.")

    h2("2.12.1 Introducción")
    para(
        "En esta primera versión del prototipo de OFIX buscamos mostrar de "
        "manera clara cómo funciona la plataforma desde ambos lados: el de "
        "los usuarios (hogares o PYMES gastronómicas) y el de los "
        "trabajadores verificados de oficios."
    )
    para(
        "El objetivo fue reflejar, a través de una demo interactiva, la "
        "experiencia real de uso que tendría alguien que necesita resolver "
        "un problema en su casa o negocio, y la de quien ofrece sus "
        "servicios profesionales."
    )
    para(
        "La idea central de OFIX es simple: conectar de forma rápida, "
        "segura y confiable a quienes necesitan un servicio con "
        "trabajadores calificados y verificados."
    )
    para(
        "El prototipo fue diseñado con una interfaz limpia, intuitiva y "
        "moderna, donde cada decisión visual y funcional busca transmitir "
        "confianza, orden y facilidad de uso."
    )

    h2("2.12.2 Fase 1 — Pantalla de inicio e ingreso al sistema")
    add_image("p35_img01.png", width_cm=14,
              caption="Figura. Fase 1 — Pantalla de inicio del prototipo.")
    para(
        "La primera pantalla del prototipo es la puerta de entrada. Desde "
        "el inicio, quisimos que se entienda de inmediato qué hace OFIX: "
        "conectar usuarios con trabajadores verificados de oficios. Por "
        "eso, el mensaje principal que se ve al entrar es «Encontrá el "
        "profesional que necesitás», acompañado del subtítulo «Conectamos "
        "usuarios con trabajadores verificados de oficios. Rápido, seguro "
        "y confiable.»"
    )
    para("La interfaz es clara y directa. Hay dos caminos principales:")
    bullets([
        "«Encontrá profesional», para los usuarios que necesitan contratar "
        "un servicio (hogares o PYMES gastronómicas).",
        "«Ofrece servicios», para los trabajadores que quieren ofrecer su "
        "oficio dentro de la plataforma.",
    ])
    para(
        "Esta primera fase permite simular el flujo inicial: elegir un rol "
        "e ingresar. En este punto, todavía no hay una base de datos real "
        "conectada, pero el objetivo fue mostrar cómo se estructura el "
        "sistema y cómo se diferencian los recorridos según el tipo de "
        "usuario."
    )
    para(
        "El buscador central permite escribir el tipo de servicio que se "
        "necesita (por ejemplo: electricista, plomero, gasista, técnico de "
        "aire) y agregar una ubicación, mostrando cómo funciona el "
        "filtrado por cercanía en la versión final."
    )
    para(
        "El diseño general, con tonos azules y una estructura centrada, "
        "busca que el usuario sienta confianza y facilidad desde el primer "
        "clic."
    )

    h2("2.12.3 Fase 2 — Inicio de sesión y acceso al perfil")
    add_image("p35_img02.png", width_cm=14,
              caption="Figura. Fase 2 — Inicio de sesión.")
    para(
        "Después de elegir el tipo de usuario, se accede a la pantalla de "
        "inicio de sesión. El formulario es simple: pide email y "
        "contraseña, con las opciones de «Recordarme» y «¿Olvidaste tu "
        "contraseña?». También se puede ingresar con Google o Apple, "
        "simulando una experiencia moderna y ágil."
    )
    para(
        "Para la prueba del prototipo, agregamos cuentas demo que permiten "
        "ingresar directamente y navegar tanto como usuario "
        "(maria@example.com) como trabajador (juan@example.com), con "
        "cualquier contraseña. Esto nos permitió mostrar ambos recorridos "
        "sin necesidad de registros reales."
    )
    para("Una vez dentro, cada rol accede a un entorno distinto:")
    bullets([
        "Los usuarios pueden buscar profesionales, crear solicitudes y "
        "recibir ofertas.",
        "Los trabajadores pueden gestionar sus servicios, enviar "
        "presupuestos y controlar sus cobros.",
    ])
    para(
        "La intención de esta fase fue reflejar de forma realista el "
        "momento de ingreso, mostrando una interfaz limpia y profesional "
        "que refuerza la identidad visual de OFIX."
    )

    h2("2.12.4 Fase 3 — Experiencia del usuario (Hogar o PyME)")
    add_image("p35_img03.png", width_cm=14,
              caption="Figura. Fase 3 — Panel principal del usuario.")
    add_image("p35_img04.png", width_cm=14,
              caption="Figura. Fase 3 — Nueva solicitud.")
    add_image("p35_img05.png", width_cm=14,
              caption="Figura. Fase 3 — Buscar profesionales.")
    add_image("p35_img06.png", width_cm=14,
              caption="Figura. Fase 3 — Ofertas recibidas y mensajes.")
    para(
        "Cuando el usuario entra como hogar o PyME, llega a un panel "
        "pensado para resolver todo desde un solo lugar."
    )
    para(
        "En la pantalla principal aparece el mensaje «Bienvenido a OFFICE» "
        "y tres accesos directos:"
    )
    bullets([
        "Nueva solicitud, para crear un pedido.",
        "Buscar profesionales, para explorar trabajadores por categoría o "
        "zona.",
        "Ofertas recibidas, donde puede ver los presupuestos que le "
        "enviaron.",
    ])
    para(
        "Debajo, la app muestra una sección con profesionales cercanos, "
        "simulando cómo funcionará la geolocalización real. Allí se ven "
        "nombres, oficios, distancia, precios y calificaciones, algo "
        "fundamental para transmitir transparencia."
    )
    h3("Nueva solicitud")
    para(
        "Si el usuario hace clic en «Nueva solicitud», se abre un "
        "formulario simple con campos para el tipo de servicio, el título "
        "y una descripción del problema. También puede subir imágenes para "
        "mostrar detalles del trabajo. La idea fue hacer este proceso ágil "
        "y claro, sin pasos innecesarios, para que publicar una solicitud "
        "sea tan fácil como enviar un mensaje."
    )
    h3("Buscar profesionales")
    para(
        "Desde esta sección, el usuario puede explorar y comparar "
        "perfiles. Por ejemplo, puede ver que Juan Pérez ofrece plomería "
        "en Palermo, cobra $3500 por hora y tiene 4.8 estrellas. Esto "
        "muestra cómo se organizará la información para ayudar a elegir "
        "con confianza."
    )
    h3("Ofertas recibidas")
    para(
        "En esta pestaña el usuario puede ver las respuestas que recibió, "
        "comparar precios y decidir a quién contratar. Cada oferta muestra "
        "el presupuesto, los comentarios del profesional y el estado del "
        "pedido (pendiente, aceptado o rechazado)."
    )
    h3("Agenda")
    para(
        "La agenda muestra un calendario que permite visualizar los "
        "trabajos agendados. Aunque en esta versión no está conectada a un "
        "sistema real, sirve para mostrar cómo se organizan los servicios "
        "y reservas."
    )
    h3("Mensajes")
    para(
        "Los mensajes permiten comunicarse directamente con los "
        "trabajadores. Por ejemplo, un chat puede mostrar «Perfecto, nos "
        "vemos a las 15hs entonces», simulando la coordinación de un "
        "servicio. La idea es mantener toda la comunicación dentro de la "
        "app, sin depender de WhatsApp u otros canales externos."
    )
    h3("Favoritos")
    para(
        "Los usuarios pueden guardar a los profesionales que más les "
        "gustaron o con los que ya trabajaron bien. Esto refuerza la "
        "construcción de una red de confianza dentro de la plataforma."
    )
    h3("Mi perfil")
    para(
        "Desde el perfil, el usuario puede subir su foto, editar su "
        "información y gestionar su cuenta. Queríamos que tanto los "
        "clientes como los trabajadores tengan un espacio donde mostrar "
        "su identidad y generar cercanía y credibilidad."
    )
    para(
        "En resumen, esta parte del prototipo busca reflejar cómo sería la "
        "experiencia real de un cliente que quiere resolver un problema "
        "en pocos clics: publicar, comparar, chatear y contratar."
    )

    h2("2.12.5 Fase 4 — Experiencia del trabajador verificado")
    add_image("p36_img01.png", width_cm=14,
              caption="Figura. Fase 4 — Dashboard del trabajador.")
    add_image("p36_img02.png", width_cm=14,
              caption="Figura. Fase 4 — Buscar trabajos y mis servicios.")
    add_image("p36_img03.png", width_cm=12,
              caption="Figura. Fase 4 — Vista móvil 1.")
    add_image("p36_img04.png", width_cm=12,
              caption="Figura. Fase 4 — Vista móvil 2.")
    add_image("p36_img05.png", width_cm=12,
              caption="Figura. Fase 4 — Vista móvil 3.")
    add_image("p36_img06.png", width_cm=12,
              caption="Figura. Fase 4 — Vista móvil 4.")
    para(
        "El recorrido del trabajador tiene su propio diseño y "
        "funcionalidades específicas. Al ingresar, el profesional ve su "
        "Dashboard, un panel que le muestra un resumen de toda su "
        "actividad:"
    )
    bullets([
        "Propuestas enviadas.",
        "Trabajos activos.",
        "Calificación promedio.",
        "Ingresos del mes.",
    ])
    para(
        "Además, tiene accesos rápidos para buscar trabajos, publicar sus "
        "servicios y ver sus cobros. El objetivo fue que el trabajador "
        "sienta que OFIX es su herramienta de trabajo, algo que le permite "
        "organizar su oficio y profesionalizar su gestión."
    )
    h3("Buscar trabajos")
    para(
        "En esta sección aparecen todas las solicitudes activas de los "
        "clientes. Cada publicación muestra el tipo de trabajo, la "
        "ubicación, el presupuesto y la urgencia. El trabajador puede "
        "hacer clic en «Enviar oferta» para proponer su presupuesto o "
        "disponibilidad."
    )
    h3("Mis servicios")
    para(
        "Acá puede administrar los oficios que ofrece. Por ejemplo: "
        "Reparación de pérdidas de agua ($3500, 1–2 horas) o Instalación "
        "de iluminación LED ($4500, 2–4 horas). Puede activarlos, "
        "desactivarlos o editarlos según su disponibilidad."
    )
    h3("Mis propuestas")
    para(
        "Muestra todas las ofertas enviadas a clientes, con su estado "
        "(pendiente, aceptada, rechazada o finalizada). Esto ayuda al "
        "trabajador a hacer un seguimiento ordenado de su actividad."
    )
    h3("Cobros")
    para(
        "El módulo de cobros es una de las partes más completas. Permite "
        "ver el total ganado, el monto disponible para retirar, los pagos "
        "pendientes y el historial de operaciones (por ejemplo, "
        "transferencia bancaria o Mercado Pago). Esta parte busca "
        "transmitir confianza y transparencia, aspectos clave para "
        "formalizar la relación laboral."
    )
    h3("Agenda")
    para(
        "La agenda del trabajador replica la del usuario, pero orientada a "
        "su trabajo diario. Le permite organizar sus horarios, visualizar "
        "los servicios confirmados y evitar superposiciones."
    )
    h3("Mensajes")
    para(
        "Desde el chat, el trabajador puede coordinar directamente con el "
        "cliente. Por ejemplo: «Perfecto, nos vemos mañana a las 14hs "
        "entonces.» La idea es mantener una comunicación fluida y "
        "centralizada."
    )
    h3("Notificaciones")
    para(
        "En esta vista el trabajador puede ver todo lo nuevo: mensajes, "
        "pagos recibidos, reservas confirmadas. Le da una visión rápida "
        "de su actividad y le permite reaccionar al instante."
    )
    h3("Mi perfil y configuración")
    para(
        "Por último, el trabajador puede completar su información "
        "personal, subir su foto, actualizar sus datos y configurar sus "
        "preferencias. Todo esto contribuye a construir su identidad "
        "digital dentro de OFIX, algo esencial para la confianza de los "
        "clientes."
    )

    h2("2.12.6 Conclusión general del prototipo")
    para(
        "El prototipo de OFIX demuestra cómo se pueden integrar, en una "
        "misma plataforma, las necesidades de usuarios que buscan "
        "soluciones confiables y trabajadores que buscan oportunidades "
        "reales y organizadas. En esta versión, se simulan los flujos "
        "principales: el registro, la búsqueda, la publicación de "
        "solicitudes, el envío de ofertas, la mensajería y la gestión de "
        "cobros. Aunque todavía no hay conexión con bases de datos reales "
        "ni pasarelas de pago, el diseño refleja de manera fiel la lógica "
        "completa del producto."
    )
    para(
        "En definitiva, este prototipo busca representar cómo OFIX puede "
        "convertirse en un puente entre la formalización laboral y la "
        "eficiencia digital, simplificando el acceso a servicios de "
        "calidad y generando más oportunidades para los trabajadores "
        "verificados."
    )

    h2("2.12.7 Testeos de usabilidad — Conclusiones generales")
    para(
        "La evaluación de usabilidad muestra que OFIX posee un nivel de "
        "funcionamiento sobresaliente para un prototipo. La combinación de "
        "alta eficacia, buena eficiencia, un puntaje SUS de excelencia y "
        "un NPS positivo revela que los usuarios entienden el sistema, "
        "pueden operar sus funciones principales y perciben valor en su "
        "uso. Los hallazgos permiten concluir que:"
    )
    bullets([
        "La plataforma demuestra robustez funcional y claridad en los "
        "flujos esenciales.",
        "Existen oportunidades de mejora en tareas específicas relacionadas "
        "con el historial y la gestión de propuestas, principalmente en "
        "términos de eficiencia.",
        "La percepción subjetiva del producto es altamente favorable, lo "
        "cual valida la dirección general del diseño y la arquitectura del "
        "prototipo.",
        "Los niveles de recomendación y satisfacción sugieren que OFIX "
        "posee un potencial significativo para avanzar hacia versiones más "
        "completas y eventualmente hacia una fase beta abierta.",
    ])
    para(
        "En conjunto, los resultados apoyan la continuidad del desarrollo, "
        "priorizando ajustes sobre los flujos con mayor cantidad de pasos "
        "y mejorando la visibilidad de secciones sensibles como solicitudes "
        "y cobros."
    )

    # 2.13 TAM/SAM/SOM (literal p.52-58)
    h1("2.13 Tamaño de la oportunidad (TAM, SAM, SOM)")
    h2("2.13.1 Marco teórico")
    para(
        "En el análisis de oportunidades de mercado para emprendimientos "
        "de base tecnológica —particularmente para plataformas digitales "
        "que operan bajo lógicas de marketplace— se utilizan tres "
        "conceptos centrales para dimensionar de manera rigurosa el "
        "potencial de la industria: TAM (Total Addressable Market), SAM "
        "(Serviceable Available Market) y SOM (Serviceable Obtainable "
        "Market). Estos niveles permiten diferenciar el tamaño total del "
        "mercado, la porción realmente direccionable y la parte que la "
        "empresa puede capturar de manera efectiva."
    )
    para(
        "El TAM refiere al universo total de valor económico asociado a "
        "una industria, sin restricciones geográficas, regulatorias ni "
        "operativas. Es el máximo teórico. El SAM, en cambio, delimita la "
        "parte del TAM que efectivamente corresponde a los segmentos o "
        "regiones donde el proyecto planea operar. Finalmente, el SOM "
        "representa la fracción del SAM que la empresa puede captar "
        "durante sus primeros años, considerando la adopción realista, la "
        "competencia y las capacidades operativas."
    )
    para(
        "En el caso de OFIX, una plataforma orientada a conectar "
        "trabajadores de oficio con hogares y pymes gastronómicas, estas "
        "distinciones permiten traducir observaciones demográficas y "
        "económicas en una estimación precisa del potencial alcance "
        "inicial del proyecto. A continuación, se desarrolla la "
        "estimación del SAM regional para Argentina, Chile y Uruguay, "
        "utilizando exclusivamente el documento proporcionado."
    )

    h2("2.13.2 Contexto: el TAM latinoamericano de servicios al hogar")
    para(
        "Según DataHorizon Research (2024), el mercado latinoamericano de "
        "servicios al hogar —que incluye actividades de mantenimiento, "
        "reparación y limpieza— alcanza un valor total estimado de USD "
        "27.8 mil millones. Este valor constituye el SAM regional y "
        "funciona como punto de partida para delimitar qué parte del "
        "mercado sería accesible para la expansión inicial de OFIX."
    )
    para(
        "Sin embargo, operar en toda la región no es parte del alcance "
        "inmediato del proyecto. Por eso, es necesario concentrarse en los "
        "países donde OFIX prevé comenzar: Argentina, Chile y Uruguay. "
        "Para obtener el SAM, se debe determinar qué porcentaje de ese TAM "
        "corresponde a estos países."
    )

    h2("2.13.3 Población adulta en los países seleccionados")
    para(
        "El documento establece un criterio sólido para dimensionar la "
        "demanda potencial: utilizar la población adulta entre 18 y 75 "
        "años, rango etario que concentra la contratación de servicios "
        "domiciliarios por autonomía, ingreso disponible y responsabilidad "
        "de mantenimiento del hogar."
    )
    para("A partir de este criterio, se estiman las siguientes cifras:")
    add_table(
        ["País", "Población total", "% 18–75", "Adultos estimados"],
        [
            ["Argentina", "45,9 M", "70%", "32 M"],
            ["Chile", "19,9 M", "72%", "14,3 M"],
            ["Uruguay", "3,4 M", "70%", "2,4 M"],
            ["Total", "69,2 M", "—", "48,7 M"],
        ],
        col_widths=[4, 4, 3, 4.5],
    )

    h2("2.13.4 Población adulta total de América Latina")
    para(
        "Para realizar la comparación proporcional, el documento emplea "
        "estimaciones demográficas de la CEPAL, el Banco Mundial y "
        "Naciones Unidas (2024), que indican que América Latina cuenta con "
        "665 millones de habitantes, de los cuales aproximadamente el 70% "
        "pertenece al rango etario de 18–75 años."
    )
    para(
        "Esto equivale a: Población adulta latinoamericana = 665M × 0,70 = "
        "465,5M."
    )

    h2("2.13.5 Participación demográfica del Cono Sur en el total regional")
    para(
        "La proporción que representan Argentina, Chile y Uruguay dentro "
        "de la población adulta latinoamericana se obtiene comparando los "
        "48,7 millones de adultos de los tres países con los 465,5 "
        "millones de la región:"
    )
    para("48,7 / 465,5 = 10,5%")
    para(
        "Es decir, el Cono Sur representa el 10,5% de los adultos de "
        "América Latina, proporción que sirve como referencia directa para "
        "ajustar el TAM regional."
    )

    h2("2.13.6 Estimación del SAM subregional (Argentina, Chile y Uruguay)")
    para(
        "Aplicando esta participación demográfica al valor del TAM "
        "latinoamericano (USD 27,8 B), se obtiene el mercado potencial "
        "direccionable para OFIX en su etapa inicial de expansión:"
    )
    para("SAM = 27,8 B × 10,5% ≈ 2,9 B USD")
    para(
        "De esta manera, el SAM estimado asciende a USD 2,9 mil millones, "
        "lo que refleja la magnitud económica de los servicios de "
        "mantenimiento, reparación y limpieza demandados en el conjunto "
        "de los tres países."
    )

    h2("2.13.7 Interpretación y consistencia externa")
    para("El documento sustenta esta estimación con evidencia complementaria:")
    bullets([
        "Statista (2025) y Fitch Solutions (2025) estiman que el Cono Sur "
        "representa entre 9% y 11% del gasto regional en servicios "
        "domiciliarios, lo cual coincide con el 10,5% calculado a partir "
        "de datos demográficos.",
        "Mordor Intelligence (2024) ubica a Argentina y Chile entre los "
        "cinco mercados regionales con mayor grado de formalización y "
        "adopción digital en servicios técnicos, reforzando la idea de "
        "que este submercado posee un peso económico superior al "
        "estrictamente demográfico.",
    ])
    para(
        "Esto confirma que el valor de USD 2,9B no es solo coherente "
        "desde un punto de vista matemático, sino también en términos de "
        "estructura económica y comportamiento de mercado."
    )

    h2("2.13.8 Estimación del SOM para Argentina")
    para(
        "Una vez delimitado el potencial del mercado regional a través "
        "del SAM latinoamericano (USD 27,8 mil millones) y del SAM "
        "subregional correspondiente a Argentina, Chile y Uruguay (USD 2,9 "
        "mil millones), resulta necesario estimar el SOM específico de "
        "Argentina, dado que OFIX comenzará sus operaciones efectivamente "
        "en este país durante su primer año."
    )
    para(
        "El SOM se concentra únicamente en el mercado donde la plataforma "
        "estará disponible de manera inmediata, por lo que representa el "
        "volumen realista de demanda que OFIX puede capturar durante su "
        "fase de lanzamiento."
    )
    para(
        "El SOM constituye la fracción del SAM que puede ser capturada "
        "efectivamente por la empresa. A diferencia del SAM —que refleja "
        "el mercado direccionable total—, el SOM incorpora restricciones "
        "reales vinculadas a la capacidad operativa inicial, los recursos "
        "de marketing, el nivel de confianza y adopción digital, la "
        "disponibilidad de trabajadores verificados, la competencia "
        "informal y las barreras culturales presentes en el sector. Por "
        "estas razones, el SOM suele representar un porcentaje reducido "
        "del mercado en los primeros años de actividad."
    )
    para(
        "Para calcular el SOM, se toman como referencia modelos "
        "comparables (TaskRabbit, Thumbtack, IguanaFix, GetNinjas) y "
        "estudios de adopción digital en plataformas de oficios. La "
        "literatura sugiere que, en sectores con alta informalidad y baja "
        "adopción tecnológica inicial, la captura realista se ubica entre "
        "0,15% y 0,30% del mercado direccionable nacional durante los "
        "primeros años. Considerando el contexto argentino —informalidad "
        "superior al 60%, fuerte dependencia del boca a boca, necesidad "
        "de construir confianza entre usuarios y trabajadores, adopción "
        "digital gradual y recursos iniciales limitados— esta estimación "
        "resulta especialmente pertinente."
    )

    h2("2.13.9 SOM Argentina — escenarios")
    para(
        "A partir del análisis previo, y dado que OFIX operará "
        "exclusivamente en Argentina en su etapa inicial, el cálculo del "
        "SOM debe realizarse sobre el SAM nacional, estimado en "
        "aproximadamente USD 1,9 mil millones. Aplicando los porcentajes "
        "de adopción realista mencionados, se obtiene:"
    )
    bullets([
        "Escenario conservador (0,15%): USD 2,85 millones.",
        "Escenario base (0,20%): USD 3,80 millones.",
        "Escenario ambicioso (0,25%): USD 4,75 millones.",
        "Escenario superior (0,30%): USD 5,70 millones.",
    ])
    para(
        "Este rango refleja la fracción del mercado que OFIX puede "
        "capturar de forma efectiva en sus primeros años, considerando "
        "las restricciones operativas, la gradual adopción digital de los "
        "trabajadores, la sensibilidad al precio, la competencia informal "
        "y la necesidad de construir confianza en la contratación de "
        "servicios técnicos."
    )
    para(
        "Tomando en cuenta las proyecciones financieras del proyecto —que "
        "estiman un volumen bruto transaccionado (GMV) cercano a USD 3,5 "
        "millones hacia el año 5—, se adopta como referencia un SOM "
        "recomendado de aproximadamente USD 3,5 millones. Este valor "
        "representa un punto de equilibrio adecuado entre el potencial "
        "del mercado argentino y las capacidades reales del "
        "emprendimiento en su etapa inicial."
    )
    para(
        "En síntesis, el SOM Argentina —estimado en un rango entre USD 3 "
        "y 5 millones— constituye una base realista y consistente para "
        "proyectar ingresos, planificar la estrategia de entrada al "
        "mercado y evaluar la sostenibilidad del modelo de negocio "
        "durante sus primeros años de operación."
    )

    # 2.14 Faltantes obligatorios según guía
    h1("2.14 Análisis PESTEL")
    para(
        "El análisis PESTEL complementa el FODA al desagregar los "
        "factores macroeconómicos, sociales y regulatorios que "
        "configuran el contexto en el que OFIX deberá desplegar su "
        "estrategia. Las seis dimensiones se examinan en orden y se "
        "vinculan, cuando corresponde, con las oportunidades y "
        "amenazas ya identificadas."
    )
    h2("2.14.1 Dimensión Política")
    para(
        "Argentina atraviesa un período de reorganización institucional "
        "y de revisión normativa que afecta de manera directa al "
        "trabajo y a la economía digital. La discusión sobre el "
        "trabajo en plataformas —que ya derivó en jurisprudencia "
        "relevante para apps de reparto como Rappi y PedidosYa— se "
        "encuentra abierta y sin marco regulatorio consolidado "
        "(Pereyra, 2022). Ese vacío obliga a OFIX a un diseño "
        "contractual conservador, que explicite la condición de "
        "intermediación con los trabajadores y reduzca el riesgo de "
        "recalificación laboral. Como contrapeso positivo, varias "
        "políticas públicas orientadas a la formalización del empleo y "
        "a la digitalización de pymes —entre ellas «Argentina Programa "
        "4.0» y los programas municipales de empleo— configuran "
        "oportunidades concretas de alianza público-privada."
    )
    h2("2.14.2 Dimensión Económica")
    para(
        "El contexto macroeconómico está marcado por inflación "
        "persistente, volatilidad cambiaria y restricciones para "
        "operar en moneda extranjera (BBVA, 2025). Esa coyuntura "
        "incide sobre OFIX en cuatro planos: la fijación de precios, "
        "que demanda actualización frecuente; la estructura de costos, "
        "parcialmente denominada en dólares por la infraestructura "
        "cloud y las herramientas SaaS; la disposición a pagar de los "
        "usuarios, sensible a la compresión del ingreso disponible; y "
        "las proyecciones financieras, que la guía oficial exige "
        "presentar íntegramente en dólares. A modo de contrapeso, el "
        "ecosistema de pagos digitales se consolidó en los últimos "
        "años: más del 70 % de los adultos argentinos utiliza algún "
        "medio de pago electrónico —Mercado Pago y MODO encabezan la "
        "adopción— y reduce de forma sustantiva las fricciones de "
        "onboarding (Pedotti, 2025)."
    )
    h2("2.14.3 Dimensión Social")
    para(
        "El comportamiento social del público objetivo combina alta "
        "adopción tecnológica con persistente desconfianza hacia la "
        "contratación de servicios desconocidos. El 92,5 % de los "
        "encuestados de la investigación primaria reconoció depender "
        "del boca a boca, lo que evidencia una preferencia cultural "
        "por la recomendación interpersonal y delinea el competidor "
        "real de OFIX. Los segmentos jóvenes (18–45 años), por su "
        "parte, muestran predisposición elevada a adoptar plataformas "
        "que ofrezcan reputación verificada y pagos seguros, en línea "
        "con la trayectoria ya consolidada de delivery y movilidad. "
        "Crece, además, una sensibilidad social hacia la formalización "
        "del trabajo informal que abre espacio para un posicionamiento "
        "de marca con componente de impacto."
    )
    h2("2.14.4 Dimensión Tecnológica")
    para(
        "Argentina presenta una penetración de internet del 88,4 % y "
        "más de 31 millones de usuarios de redes sociales (Kemp, "
        "2024). Ese nivel de madurez digital habilita modelos de "
        "marketplace con onboarding íntegramente remoto. La "
        "infraestructura cloud (Google Cloud, AWS) está disponible a "
        "precios accesibles para emprendimientos en etapa temprana, y "
        "existe una oferta consolidada de servicios habilitantes "
        "—Mercado Pago para procesamiento de pagos, Google Maps para "
        "geolocalización, Veraz para validación de identidad—. La "
        "brecha digital, sin embargo, conserva relevancia: una "
        "fracción de los trabajadores de oficios presenta baja "
        "alfabetización tecnológica y exige diseños de UX "
        "simplificados y procesos de onboarding asistidos."
    )
    h2("2.14.5 Dimensión Ecológica")
    para(
        "El impacto medioambiental del modelo OFIX es bajo a moderado "
        "y se manifiesta en tres aspectos. La geolocalización por "
        "cercanía reduce el desplazamiento promedio de los "
        "trabajadores y, en consecuencia, las emisiones asociadas al "
        "transporte. La digitalización completa de la contratación, la "
        "facturación y el cobro elimina el uso de papel y los "
        "desplazamientos administrativos. Hacia el mediano plazo, la "
        "plataforma podría incorporar una vertical de servicios verdes "
        "—instalaciones eficientes, mantenimiento sustentable— acorde "
        "con tendencias de consumo responsable en hogares urbanos "
        "jóvenes."
    )
    h2("2.14.6 Dimensión Legal")
    para(
        "Cuatro bloques normativos enmarcan la operación de OFIX. El "
        "primero es la regulación societaria, dentro de la cual la "
        "figura de Sociedad por Acciones Simplificada (Ley 27.349) "
        "ofrece el vehículo óptimo para emprendimientos digitales. El "
        "segundo es la protección de datos personales bajo la Ley "
        "25.326 y su decreto reglamentario 1558/01, que obliga a "
        "inscribir la base ante la AAIP y a implementar políticas "
        "rigurosas de privacidad. El tercero es la propiedad "
        "intelectual, con registro de marca ante INPI y de software "
        "ante la DNDA. El cuarto es la regulación tributaria y "
        "laboral, donde el principal punto de atención es la "
        "calificación jurídica del vínculo entre la plataforma y los "
        "trabajadores, que debe estructurarse como intermediación y "
        "no como dependencia. Los regímenes de monotributo y "
        "monotributo social, finalmente, ofrecen una vía concreta para "
        "acompañar a los prestadores en su transición hacia la "
        "formalidad."
    )

    h1("2.15 Análisis de las cinco fuerzas de Porter")
    para(
        "El modelo de Porter permite evaluar la estructura competitiva "
        "del sector e identificar qué fuerzas resultan más vinculantes "
        "para la estrategia de OFIX. A continuación se examina cada "
        "dimensión y se cierra con una síntesis."
    )
    h2("2.15.1 Rivalidad entre competidores existentes — Media")
    para(
        "El mercado argentino reúne competidores con modelos "
        "parcialmente superpuestos pero ninguno integra una propuesta "
        "end-to-end. Reeparando se destaca por su respaldo posventa, "
        "aunque opera con estructura pesada y trabajadores propios; "
        "HomeSolution y Habitissimo funcionan como generadores de "
        "leads sin control sobre el pago ni la calidad; Zolvers domina "
        "el nicho de limpieza doméstica pero no incursiona en oficios "
        "técnicos; IguanaFix, otrora referente local, redujo su "
        "presencia y concentró operaciones en Brasil. La rivalidad es "
        "media y, en consecuencia, la diferenciación resulta "
        "alcanzable: OFIX puede posicionarse como la única alternativa "
        "local que integra verificación, pago y garantía en un único "
        "flujo digital."
    )
    h2("2.15.2 Amenaza de nuevos entrantes — Media-Alta")
    para(
        "Las barreras técnicas de entrada son moderadas: un equipo con "
        "capacidad de desarrollo puede lanzar una app de marketplace "
        "en pocos meses. Las barreras económicas, en cambio, son más "
        "exigentes —el efecto red demanda inversión sostenida para "
        "construir oferta y demanda en paralelo—, y las barreras de "
        "marca resultan determinantes, dado que la confianza "
        "constituye el atributo central de la categoría. La amenaza "
        "principal proviene de plataformas internacionales con "
        "respaldo financiero, particularmente TaskRabbit, Airtasker o "
        "Thumbtack, que podrían desembarcar en Latinoamérica en el "
        "mediano plazo. La estrategia debe priorizar, en consecuencia, "
        "la velocidad de construcción de red y la fidelización "
        "temprana basada en reputación acumulada."
    )
    h2("2.15.3 Poder de negociación de los proveedores (trabajadores) — Medio")
    para(
        "En el marketplace de doble lado, los trabajadores cumplen "
        "simultáneamente el rol de proveedores y de usuarios. Su poder "
        "de negociación es medio: en etapas iniciales OFIX necesita "
        "captarlos y retenerlos para sostener la disponibilidad de "
        "oferta, lo que les confiere capacidad de elegir entre "
        "alternativas (boca a boca, otras plataformas, redes "
        "sociales). Esa asimetría se reduce a medida que la "
        "plataforma acumula flujo constante de demanda. La "
        "investigación primaria revela que los trabajadores valoran "
        "tres atributos por encima del precio: estabilidad de clientes "
        "(33,3 %), confianza del cliente (28,6 %) y posibilidad de "
        "mostrar reputación (28,6 %), lo que aporta palancas no "
        "monetarias para construir lealtad."
    )
    h2("2.15.4 Poder de negociación de los compradores — Medio-Bajo")
    para(
        "El poder individual de los compradores es limitado: cada "
        "hogar contrata oficios con baja frecuencia —tres servicios "
        "anuales en promedio— y bajo volumen unitario, lo que reduce "
        "su capacidad de presión sobre precios. Las pymes "
        "gastronómicas exhiben mayor frecuencia (entre siete y diez "
        "intervenciones anuales) pero resultan más sensibles a la "
        "disponibilidad que al precio, sobre todo en escenarios de "
        "urgencia. El factor que más eleva el poder del comprador es "
        "la existencia de sustitutos gratuitos —boca a boca, "
        "WhatsApp, Facebook—, lo que obliga a OFIX a diferenciarse en "
        "confianza y respaldo antes que a competir por precio."
    )
    h2("2.15.5 Amenaza de productos o servicios sustitutos — Alta")
    para(
        "La amenaza competitiva más relevante no proviene de "
        "plataformas estructuradas sino de los sustitutos informales: "
        "el boca a boca interpersonal, los grupos de WhatsApp del "
        "barrio o del consorcio, las publicaciones en Facebook "
        "Marketplace y las recomendaciones del proveedor de cabecera. "
        "La investigación primaria confirma que el 92,5 % de la "
        "demanda recurre a estos canales. Tres ventajas estructurales "
        "los sostienen: son gratuitos, son inmediatos y aprovechan la "
        "confianza interpersonal preexistente. La propuesta de OFIX "
        "debe justificar el abandono del canal informal a partir de "
        "una diferencia sustantiva: la conjunción de verificación, "
        "transparencia de precios, pago seguro y garantía es "
        "precisamente ese diferencial."
    )
    h2("2.15.6 Síntesis competitiva")
    para(
        "El balance de las cinco fuerzas describe una industria con "
        "rivalidad media, amenaza elevada de sustitutos informales y "
        "barreras de entrada moderadas. La estructura resulta "
        "atractiva para OFIX en la medida en que la plataforma logre "
        "construir un foso defensivo sostenido en efecto red, "
        "reputación acumulada y marca de confianza antes del eventual "
        "ingreso de un competidor internacional con respaldo "
        "financiero."
    )

    h1("2.16 Cadena de valor de la industria")
    para(
        "La cadena de valor de los servicios técnicos al hogar y a "
        "las pymes en Argentina se extiende desde la formación del "
        "trabajador hasta el respaldo post-servicio del cliente. OFIX "
        "interviene como integrador digital de los eslabones centrales "
        "—descubrimiento, contratación, pago y respaldo— y suma valor "
        "mediante digitalización, verificación y garantía."
    )
    h2("2.16.1 Eslabones aguas arriba (oferta de trabajadores)")
    bullets([
        "Formación técnica del trabajador: escuelas técnicas, "
        "sindicatos, instituciones de capacitación y aprendizaje "
        "informal del oficio. OFIX no opera en este eslabón pero "
        "puede establecer alianzas estratégicas con instituciones de "
        "formación para captar nuevos prestadores.",
        "Habilitaciones y matriculación: relevantes para oficios "
        "regulados como gasistas (ENARGAS) o electricistas "
        "(matriculaciones provinciales). OFIX agrega valor verificando "
        "estas habilitaciones durante el onboarding.",
        "Acceso a herramientas y materiales: ferreterías mayoristas, "
        "proveedores de equipamiento y distribuidoras. Constituye un "
        "eslabón de expansión futura mediante alianzas o beneficios "
        "de compra para trabajadores afiliados.",
    ])
    h2("2.16.2 Eslabones centrales (intermediación digital — donde opera OFIX)")
    bullets([
        "Descubrimiento: hoy se resuelve mayoritariamente por boca a "
        "boca, redes sociales generalistas o plataformas de leads. "
        "OFIX centraliza oferta verificada en un único canal con "
        "geolocalización.",
        "Verificación y reputación: prácticamente inexistente en el "
        "canal informal. OFIX agrega valor mediante KYC, validación de "
        "matrículas y sistema de reseñas verificadas.",
        "Contratación y coordinación: ocurre actualmente por "
        "mensajería privada y llamadas telefónicas, con alta fricción. "
        "OFIX provee chat interno, agenda compartida y presupuesto "
        "formalizado.",
        "Pago: hoy se efectiviza en efectivo o por transferencia sin "
        "garantía. OFIX habilita pago digital protegido vía Mercado "
        "Pago, con liberación de fondos tras validación del cliente.",
        "Garantía y resolución de incidentes: inexistente o "
        "discrecional. OFIX aporta una alianza aseguradora opcional y "
        "una mesa centralizada de atención de reclamos.",
    ])
    h2("2.16.3 Eslabones aguas abajo (post-servicio y fidelización)")
    bullets([
        "Reseñas y calificación: alimentan la reputación del "
        "trabajador y retroalimentan el ciclo.",
        "Soporte post-servicio: resolución de disputas, retrabajos y "
        "reclamos.",
        "Servicios recurrentes: mantenimiento preventivo, contratos "
        "B2B para pymes, fidelización de la demanda.",
    ])
    para(
        "Dentro de esta cadena, OFIX captura valor mediante la "
        "comisión por transacción en el momento del pago. La eventual "
        "expansión hacia los eslabones aguas arriba (formación, "
        "herramientas) y aguas abajo (contratos B2B recurrentes, "
        "seguros) constituye un vector de crecimiento estratégico "
        "identificado en el análisis de Urban Company, cuyo modelo "
        "full-stack demuestra escalabilidad y rentabilidad."
    )

    h1("2.17 Tipo de industria según Barney")
    para(
        "La clasificación de tipos de industria propuesta por Jay B. "
        "Barney describe el sector en el que opera OFIX bajo tres "
        "categorías que se solapan: industria emergente, industria "
        "fragmentada e industria de red. Esa superposición "
        "condiciona la estrategia competitiva y orienta las "
        "oportunidades de construcción de ventajas sostenibles."
    )
    h2("2.17.1 Industria emergente")
    para(
        "La industria de plataformas digitales de servicios de oficios "
        "en Argentina es emergente en sentido estricto. Ningún "
        "competidor alcanzó escala dominante, no existen estándares "
        "operativos consolidados y la regulación específica se "
        "encuentra en proceso de formación. Las oportunidades "
        "competitivas características de este tipo de industria son "
        "tres: definir el estándar de calidad y experiencia, capturar "
        "usuarios tempranos con bajo costo de oportunidad y participar "
        "en la formación del marco regulatorio mediante prácticas "
        "ejemplares. OFIX puede capitalizar las tres en la medida en "
        "que actúe con velocidad durante la construcción de su red "
        "inicial."
    )
    h2("2.17.2 Industria fragmentada")
    para(
        "El mercado subyacente —la oferta y la demanda de "
        "trabajadores de oficios— es fragmentado por naturaleza: "
        "miles de trabajadores independientes con baja diferenciación, "
        "millones de hogares y pymes con demanda atomizada y ausencia "
        "de actores con economías de escala visibles. La oportunidad "
        "estratégica en industrias fragmentadas es la consolidación. "
        "El primer actor que logre instaurar estándares de calidad, "
        "concentrar la oferta y construir eficiencia operativa puede "
        "capturar una porción desproporcionada del valor. Es el "
        "patrón observado en mercados análogos en otros países, donde "
        "TaskRabbit lo replicó en Estados Unidos y Urban Company "
        "en la India."
    )
    h2("2.17.3 Industria de red (network industry)")
    para(
        "OFIX opera bajo lógica de red de doble lado: el valor que "
        "percibe el usuario crece a medida que se incorporan "
        "trabajadores, y el valor que percibe el trabajador crece con "
        "la cantidad de usuarios activos. Esa propiedad define una "
        "dinámica de winner-takes-most típica de las industrias de "
        "red: una vez que un actor alcanza masa crítica, los "
        "competidores enfrentan barreras crecientes para captar "
        "usuarios. La estrategia de OFIX debe priorizar la velocidad "
        "de construcción de red por sobre la rentabilidad inmediata, "
        "replicando el patrón de los marketplaces que lograron "
        "consolidarse."
    )
    h2("2.17.4 Síntesis estratégica")
    para(
        "La superposición de las tres caracterizaciones sugiere un "
        "rumbo claro. Primero, actuar con velocidad para definir el "
        "estándar de la categoría antes del ingreso de competidores "
        "internacionales. Segundo, consolidar la oferta fragmentada "
        "mediante verificación y reputación. Tercero, priorizar el "
        "crecimiento de ambos lados de la red en paralelo, aceptando "
        "una inversión inicial elevada como costo de construcción del "
        "foso defensivo."
    )

    page_break()


# =========================================================================
# CAPÍTULO III — PLAN DE MARKETING
# =========================================================================
def build_capitulo_III():
    section_title("Capítulo III — Plan de Marketing")

    h1("3.1 Adquisición y costo de usuarios")
    h2("3.1.1 Hogares")
    bullets([
        "Lanzamiento de campañas digitales geolocalizadas: anuncios en "
        "Meta Ads y Google, segmentados por barrios y edades que suelen "
        "contratar servicios (ej.: familias 18–75 años en CABA).",
        "Campaña de urgencia: palabras clave como «plomero urgente "
        "Palermo» o «electricista 24hs Caballito».",
        "Programas de referidos: que un usuario traiga a otro y ambos "
        "tengan un descuento o crédito.",
        "Contenido en redes: tips de mantenimiento del hogar, reels "
        "cortos mostrando soluciones rápidas → genera confianza y "
        "viralización.",
        "Generar una alianza con Mercado Pago para integrar los pagos "
        "dentro de la aplicación OFiX, ofreciendo beneficios exclusivos "
        "como descuentos en la contratación. Esta integración permitiría "
        "que nuestra plataforma aparezca en el ecosistema de Mercado "
        "Pago, aumentando la visibilidad y la confianza de los usuarios.",
    ])

    h2("3.1.2 Pymes gastronómicas")
    bullets([
        "Prospección directa: visitar bares, restaurantes y cafeterías "
        "con una propuesta clara de ahorro de tiempo y seguridad.",
        "Alianzas B2B: trabajar con asociaciones gastronómicas, cámaras "
        "de comercio o proveedores de insumos (ej.: distribuidoras de "
        "alimentos, cerveza, café) para que recomienden la app.",
        "Email marketing segmentado: base de datos de pymes "
        "gastronómicas, con mensajes enfocados en «menos pérdidas por "
        "fallas técnicas».",
        "Casos de éxito: mostrar testimonios de locales que resolvieron "
        "rápido un problema eléctrico o de gas gracias a OFiX.",
    ])

    h2("3.1.3 Trabajadores de oficio (lado de la oferta)")
    bullets([
        "Campañas en Facebook/Instagram grupos barriales: ahí buscan "
        "clientes.",
        "Convenios con sindicatos o asociaciones de oficios: ej. "
        "plomeros, electricistas.",
        "Promesa clara: «Más clientes, pagos garantizados, reputación "
        "validada».",
        "Embajadores de confianza: captar a los primeros 20–30 técnicos, "
        "y que ellos mismos difundan la plataforma si ven que les genera "
        "trabajo real.",
        "Convenio con consorcios de edificios.",
    ])

    h1("3.2 Estrategia de marketing")
    para(
        "Nuestra estrategia de marketing busca comunicar de forma clara la "
        "propuesta de valor de OFiX: ser la manera más rápida, segura y "
        "transparente de resolver problemas técnicos tanto en hogares como "
        "en pymes gastronómicas. El mensaje central será: «Tu solución "
        "confiable, a un clic»."
    )
    para(
        "Para alcanzar a los distintos segmentos se trabajará con una "
        "combinación de canales digitales y alianzas estratégicas:"
    )
    bullets([
        "Campañas geolocalizadas en Meta Ads y Google Ads, segmentadas por "
        "barrio, edad y tipo de usuario.",
        "Campañas de urgencia en buscadores (ej. «plomero urgente Palermo»).",
        "Contenido en redes sociales con tips de mantenimiento y videos "
        "cortos que muestren soluciones reales, generando confianza y "
        "viralización.",
        "Email marketing segmentado para pymes gastronómicas, con mensajes "
        "enfocados en la prevención de pérdidas por fallas técnicas.",
        "Activaciones en ferias y eventos gastronómicos para visibilizar la "
        "marca ante decisores del rubro.",
    ])
    para("En cuanto a alianzas, se buscará acelerar la adquisición de usuarios mediante:")
    bullets([
        "Integración con Mercado Pago, ofreciendo beneficios exclusivos y "
        "mayor exposición dentro de su ecosistema, lo que reduce el CAC y "
        "refuerza la confianza del usuario.",
        "Acuerdos con cámaras gastronómicas y proveedores de insumos que "
        "recomienden la aplicación a sus asociados.",
        "Convenios con sindicatos o asociaciones de oficios, para captar "
        "técnicos verificados.",
        "Alianzas con consorcios de edificios, generando flujos constantes "
        "de pedidos.",
    ])
    para(
        "El objetivo es lograr un mix eficiente de adquisición orgánica y "
        "paga, potenciando el alcance con bajo costo por usuario a través "
        "de confianza, visibilidad y referidos."
    )

    h1("3.3 Estrategia de ventas")
    para(
        "El proceso comercial combinará automatización digital con "
        "acompañamiento personalizado según el tipo de cliente."
    )
    bullets([
        "Para hogares, la conversión será 100% digital: campañas → descarga "
        "de la app → contratación → pago integrado.",
        "Para pymes gastronómicas, se aplicará un modelo curado por "
        "personas, con un equipo comercial dedicado a visitar bares y "
        "restaurantes, presentar la propuesta de valor y ofrecer "
        "onboarding asistido, y mantener contacto post-servicio para "
        "fidelizar clientes recurrentes.",
    ])
    para("Además, se contará con:")
    bullets([
        "Inside Sales para seguimiento de leads y administración de "
        "campañas digitales.",
        "Embajadores técnicos (los primeros 20–30 profesionales) como "
        "microcanal de difusión y captación del lado de la oferta.",
    ])
    para("Estrategia de canales dual:")
    bullets([
        "Canal directo (app/web) para hogares y profesionales independientes.",
        "Canal B2B para pymes gastronómicas y alianzas institucionales.",
    ])
    para(
        "El enfoque general de ventas va a estar orientado a maximizar la "
        "conversión con bajo CAC, equilibrando la escalabilidad del canal "
        "digital con la efectividad del contacto humano en segmentos de "
        "mayor valor."
    )

    h1("3.4 Plan de medios y pruebas reales de campañas")
    h2("3.4.1 Campañas realizadas con Meta Ads")
    para(
        "Para tener una idea real de cuánto nos puede costar llegar a "
        "usuarios, hicimos pruebas dentro del Administrador de Anuncios de "
        "Meta. Con un presupuesto diario de 1,5 USD, el sistema estima un "
        "alcance de entre 2.000 y 6.000 personas por día."
    )
    para(
        "Si esa campaña se mantiene durante un mes completo, la inversión "
        "total sería de USD 41, con un alcance estimado de entre 60.000 y "
        "180.000 personas en todo el mes."
    )
    para(
        "Sabemos que estos números pueden ser un poco altos para el primer "
        "trimestre del lanzamiento (Q1 2026), pero aun así nos sirven como "
        "referencia para entender cuánto puede costar cada campaña y cuál "
        "sería el alcance potencial."
    )
    para(
        "En la primera prueba configuramos la campaña para que se muestre "
        "únicamente en la Ciudad Autónoma de Buenos Aires, y seleccionamos "
        "un rango de edad de 18 a 60 años. Esto nos permitió obtener una "
        "estimación más realista del costo por alcance dentro de nuestro "
        "público objetivo."
    )
    para(
        "(Toda esta información surge de pruebas reales realizadas en Meta "
        "Ads, con el objetivo de calcular de manera más precisa el costo "
        "estimado por campaña y el alcance esperado.)"
    )

    h2("3.4.2 Campañas realizadas con Google Ads")
    para(
        "Además de las pruebas en Meta Ads, también realizamos simulaciones "
        "en Google Ads para estimar el costo de adquisición a través de "
        "búsquedas relacionadas con reparaciones del hogar (plomería, "
        "electricidad, gas, mantenimiento, etc.). Google Ads suele atraer "
        "usuarios con intención directa de contratar, por lo que es un "
        "canal importante para OFIX."
    )
    para(
        "En nuestras pruebas iniciales, configuramos campañas orientadas a "
        "búsquedas específicas en la Ciudad de Buenos Aires. Utilizamos un "
        "presupuesto diario de 1,5 USD y seleccionamos palabras clave "
        "vinculadas a servicios urgentes del hogar. Según las estimaciones "
        "del sistema, con ese monto diario Google proyecta un alcance "
        "aproximado de entre 200 y 500 clics por mes, dependiendo de la "
        "competitividad de cada palabra clave."
    )
    para(
        "El costo por clic (CPC) promedio estimado para estas categorías en "
        "Argentina varía entre 0,15 y 0,4 USD, por lo que con un "
        "presupuesto de USD 1,5 diarios esperamos obtener entre 5 y 12 "
        "clicks por día. Estos valores pueden cambiar según la demanda, el "
        "horario y la zona, pero nos sirven como referencia inicial para "
        "calcular el costo por adquisición."
    )
    para(
        "Si extendemos esta campaña durante un mes completo, la inversión "
        "total sería de alrededor de USD 41, lo que nos daría entre 150 y "
        "360 clics mensuales. Aunque estos números pueden parecer acotados "
        "si los comparamos con Meta Ads, Google Ads tiene una ventaja "
        "importante: los usuarios que ingresan por búsqueda ya tienen "
        "intención directa de resolver un problema, lo que normalmente se "
        "traduce en una tasa de conversión más alta."
    )

    h2("3.4.3 Tabla comparativa de plataformas")
    add_table(
        ["Plataforma", "Presupuesto diario", "Alcance estimado diario",
         "Alcance / clicks por mes", "CPC promedio", "Interacciones/día",
         "Ventajas"],
        [
            ["Meta Ads (FB + IG)", "1,4 USD",
             "2.000 – 6.000 personas",
             "60.000 – 180.000 (interacción)",
             "USD 0,3 – 1 aprox.",
             "80 – 150 interacciones/día aprox.",
             "Alcance, presencia, marca personal"],
            ["Google Ads (Búsqueda)", "1,4 USD",
             "Funciona por clicks",
             "150 – 360 clics por mes",
             "USD 0,10 – USD 0,27 por clic",
             "5 – 12 clics/día",
             "Intención directa, urgencias, conversiones"],
        ],
        col_widths=[3, 2.5, 3, 3, 2.5, 2.5, 3],
    )
    para(
        "(Esta estimación surge de simulaciones reales dentro del "
        "administrador de Google Ads, con el objetivo de proyectar cuánto "
        "podría costar la adquisición por búsqueda en el primer trimestre "
        "del lanzamiento.)"
    )

    h1("3.5 KPIs principales del producto y del negocio")
    para(
        "Con el objetivo de monitorear el desempeño operativo y comercial "
        "de OFIX durante su primer año, se estableció un conjunto de "
        "indicadores clave (KPIs) que permiten evaluar la adopción del "
        "producto, la eficiencia del servicio y la sostenibilidad del "
        "modelo de negocio. Estos indicadores funcionan como una "
        "herramienta de seguimiento continuo y facilitan la toma de "
        "decisiones informadas en cada área del proyecto. La siguiente "
        "tabla presenta los KPIs principales, acompañados de su "
        "descripción y de la fórmula utilizada para su cálculo."
    )
    add_image("p72_img01.png", width_cm=15,
              caption="Figura. Tabla original de KPIs (parte 1).")
    add_image("p72_img02.png", width_cm=15,
              caption="Figura. Tabla original de KPIs (parte 2).")
    add_table(
        ["Tipo de KPI", "Nombre", "Descripción", "Fórmula / Cálculo"],
        [
            ["Producto", "Tasa de conversión de clientes",
             "Porcentaje de usuarios registrados que efectivamente "
             "solicitan un servicio.",
             "Nº de usuarios que solicitaron al menos un servicio / Nº "
             "total de usuarios registrados"],
            ["Producto", "Tasa de retención de usuarios",
             "Mide la cantidad de usuarios que vuelven a usar la app en un "
             "periodo determinado (mensual o trimestral).",
             "Nº de usuarios activos recurrentes / Nº total de usuarios "
             "activos"],
            ["Producto", "Tasa de respuesta de trabajadores",
             "Evalúa la eficiencia y rapidez con la que los trabajadores "
             "aceptan o responden a solicitudes.",
             "Nº de solicitudes respondidas / Nº de solicitudes recibidas"],
            ["Producto", "Tasa de éxito en el emparejamiento (matching)",
             "Indica qué porcentaje de solicitudes logran concretarse en "
             "un servicio efectivamente realizado.",
             "Nº de servicios completados / Nº de solicitudes iniciadas"],
            ["Negocio", "Ticket promedio por servicio",
             "Muestra el ingreso promedio por transacción completada.",
             "Ingresos totales del período / Nº de servicios realizados"],
            ["Negocio", "Tasa de retención de trabajadores",
             "Evalúa cuántos profesionales verificados permanecen activos "
             "en la plataforma.",
             "Nº de trabajadores activos / Nº total de trabajadores "
             "registrados"],
            ["Negocio", "CAC (Costo de adquisición de cliente)",
             "Mide cuánto cuesta adquirir un nuevo cliente a través de "
             "marketing y promociones.",
             "Inversión en marketing / Nº de nuevos clientes"],
            ["Negocio", "LTV (Valor de vida del cliente)",
             "Indica el ingreso promedio que un cliente genera durante "
             "toda su relación con OFIX.",
             "Ticket promedio × frecuencia de uso × duración promedio del "
             "cliente"],
            ["Negocio", "Tasa de satisfacción (NPS)",
             "Refleja el nivel de satisfacción del usuario final y su "
             "probabilidad de recomendar OFIX.",
             "% Promotores (puntuación 9–10) – % Detractores (puntuación "
             "0–6)"],
        ],
        col_widths=[2.5, 3.5, 4.5, 5],
    )

    h1("3.6 Embudo de conversión")
    para(
        "El embudo de conversión sintetiza el recorrido de usuarios y "
        "trabajadores desde su primer contacto con la marca hasta la "
        "recurrencia. Se adopta el esquema AARRR (Acquisition, "
        "Activation, Retention, Referral, Revenue), adaptado a la "
        "naturaleza de marketplace de doble lado: cada lado tiene su "
        "propio embudo, con métricas, hipótesis y acciones específicas."
    )

    h2("3.6.1 Embudo del lado de la demanda (hogares y pymes)")
    add_table(
        ["Etapa AARRR", "Métrica", "Hipótesis inicial",
         "Acciones para optimizar"],
        [
            ["Acquisition",
             "Impresiones de campañas → instalación de la app",
             "CTR Meta + Google: 1,5%; tasa de instalación: 25%",
             "Optimización de creativos por barrio, palabras clave de "
             "urgencia y retargeting de visitantes a landing."],
            ["Activation",
             "Instalación → primera solicitud de servicio",
             "30% de los instaladores genera al menos una solicitud en "
             "el primer mes",
             "Onboarding asistido, push de bienvenida y descuento "
             "sobre el primer servicio."],
            ["Retention",
             "Recompra a los seis meses",
             "35% de los usuarios activos vuelve a contratar",
             "Favoritos, calendario de mantenimiento preventivo y "
             "comunicación estacional (pre-verano, pre-invierno)."],
            ["Referral",
             "Servicios traídos por referidos",
             "10% de los servicios cerrados en régimen",
             "Programa formal con descuento bidireccional y código "
             "compartible por WhatsApp."],
            ["Revenue",
             "Ingreso por usuario = comisión × frecuencia × ticket",
             "10–15% de comisión × ticket promedio USD 89 × 3 "
             "servicios/año por hogar",
             "Pricing test para validar elasticidad, servicios premium "
             "para pymes y planes de mantenimiento recurrente."],
        ],
        col_widths=[3, 4.5, 4.5, 4.5],
    )

    h2("3.6.2 Embudo del lado de la oferta (trabajadores)")
    add_table(
        ["Etapa AARRR", "Métrica", "Hipótesis inicial",
         "Acciones para optimizar"],
        [
            ["Acquisition",
             "Alcance en grupos barriales, sindicatos y escuelas "
             "técnicas → registro en la app",
             "Conversion rate del 5% en canales segmentados",
             "Embajadores técnicos (primeros 20–30 perfiles), convenios "
             "con sindicatos y escuelas técnicas."],
            ["Activation",
             "Registro → perfil verificado y aceptación del primer "
             "trabajo",
             "60% completa el perfil; 40% acepta un trabajo en el "
             "primer mes",
             "KYC simple, tutorial en video y soporte humano durante "
             "el onboarding."],
            ["Retention",
             "Trabajadores activos / trabajadores registrados (mensual)",
             "70% al mes 3; 60% al mes 6",
             "Programa de niveles (Bronze/Silver/Gold) con comisiones "
             "decrecientes y capacitaciones periódicas."],
            ["Referral",
             "Trabajadores invitados por otros trabajadores activos",
             "15% de las altas mensuales por referido",
             "Incentivo monetario por referido activo y gamificación "
             "del ranking de embajadores."],
            ["Revenue",
             "Ingreso por trabajador = comisiones + suscripción premium",
             "Comisión sobre servicios y suscripción opcional por "
             "perfil destacado",
             "Tests de precio de suscripción premium y paquetes "
             "B2B-friendly."],
        ],
        col_widths=[3, 4.5, 4.5, 4.5],
    )

    h2("3.6.3 Métricas de salud del marketplace")
    bullets([
        "Time-to-match: tiempo promedio desde la solicitud hasta la "
        "aceptación del primer presupuesto.",
        "Fill rate: porcentaje de solicitudes que reciben al menos una "
        "oferta válida.",
        "Cancel rate: porcentaje de servicios cancelados por "
        "cualquiera de las partes.",
        "Disputas por servicio: ratio de incidentes formales sobre el "
        "total de servicios cerrados.",
        "Liquidez de oferta por zona: trabajadores activos disponibles "
        "por barrio.",
    ])
    para(
        "Las tasas de conversión expuestas constituyen hipótesis "
        "iniciales, construidas a partir de benchmarks públicos de "
        "marketplaces comparables. Su validación definitiva depende de "
        "los datos que arroje el piloto durante los primeros tres "
        "meses de operación, y orientará la priorización de las "
        "acciones de optimización en cada etapa."
    )

    page_break()


# =========================================================================
# CAPÍTULO IV — EQUIPO
# =========================================================================
def build_capitulo_IV():
    section_title("Capítulo IV — Equipo")

    h1("4.1 Composición del equipo durante el primer año de operación")
    para(
        "El equipo de OFIX está conformado por cinco personas durante el "
        "primer año de operación. La estructura combina un equipo fundador "
        "(core) con roles estratégicos y dos incorporaciones clave que "
        "permiten asegurar la operación continua del marketplace y "
        "acompañar el crecimiento del negocio."
    )

    h2("4.1.1 Equipo Fundador (Core Team)")
    h3("CEO / CPO — Rocco Pellegrino")
    para(
        "Rocco lidera la visión general del proyecto y la construcción del "
        "producto. Se ocupa de definir qué tenemos que desarrollar, "
        "priorizar el roadmap y asegurar que la app realmente responda a "
        "lo que necesitan los usuarios. También coordina a las distintas "
        "áreas para que todas las decisiones vayan en la misma dirección."
    )
    h3("CTO — Francisco Fontana")
    para(
        "Francisco está a cargo de todo lo tecnológico: desarrollo, "
        "infraestructura y seguridad. Construye el MVP, integra "
        "herramientas como Google Maps y Mercado Pago, y se asegura de que "
        "la plataforma funcione bien, sea estable y pueda escalar sin "
        "problemas."
    )
    h3("COO / Growth — Priscilla Arslan")
    para(
        "Priscilla se enfoca en la operación diaria del servicio: "
        "onboarding de trabajadores, procesos internos, calidad y atención "
        "a los usuarios. Además lidera el crecimiento, campañas de "
        "marketing y la expansión por barrios. Su rol es clave para que "
        "OFIX funcione en la práctica, no solo «en el papel»."
    )

    h2("4.1.2 Documentación interna y organización")
    para("Durante el primer trimestre dejamos armada toda la estructura básica:")
    bullets([
        "Un organigrama simple con los cinco roles del primer año.",
        "Un mapa de responsabilidades que clarifica quién hace qué y evita "
        "superposiciones.",
        "Flujos de decisión para trabajar rápido y sin fricciones.",
        "Rituales internos: reuniones semanales, seguimiento de métricas y "
        "objetivos trimestrales.",
    ])
    para("Esto nos permite mantener orden y claridad incluso siendo un equipo chico.")

    h2("4.1.3 Q2–Q3 de 2026: Construcción del equipo operativo")
    para(
        "En esta etapa empezamos a operar con usuarios reales. Incorporamos "
        "entre 20 y 30 trabajadores piloto, los capacitamos y ajustamos "
        "procesos en base a su feedback. También implementamos "
        "herramientas internas como:"
    )
    bullets([
        "CRM",
        "Sistema de soporte y tickets",
        "Tablero de métricas",
    ])
    para("Con esto empezamos a entender qué funciona, qué no y cómo debe evolucionar el producto.")

    h2("4.1.4 Q4 2026: Incorporación de dos nuevos roles")
    para(
        "En el último trimestre del año ampliamos formalmente el equipo "
        "con dos contrataciones estratégicas, fundamentales para que OFIX "
        "pueda escalar:"
    )
    h3("1. Customer Support / Community Operations")
    para(
        "Persona dedicada al soporte directo de usuarios y trabajadores. "
        "Su rol es fundamental para resolver problemas rápido, mantener la "
        "calidad y evitar que el equipo fundador se sobrecargue con la "
        "operación diaria."
    )
    h3("2. Ejecutivo Comercial B2B (pymes gastronómicas)")
    para(
        "Se enfoca en la captación y seguimiento de bares, restaurantes y "
        "cafeterías. Este segmento es clave porque usa OFIX con mayor "
        "frecuencia y genera un volumen estable de trabajos. Su "
        "incorporación permite que OFIX desarrolle una pata comercial más "
        "sólida y profesional."
    )
    para("Ambas incorporaciones fortalecen la operación y preparan al equipo para la expansión proyectada para 2027.")

    h1("4.2 Organigrama")
    add_image("p73_img01.png", width_cm=15,
              caption="Figura. Organigrama de OFIX — primer año de operación.")
    add_image("p73_img02.png", width_cm=15,
              caption="Figura. Organigrama complementario.")

    h1("4.3 Habilidades técnicas, de liderazgo y blandas")
    para(
        "La composición del equipo fundador combina perfiles "
        "complementarios que cubren las tres dimensiones de habilidades "
        "exigidas por la guía oficial del TFG: las técnicas, "
        "indispensables para construir y operar la plataforma; las de "
        "liderazgo, necesarias para coordinar el proyecto y tomar "
        "decisiones bajo incertidumbre; y las blandas, determinantes "
        "para gestionar la relación con usuarios, trabajadores y socios "
        "estratégicos."
    )

    h2("4.3.1 Habilidades técnicas")
    para(
        "Cuatro bloques de competencias técnicas se evidencian en el "
        "trabajo realizado a lo largo del presente TFG y de la "
        "cursada de la Licenciatura:"
    )
    bullets([
        "Desarrollo de producto digital y diseño UX/UI: aplicado en la "
        "construcción del prototipo navegable con sus cuatro fases "
        "—inicio, sesión, panel de usuario y panel de trabajador—, "
        "complementado con testeo de usabilidad cuyo resultado de NPS "
        "y SUS resultó favorable.",
        "Arquitectura y desarrollo técnico: definición del stack "
        "(Flutter o React Native para frontend, AWS o Google Cloud "
        "para backend con API REST) e integraciones con Google Maps, "
        "Mercado Pago y servicios de KYC.",
        "Marketing digital basado en datos: ejecución de campañas "
        "reales en Meta Ads y Google Ads durante 2025, con "
        "presupuestos controlados y medición de CPC, alcance y costo "
        "estimado de adquisición.",
        "Análisis financiero y unit economics: construcción del modelo "
        "PxQ por segmento, estimación de costos variables con "
        "metodología detallada en nueve componentes, proyección a "
        "cinco años y cálculo de SOM en cuatro escenarios.",
        "Investigación cuantitativa y cualitativa: diseño y ejecución "
        "de encuestas con 123 respuestas y ocho entrevistas en "
        "profundidad analizadas, sumadas a una entrevista al "
        "competidor Reeparando y al benchmark de once plataformas.",
    ])

    h2("4.3.2 Habilidades de liderazgo")
    para(
        "El equipo despliega cuatro capacidades de liderazgo "
        "indispensables para conducir un emprendimiento digital en "
        "etapa temprana, en un contexto de alta incertidumbre como el "
        "argentino:"
    )
    bullets([
        "Toma de decisiones bajo incertidumbre: priorización del MVP "
        "mediante MoSCoW, decisión de iniciar operaciones en CABA y "
        "GBA con expansión gradual, definición de un modelo de "
        "ingresos diversificado.",
        "Visión estratégica de largo plazo: roadmap a cinco años que "
        "articula escalabilidad regional (Argentina → Cono Sur → "
        "México, Colombia, Brasil) con evolución tecnológica "
        "progresiva (MVP → matching con IA → plataforma predictiva).",
        "Coordinación interdisciplinaria: alineación entre las áreas "
        "de producto, tecnología, marketing, operaciones, finanzas y "
        "legal en un plan trimestral integrado para el primer año.",
        "Construcción de relaciones estratégicas: identificación y "
        "abordaje de socios clave —aseguradoras, cámaras "
        "gastronómicas, sindicatos, consorcios, Mercado Pago— como "
        "pilares del plan de adquisición y del modelo operativo.",
    ])

    h2("4.3.3 Habilidades blandas")
    para(
        "El equipo aporta, finalmente, un conjunto de habilidades "
        "blandas que resultan especialmente relevantes en un "
        "marketplace cuya proposición de valor descansa sobre la "
        "confianza:"
    )
    bullets([
        "Comunicación efectiva con públicos diversos: la "
        "investigación primaria requirió diálogo con tres perfiles "
        "muy distintos —hogares, dueños de pymes y trabajadores "
        "manuales—, y la estrategia de marca personal de los founders "
        "refuerza esta capacidad como activo del proyecto.",
        "Empatía y escucha activa: las ocho entrevistas en profundidad "
        "demuestran capacidad para indagar dolores, miedos y "
        "expectativas reales de los usuarios, y traducirlos en "
        "definiciones de producto.",
        "Resiliencia y orientación a la acción: ejecución de pruebas "
        "reales de campañas con presupuesto propio, validación "
        "iterativa del prototipo y disposición a ajustar el modelo de "
        "negocio en función del feedback recibido.",
        "Trabajo colaborativo y gestión de prioridades: roles "
        "complementarios sin solapamiento (CEO/CPO, CTO, "
        "COO/Growth), rituales internos definidos —reuniones "
        "semanales, OKRs trimestrales— y documentación de procesos.",
    ])

    h2("4.3.4 Cobertura de habilidades mediante incorporaciones planificadas")
    para(
        "Las incorporaciones previstas para el cuarto trimestre de "
        "2026 —Customer Support y Ejecutivo Comercial B2B— están "
        "diseñadas para cubrir dos habilidades específicas que el "
        "equipo fundador no posee en profundidad: la atención al "
        "cliente operativa de alto volumen y la venta consultiva B2B "
        "con visitas presenciales a establecimientos. El diseño del "
        "organigrama asegura que las habilidades del equipo "
        "evolucionen al ritmo de las necesidades del negocio."
    )

    page_break()


# =========================================================================
# CAPÍTULO V — COSTOS, FINANZAS E INVERSIÓN
# =========================================================================
def build_capitulo_V():
    section_title("Capítulo V — Costos, Finanzas e Inversión")

    h1("5.1 Bases del P&L: planilla según template, principales indicadores, "
       "unit economics (CAC y LTV)")
    note_grey(
        "Planilla de Excel original: "
        "https://docs.google.com/spreadsheets/d/18S6pofl7J2-emUQSXd1r2-"
        "kr7461oZij/edit?usp=sharing"
    )

    h1("5.2 Costos Variables")
    para(
        "La estimación de los costos variables de OFIX se desarrolló con "
        "el objetivo de identificar y cuantificar aquellos gastos que "
        "dependen de la actividad transaccional de la plataforma, es "
        "decir, costos que se incrementan a medida que aumentan las "
        "operaciones realizadas por usuarios y trabajadores. Este análisis "
        "resulta fundamental para proyectar el margen de contribución del "
        "negocio y para evaluar la escalabilidad económica del modelo. La "
        "metodología adoptada se basó en la consulta de fuentes de "
        "mercado, políticas tarifarias de proveedores reales y parámetros "
        "utilizados por plataformas internacionales comparables."
    )
    para(
        "El primer componente analizado fue la comisión de la pasarela de "
        "pago. Dado que Mercado Pago es el proveedor predominante en "
        "Argentina y ofrece información tarifaria pública y verificable, "
        "se utilizaron sus valores como referencia. Según la estructura de "
        "costos vigente, el procesamiento de pagos tiene un costo de entre "
        "4,39% y 6,29% + IVA dependiendo del plazo de acreditación. Para "
        "OFIX se adoptó una tasa promedio conservadora del 5,31%, "
        "calculada sobre el ticket promedio de USD 71 multiplicado por el "
        "total de transacciones de cada año. Este componente representa "
        "el principal costo variable del modelo debido a su "
        "proporcionalidad directa con la facturación bruta."
    )
    para(
        "En segundo lugar, se analizó la comisión por retiro de fondos, la "
        "cual en Argentina es nula debido a que el sistema financiero "
        "nacional no cobra por transferencias inmediatas vía CBU o alias, "
        "tal como lo establece el Banco Central de la República Argentina. "
        "Esto implica que OFIX no incurre en costos adicionales al "
        "transferir fondos a trabajadores o establecimientos "
        "gastronómicos. El tercer costo considerado fue el del plan de "
        "seguro asociado a cada transacción, adoptando como referencia "
        "los valores informados por TaskRabbit, plataforma que opera con "
        "un esquema similar. De acuerdo con su política pública, el costo "
        "aproximado de cobertura ronda los USD 0,55 por operación, monto "
        "que se aplicó como estimación para OFIX con el propósito de "
        "cubrir daños, reclamos o incidentes menores entre usuarios y "
        "trabajadores."
    )
    para(
        "Otro componente fundamental fue el costo de validación de "
        "identidad tanto para trabajadores como para usuarios. Este "
        "proceso es crítico para garantizar la seguridad de la plataforma. "
        "Se utilizaron como referencia los servicios de Veraz Identidad "
        "Digital, uno de los proveedores más utilizados en el país. Su "
        "precio promedio, cercano a USD 0,20 por verificación, se aplicó "
        "a todos los usuarios nuevos de cada año, diferenciando entre "
        "trabajadores y clientes. El quinto costo incorporado fue el "
        "asociado al soporte operativo. Para estimarlo se tomaron como "
        "referencia los rangos publicados por InvGate, plataforma "
        "tecnológica argentina especializada en gestión de tickets de "
        "soporte. Allí se señala que cada interacción puede costar entre "
        "USD 5 y USD 40. Dado que OFIX operará con un sistema de soporte "
        "automatizado y con baja frecuencia relativa de reclamos, se "
        "adoptó un modelo conservador que asume un ticket de soporte cada "
        "veinte transacciones, a un costo de USD 0,40 por evento."
    )
    para(
        "Al analizar los costos tecnológicos escalables, se incorporaron "
        "los valores difundidos por AWS en su herramienta AWS Pricing "
        "Calculator, que permiten estimar costos de computación, "
        "almacenamiento y uso incremental por request para modelos de "
        "infraestructura serverless. Con base en estos parámetros se "
        "estableció un costo marginal de USD 0,02 por transacción, "
        "consistente con servicios de aplicaciones livianas de matching y "
        "mensajería. También se incluyeron los costos de mensajería "
        "interna y notificaciones, considerando referencias de Firebase "
        "Cloud Messaging y Twilio. Estos servicios tienen un costo "
        "reducido por mensaje enviado, por lo que se adoptó un valor "
        "estimado de USD 0,01 por transacción para cubrir alertas de "
        "progreso del servicio, comunicaciones entre partes y "
        "notificaciones automáticas."
    )
    para(
        "En materia de antifraude y scoring, se utilizaron referencias de "
        "proveedores especializados como Sift, cuyos planes públicos "
        "oscilan entre USD 0,05 y USD 0,15 por evaluación de riesgo. Con "
        "el fin de ser prudentes en la proyección, se adoptó un valor "
        "base de USD 0,05 por transacción. Asimismo, se incorporaron "
        "impuestos transaccionales asociados al manejo digital de pagos, "
        "tales como tasas de sellos o cargos menores aplicables al uso de "
        "procesadores, utilizando una estimación promedio de USD 0,05 por "
        "transacción basada en prácticas del sector. Finalmente, se "
        "incorporó un costo por reembolsos y devoluciones. Tomando como "
        "referencia nuevamente la política de TaskRabbit, que destina "
        "entre 0,5% y 2% del volumen transaccionado a resolver reclamos y "
        "devoluciones, se adoptó para OFIX un valor conservador de 0,78% "
        "sobre el total anual procesado."
    )
    para(
        "En conjunto, estas estimaciones permiten construir un modelo de "
        "costos variables robusto, documentado y defendible desde una "
        "perspectiva académica y empresarial. Las cifras seleccionadas se "
        "apoyan en proveedores reales, en plataformas comparables y en "
        "supuestos conservadores que reflejan la naturaleza del negocio. "
        "Estos costos se incorporaron luego al Estado de Resultados "
        "Proyectado bajo la línea «Costos variables sin depreciaciones y "
        "amortizaciones», permitiendo calcular el margen bruto y sentar "
        "las bases del análisis financiero integral del proyecto OFIX."
    )

    h1("5.3 Costos Fijos")
    para(
        "Los costos fijos de OFIX son, en términos simples, la estructura "
        "mínima que necesitamos para que la plataforma funcione todos los "
        "días, incluso cuando todavía no tenemos un volumen alto de "
        "usuarios. Son gastos que no cambian demasiado de un mes a otro y "
        "que permiten sostener lo esencial: la tecnología, el equipo, el "
        "marco legal y todo lo que hace que OFIX sea confiable y "
        "profesional desde el primer día. Sin esta base, sería imposible "
        "garantizar que la app esté disponible, que los datos estén "
        "protegidos y que todo el proceso —desde que un usuario abre la "
        "app hasta que un oficio completa un trabajo— funcione como "
        "corresponde."
    )
    para(
        "Dentro de estos costos, el más importante es el equipo. Los "
        "sueldos y las cargas sociales de los roles clave (dirección, "
        "desarrollo, operaciones) representan la columna vertebral del "
        "proyecto, porque son quienes construyen, organizan y dan vida a "
        "la plataforma. También están los honorarios del estudio "
        "contable, que se ocupa de toda la parte impositiva, balances y "
        "presentaciones que una empresa formal debe respetar. Aunque a "
        "veces pasa desapercibido, esto es fundamental para evitar "
        "problemas legales y mantener una administración ordenada."
    )
    para(
        "A nivel tecnológico, los costos fijos incluyen el hosting, los "
        "servidores y la infraestructura en la nube, que garantizan que "
        "OFIX esté disponible 24/7, que el sistema no se caiga y que la "
        "información se maneje de forma segura. Se suman también las "
        "herramientas SaaS que usamos para trabajar internamente (como "
        "Notion, Slack, Figma o servicios de API), que permiten coordinar "
        "al equipo, documentar procesos y mantener un ritmo de trabajo "
        "prolijo. A esto se agrega el mantenimiento técnico, que cubre "
        "correcciones, pequeñas mejoras y todo lo necesario para que la "
        "plataforma siga siendo estable."
    )
    para(
        "Otros gastos tienen que ver con el espacio físico, si "
        "corresponde, como alquiler, servicios de oficina y conectividad. "
        "Aunque OFIX es un negocio digital, siempre se necesita algún tipo "
        "de base operativa o de reuniones. En paralelo, hay un costo "
        "legal que incluye la elaboración de contratos, términos y "
        "condiciones, políticas de privacidad y asesoramiento jurídico. "
        "Para un marketplace que maneja datos sensibles, coordina "
        "servicios en hogares y trabaja con aseguradoras, este aspecto no "
        "es negociable."
    )
    para(
        "Además, OFIX debe contar con un seguro de responsabilidad civil "
        "comercial, que actúa como respaldo ante cualquier eventualidad. "
        "También aparece el mantenimiento más profundo de la aplicación, "
        "que abarca actualizaciones importantes o mejoras de estructura "
        "que no se hacen todos los meses, pero que son necesarias para "
        "sostener la calidad del producto. Se suma la amortización de "
        "activos fijos —básicamente la pérdida de valor de equipos y "
        "herramientas—, los gastos administrativos cotidianos y los "
        "costos de recursos humanos vinculados a búsquedas, "
        "incorporaciones y capacitaciones."
    )
    para(
        "Un punto clave es la seguridad informática. OFIX trabaja con "
        "datos personales, direcciones de hogares, datos de pagos y "
        "comunicaciones entre usuarios y trabajadores, por lo que es "
        "indispensable contar con sistemas antifraude, antivirus, "
        "certificados de seguridad y monitoreo permanente. Por último, el "
        "marketing fijo abarca todo el trabajo de branding, diseño de "
        "identidad y contenido institucional que ayuda a darle coherencia "
        "y presencia a la marca, aunque sin incluir campañas pagas."
    )
    para(
        "En conjunto, estos costos fijos no son simplemente «un gasto»: "
        "representan la estructura que permite que OFIX sea una "
        "plataforma seria, segura y profesional. Son los cimientos sobre "
        "los que se apoya todo el modelo de negocio y lo que nos permite "
        "diferenciarnos en un mercado donde la informalidad y la falta de "
        "estándares son la regla. Tener bien definidos estos costos "
        "también ayuda a proyectar el punto de equilibrio, entender "
        "cuánta inversión se necesita en los primeros años y mostrarle a "
        "futuros inversores que el proyecto está armado con una base "
        "sólida y realista."
    )

    h1("5.4 Modelo PxQ — Proyección de ingresos")
    para(
        "El modelo PxQ es, básicamente, la forma más directa de entender "
        "cómo va a generar ingresos OFIX: ver cuántos servicios "
        "efectivamente se concretan en la plataforma y multiplicarlo por "
        "el precio promedio por transacción. Nada más que eso. Lo "
        "interesante es cómo se llega a ese número, porque en realidad no "
        "es todo un gran bloque; está dividido en dos mundos distintos: "
        "los hogares y las pymes gastronómicas. Cada uno tiene "
        "comportamientos, tamaños y frecuencias propias, y eso hace que "
        "el Excel esté separado en dos pestañas diferentes. Al final se "
        "suman y listo: ese total es lo que después alimenta todo el P&L."
    )
    para(
        "En hogares lo que hicimos fue agarrar la cantidad total de "
        "hogares según el INDEC y, dependiendo del año, ir «abriendo» "
        "regiones: arrancamos solo con Buenos Aires, después sumamos las "
        "principales ciudades del país y, desde el tercer año, Argentina "
        "completa. Sobre ese universo aplicamos un porcentaje muy chico "
        "de «usuarios posibles» y, dentro de esos, un 3% que efectivamente "
        "usarían OFIX. Es un número conservador, pero es realista: nadie "
        "adopta una app de oficios de un día para el otro. La frecuencia "
        "la dejamos en tres servicios por año, que es lo que pasa en la "
        "vida real (si no es algo eléctrico, es algo de agua o alguna "
        "reparación que aparece de la nada). Con todo esto, los números "
        "van creciendo como deberían: unos 6.700 servicios en el primer "
        "año, 11.500 en el segundo y más de 29.000 cuando ya operamos en "
        "todo el país. Multiplicado por el precio (71 USD), eso se "
        "traduce en ingresos que pasan de medio millón de dólares a más "
        "de dos millones solo en hogares."
    )
    para(
        "Pymes gastronómicas es otra historia. No son tantas como los "
        "hogares, pero lo compensan con frecuencia. Una cocina "
        "profesional no puede estar esperando tres días a un gasista o un "
        "electricista: necesitan soluciones rápidas. Por eso la "
        "conversión acá es mayor, del 5%, y la frecuencia también es "
        "mucho más alta, entre siete y diez intervenciones por año según "
        "la etapa. El universo de restaurantes lo armamos con datos de "
        "FEHGRA y proyecciones provinciales, y el crecimiento geográfico "
        "es parecido al de hogares: Buenos Aires, después interior centro "
        "y finalmente el resto del país. Los números finales quedan más "
        "chicos que en hogares, pero igual son relevantes: un poco más "
        "de mil servicios en el primer año, mil quinientos en el segundo "
        "y arriba de tres mil cuando OFIX ya es nacional. A precio "
        "constante, estos volúmenes aportan entre setenta mil y casi "
        "doscientos cuarenta mil dólares por año."
    )
    para(
        "Cuando juntás los dos segmentos, el panorama queda clarísimo. "
        "Las transacciones totales pasan de unas 7.700 en el primer año a "
        "casi 45.000 en el quinto. Como el precio no se toca (algo que "
        "ayuda a que toda la proyección sea más conservadora), los "
        "ingresos crecen directamente siguiendo esa curva de Q. Por eso "
        "el primer año se proyectan 554 mil dólares y el quinto supera "
        "los 3,2 millones. No hay nada raro ni forzado: simplemente más "
        "gente usando la plataforma a medida que OFIX entra en más "
        "ciudades."
    )
    para(
        "Y esta es la razón por la que el PxQ es tan importante. Todo lo "
        "demás —el EBITDA, los flujos de fondos, la valuación— depende de "
        "estos números. Si entendés cómo se arma el PxQ, entendés de "
        "dónde sale cada dólar del modelo. También muestra algo clave: el "
        "crecimiento no viene de subir precios, sino de que más usuarios "
        "adopten OFIX y de estar presentes en más lugares. Hogares "
        "aportan volumen, pymes aportan frecuencia, y entre los dos "
        "generan una base sólida que hace que el crecimiento sea "
        "progresivo y creíble. En definitiva, el PxQ es la forma más "
        "transparente de ver cómo funciona el negocio en la práctica."
    )

    h1("5.5 Recursos necesarios para la implementación del primer año")
    para(
        "Para llevar adelante el plan de implementación descrito, OFIX "
        "requiere una inversión inicial distribuida entre las principales "
        "áreas operativas:"
    )
    bullets([
        "Marketing y Adquisición: presupuesto mensual estimado entre USD "
        "100 y 150 según trimestre, destinado a campañas digitales, "
        "contenido, influencers y acciones de marca personal.",
        "Desarrollo de Producto: inversión en infraestructura cloud "
        "(Google Cloud / AWS), herramientas de desarrollo y servicios de "
        "verificación/seguridad.",
        "Operaciones del Servicio: costos asociados al onboarding de "
        "trabajadores, herramientas de soporte y, en Q4, la contratación "
        "del Customer Support.",
        "Administración y Finanzas: honorarios del estudio contable, "
        "reporting, auditoría anual y gestión fiscal. Los honorarios de "
        "un estudio contable rondan alrededor de los 200/250 mil pesos "
        "mensuales (los valores considerados son una referencia tomando "
        "en cuenta los honorarios de un contador en CABA; a su vez, se "
        "toma en cuenta el valor de todos los trámites de inscripción "
        "que se deben realizar como sociedad — Pasos - Personas "
        "Jurídicas - Inscripción - Régimen General, n.d.).",
        "Legal y Normativa: redacción de contratos, Términos y "
        "Condiciones, políticas de privacidad, seguros y registro de "
        "marca. Para el área de legales, consideramos un valor inicial "
        "de USD 350-500 mensuales para toda la organización legal de la "
        "empresa.",
    ])

    h2("5.5.1 Recursos específicos para el área legal — Año 1")
    add_table(
        ["Concepto", "Monto"],
        [
            ["Constitución SAS", "USD 448"],
            ["Términos y Condiciones + Privacidad", "USD 200"],
            ["Contrato de Uso + SLA B2B", "USD 137"],
            ["NDA + Cesión de derechos", "USD 82"],
            ["Registro de marca (INPI)", "USD 55"],
            ["Registro DNDA software", "USD 62"],
            ["Inscripción base AAIP", "USD 34"],
            ["Compliance y auditoría datos", "USD 103"],
            ["KYC básico", "USD 68"],
            ["Acuerdo con aseguradora", "USD 68"],
            ["Total año 1", "USD 1.200"],
        ],
        col_widths=[10, 5],
    )
    para(
        "Esta inversión permite cubrir el lanzamiento del MVP, el "
        "escalamiento del servicio durante 2026 y preparar la estructura "
        "necesaria para la expansión territorial proyectada para 2027."
    )

    h1("5.6 Estado de Resultados (P&L) proyectado")
    para(
        "Sobre la base del modelo PxQ, los costos variables y los costos "
        "fijos descritos en las secciones anteriores, se construye el "
        "Estado de Resultados proyectado de OFIX a cinco años (2026–2030). "
        "Todas las cifras se expresan en dólares estadounidenses, conforme "
        "requiere la guía oficial. El modelo prevé un resultado operativo "
        "negativo durante los dos primeros años producto de la inversión "
        "en construcción de red, con cruce al equilibrio durante el "
        "tercer año y resultados crecientes a partir de allí. Hacia el "
        "año 5, el proyecto alcanza un EBITDA de USD 340.647 y un "
        "resultado neto de USD 215.204."
    )
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["Ingresos netos", "—", "693.651", "1.163.246", "2.907.770",
             "3.489.324", "4.012.723"],
            ["Costos variables (s/ dep. y amort.)", "—", "(609.874)",
             "(1.022.752)", "(2.556.577)", "(3.067.892)", "(3.528.076)"],
            ["Costos fijos (s/ dep. y amort.)", "(49.368)", "(98.769)",
             "(108.049)", "(118.461)", "(130.420)", "(144.000)"],
            ["Depreciaciones y Amortizaciones", "—", "(5.299)", "(6.525)",
             "(8.064)", "(8.631)", "(9.564)"],
            ["RESULTADO OPERATIVO (EBIT)", "(49.368)", "(20.291)",
             "25.920", "224.668", "282.381", "331.083"],
            ["Impuesto a las ganancias (35%)", "17.279", "7.102",
             "(9.072)", "(78.634)", "(98.833)", "(115.879)"],
            ["RESULTADO NETO", "(32.089)", "(13.189)", "16.848",
             "146.034", "183.548", "215.204"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )
    para(
        "El tratamiento del Impuesto a las Ganancias considera el "
        "quebranto generado en los años 0 y 1, que se aplica como "
        "crédito fiscal contra los resultados positivos de años "
        "posteriores. El saldo a favor acumulado se consume entre el "
        "año 2 y el año 3, momento a partir del cual el proyecto "
        "comienza a pagar IIGG plenos sobre el resultado operativo."
    )
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["EBITDA", "(49.368)", "(14.992)", "32.445", "232.732",
             "291.012", "340.647"],
            ["Margen EBITDA / Ingresos", "—", "(2,2%)", "2,8%", "8,0%",
             "8,3%", "8,5%"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )

    h1("5.7 TIR y VAN")
    para(
        "El análisis de rentabilidad del proyecto se construye sobre el "
        "flujo de fondos libres para la firma proyectado a cinco años. La "
        "tasa de descuento utilizada (WACC) refleja el contexto "
        "argentino y se construye conforme el modelo de Costo Promedio "
        "Ponderado del Capital, considerando que el proyecto se "
        "financiará en su totalidad con capital propio (100% equity) en "
        "su etapa inicial."
    )

    h2("5.7.1 Construcción de la tasa de descuento")
    add_table(
        ["Componente", "Valor", "Fuente / Referencia"],
        [
            ["Tasa libre de riesgo (Rf)", "3,72%",
             "Rendimiento anual de Notas del Tesoro de EE. UU. a 5 años"],
            ["Prima por riesgo de mercado (Rm − Rf)", "4,33%",
             "Equity Risk Premium − Country Risk Premium (Damodaran)"],
            ["Beta desapalancada de la industria", "1,750",
             "Betas by Sector (US) — industria de referencia"],
            ["Prima por riesgo país (Argentina)", "16,02%",
             "Country Default Spreads and Risk Premiums (Damodaran)"],
            ["Costo del capital propio (Ke)", "27,32%",
             "Rf + β × (Rm − Rf) + Country Risk Premium"],
            ["Costo de endeudamiento (Kd)", "0,00%",
             "El proyecto no toma deuda en etapa inicial"],
            ["% Financiación con deuda (D / E+D)", "0,00%", "—"],
            ["% Financiación con patrimonio (E / E+D)", "100,00%", "—"],
            ["WACC aplicado", "27,00%",
             "Ke × %E + Kd × %D (con 100% equity)"],
            ["Tasa de crecimiento estimada (g)", "3,00%",
             "Crecimiento perpetuo para cálculo del valor terminal"],
        ],
        col_widths=[6, 3, 7],
    )

    h2("5.7.2 Resultados del análisis")
    add_table(
        ["Indicador", "Sin perpetuidad (VT = 0)",
         "Con perpetuidad (VT = USD 882.198)"],
        [
            ["Valor Actual Neto (VAN)", "USD 82.015", "USD 345.724"],
            ["Tasa Interna de Retorno (TIR)", "48%", "77%"],
            ["Decisión: TIR vs WACC (27%)",
             "TIR > WACC → proyecto viable",
             "TIR > WACC → proyecto altamente rentable"],
        ],
        col_widths=[5, 5, 5],
    )

    para(
        "Ambos escenarios arrojan un VAN positivo y una TIR "
        "sustancialmente superior al WACC del 27%, lo que confirma la "
        "viabilidad económica del proyecto. El escenario sin "
        "perpetuidad —más conservador, que asume que el negocio cesa al "
        "final del año 5— ya genera un VAN positivo de USD 82.015 y una "
        "TIR del 48%. El escenario con valor terminal (perpetuidad), "
        "que asume crecimiento perpetuo del 3% a partir del año 5, "
        "eleva el VAN a USD 345.724 y la TIR al 77%, valores "
        "consistentes con un emprendimiento digital de marketplace en "
        "etapa de escalamiento."
    )

    h2("5.7.3 Período de recupero (Payback)")
    add_table(
        ["Métrica", "Payback tradicional",
         "Payback descontado"],
        [
            ["Año anterior al recupero", "Año 2", "Año 3"],
            ["Flujo acumulado del año anterior (USD)", "(105.130)",
             "(46.419)"],
            ["Flujo del año en que se recupera (USD)", "119.419", "66.174"],
            ["Período de recupero (años)", "2,88", "3,70"],
            ["Período de recupero (meses)", "35 meses", "44 meses"],
        ],
        col_widths=[5, 5, 5],
    )
    para(
        "El payback tradicional —que no considera el valor temporal del "
        "dinero— se alcanza a los 35 meses, mientras que el payback "
        "descontado (que sí incorpora la tasa de descuento del 27%) se "
        "ubica en 44 meses. Ambos plazos son consistentes con los "
        "estándares de la industria para marketplaces digitales en "
        "etapa temprana."
    )

    h1("5.8 Punto de equilibrio, contribución marginal y unit economics")

    h2("5.8.1 Contribución marginal y unit economics anuales")
    add_table(
        ["Indicador", "Año 1", "Año 2", "Año 3", "Año 4", "Año 5"],
        [
            ["Total de usuarios", "2.392", "4.054", "10.085", "12.102",
             "13.917"],
            ["Ingresos netos (USD)", "693.651", "1.163.246", "2.907.770",
             "3.489.324", "4.012.723"],
            ["Costos variables (USD)", "(609.874)", "(1.022.752)",
             "(2.556.577)", "(3.067.892)", "(3.528.076)"],
            ["Contribución marginal (USD)", "83.778", "140.494",
             "351.193", "421.432", "484.647"],
            ["Customer Lifetime Value — CTV (USD)", "35,03", "34,66",
             "34,82", "34,82", "34,82"],
            ["Gastos para conseguir clientes (USD)", "35.000", "56.530",
             "111.772", "132.126", "150.445"],
            ["Costo de Adquisición — CAC (USD)", "14,63", "13,94",
             "11,08", "10,92", "10,81"],
            ["Ratio CTV / CAC", "2,39", "2,49", "3,14", "3,19", "3,22"],
        ],
        col_widths=[5, 2.5, 2.5, 2.5, 2.5, 2.5],
    )
    para(
        "La contribución marginal crece de USD 83.778 en el año 1 a "
        "USD 484.647 en el año 5, lo que representa un margen de "
        "contribución sobre ingresos del 12,1% al año 1 y del 12,1% al "
        "año 5 (estructura estable, dado que los costos variables —en "
        "los que predomina el pago a trabajadores del 80% del GMV— "
        "escalan proporcionalmente con los ingresos). El ratio CTV/CAC "
        "evoluciona de 2,39 a 3,22, superando el umbral de 3,0 "
        "considerado como benchmark de salud para marketplaces "
        "digitales a partir del año 3."
    )
    para(
        "Se asume un tiempo de vida promedio del usuario de un año, "
        "criterio conservador que se condice con la dinámica de "
        "rotación esperable en una plataforma de oficios en etapa "
        "inicial. La mejora progresiva del CAC (de USD 14,63 a USD "
        "10,81) refleja la eficiencia ganada por el efecto de marca, "
        "la consolidación del programa de referidos y la optimización "
        "de las campañas digitales sobre la base de los aprendizajes "
        "de los primeros años."
    )

    h2("5.8.2 Punto de equilibrio operativo")
    para(
        "El punto de equilibrio operativo del proyecto se alcanza "
        "durante el año 2, cuando el resultado operativo pasa de "
        "negativo (USD −20.291 en año 1) a positivo (USD 25.920 en año "
        "2). En términos de flujo de caja libre, el cruce de signo "
        "ocurre entre el año 1 y el año 2, y el flujo acumulado se "
        "vuelve positivo durante el año 3 (USD 14.288 acumulado, ver "
        "sección 5.10), momento en el que el proyecto deja de "
        "requerir aportes adicionales de capital."
    )

    h1("5.9 Necesidades Operativas de Fondos (NOF) y CAPEX")

    h2("5.9.1 Necesidades Operativas de Fondos (NOF)")
    para(
        "Las NOF reflejan la inversión en capital de trabajo requerida "
        "para sostener la operación. En OFIX provienen principalmente "
        "del ciclo de cobros y pagos: el saldo de cuentas por cobrar "
        "(que crece con el volumen de transacciones procesadas vía "
        "Mercado Pago, con un período de acreditación de 10 días) menos "
        "las cuentas por pagar a proveedores. La política financiera "
        "del sistema argentino, que permite transferencias inmediatas "
        "sin costo vía CBU, mantiene este componente acotado."
    )
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["Inventarios", "0", "0", "0", "0", "0", "0"],
            ["Cuentas por cobrar", "0", "19.004", "31.870", "79.665",
             "95.598", "109.938"],
            ["Cuentas por pagar", "(769)", "(1.522)", "(1.645)", "(1.781)",
             "(1.942)", "(2.123)"],
            ["NOF (saldo)", "(769)", "17.482", "30.225", "77.884",
             "93.656", "107.815"],
            ["Variación NOF", "(769)", "18.252", "12.743", "47.658",
             "15.773", "14.158"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )

    h2("5.9.2 Gastos de capital (CAPEX)")
    para(
        "Por su naturaleza digital, el CAPEX de OFIX se concentra en "
        "cinco rubros: desarrollo del software (intangible "
        "capitalizable), equipamiento informático del equipo, registro "
        "de marca y patentes, mobiliario de oficina y telefonía "
        "corporativa. La inversión inicial total (Año 0) asciende a "
        "USD 39.095, con inversiones de reposición y crecimiento "
        "anuales por entre USD 1.365 y USD 2.530 durante los cinco "
        "años proyectados."
    )
    add_table(
        ["Concepto CAPEX (USD)", "Año 0", "Año 1", "Año 2", "Año 3",
         "Año 4", "Año 5", "TOTAL"],
        [
            ["Desarrollo app y sitio web", "34.000", "—", "—", "—", "—",
             "—", "34.000"],
            ["Equipamiento informático", "2.100", "700", "1.400", "1.400",
             "1.400", "1.400", "8.400"],
            ["Marca y patentes (INPI)", "1.200", "—", "—", "—", "—", "—",
             "1.200"],
            ["Mobiliario de oficina", "1.395", "465", "930", "930", "930",
             "930", "5.580"],
            ["Teléfonos corporativos", "400", "200", "200", "—", "200",
             "—", "1.000"],
            ["TOTAL CAPEX", "39.095", "1.365", "2.530", "2.330", "2.530",
             "2.330", "50.180"],
        ],
        col_widths=[4.5, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 2],
    )

    h2("5.9.3 Política de amortización")
    add_table(
        ["Categoría", "Vida útil", "Fuente normativa"],
        [
            ["Desarrollo app + web", "5 años", "NIC/IAS 38 — Intangibles"],
            ["Notebooks y equipamiento informático", "3 años",
             "IRS Publication 946 / AFIP tabla"],
            ["Mobiliario de oficina", "5 años", "AFIP tablas + IFRS PPE"],
            ["Teléfonos corporativos", "2 años",
             "Industria + obsolescencia móvil"],
            ["Marca y patentes", "10 años", "NIC 38"],
        ],
        col_widths=[5, 3, 7],
    )

    h1("5.10 Flujo de fondos libres (Free Cash Flow) e inversión total")

    para(
        "El flujo de fondos libres para la firma se construye a partir "
        "del EBITDA, restando los impuestos a las ganancias sobre el "
        "resultado operativo, la variación de NOF y el CAPEX. El "
        "resultado refleja el efectivo disponible para los aportantes "
        "de capital una vez cubiertas las necesidades operativas y de "
        "inversión."
    )

    h2("5.10.1 Flujo de fondos libres para la firma")
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["EBITDA", "(49.368)", "(14.992)", "32.445", "232.732",
             "291.012", "340.647"],
            ["(−) IIGG sobre Rdo. Operativo", "—", "—", "—", "(63.325)",
             "(98.833)", "(115.879)"],
            ["(−) Variación NOF", "769", "(18.252)", "(12.743)",
             "(47.658)", "(15.773)", "(14.158)"],
            ["(−) CAPEX", "(39.095)", "(1.365)", "(2.530)", "(2.330)",
             "(2.530)", "(2.330)"],
            ["FFLF (sin Valor Terminal)", "(87.694)", "(34.609)",
             "17.172", "119.419", "173.876", "208.280"],
            ["(+) Valor Terminal (perpetuidad g=3%)", "—", "—", "—", "—",
             "—", "882.198"],
            ["FFLF (con Valor Terminal)", "(87.694)", "(34.609)", "17.172",
             "119.419", "173.876", "1.090.478"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )

    h2("5.10.2 Flujos descontados al WACC del 27%")
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["Factor de descuento (1/(1+WACC)^t)", "1,00", "0,79", "0,62",
             "0,48", "0,38", "0,30"],
            ["FFLF s/VT descontado", "(87.694)", "(27.183)", "10.593",
             "57.864", "66.174", "62.260"],
            ["FFLF c/VT descontado", "(87.694)", "(27.183)", "10.593",
             "57.864", "66.174", "325.969"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )

    h2("5.10.3 Flujo acumulado y recupero de inversión")
    add_table(
        ["Concepto (USD)", "Año 0", "Año 1", "Año 2", "Año 3", "Año 4",
         "Año 5"],
        [
            ["FFLF acumulados", "(87.694)", "(122.302)", "(105.130)",
             "14.288", "188.164", "396.444"],
            ["FFLF descontados acumulados", "(87.694)", "(114.876)",
             "(104.283)", "(46.419)", "19.755", "82.015"],
        ],
        col_widths=[5.5, 2, 2, 2, 2, 2, 2],
    )

    h2("5.10.4 Inversión total requerida")
    para(
        "La inversión inicial requerida para arrancar el proyecto, "
        "considerando el flujo de fondos negativo del año 0 y la "
        "necesidad de cubrir el flujo negativo del año 1, asciende a "
        "USD 122.302 (suma de FFLF Año 0 + FFLF Año 1 en valores "
        "absolutos). Este monto representa el ticket de inversión "
        "mínimo a buscar en una primera ronda de financiamiento "
        "(bootstrap del equipo + amigos y familia + inversores ángeles), "
        "y debe estar disponible antes del cierre del año 1 para "
        "asegurar la continuidad operativa del proyecto."
    )

    h1("5.11 Escenario macroeconómico y supuestos del modelo")

    para(
        "El modelo financiero de OFIX se construye en dólares "
        "estadounidenses, conforme requiere la guía oficial del TFG, "
        "incorporando supuestos macroeconómicos consistentes con el "
        "contexto argentino y con la metodología estándar de valuación "
        "de proyectos en mercados emergentes."
    )

    h2("5.11.1 Supuestos clave del modelo")
    add_table(
        ["Variable", "Valor adoptado", "Fundamento"],
        [
            ["Moneda de proyección", "USD",
             "Requisito formal de la guía oficial UdeSA"],
            ["Tipo de cambio referencia (ARS/USD)", "1.450",
             "Cotización utilizada para dolarizar el ticket promedio "
             "($129.333 → USD 89)"],
            ["Alícuota Impuesto a las Ganancias", "35%",
             "Régimen impositivo de sociedades de capital — Argentina"],
            ["Tasa libre de riesgo (Rf)", "3,72%",
             "Bonos del Tesoro de EE. UU. a 5 años"],
            ["Prima por riesgo país (Argentina)", "16,02%",
             "Country Default Spreads (Damodaran)"],
            ["Prima por riesgo de mercado", "4,33%", "Damodaran ERP − CRP"],
            ["Beta desapalancada del sector", "1,750",
             "Betas by Sector (US) — industria de referencia"],
            ["Costo del capital propio (Ke)", "27,32%",
             "Modelo CAPM ajustado por riesgo país"],
            ["WACC (estructura 100% equity)", "27,00%",
             "Costo promedio ponderado del capital"],
            ["Tasa de crecimiento perpetuo (g)", "3,00%",
             "Crecimiento real de largo plazo para cálculo del valor "
             "terminal"],
            ["Vida del proyecto proyectada", "5 años + perpetuidad",
             "Estándar para valuación de marketplaces digitales"],
            ["Incremento anual del presupuesto de marketing", "20%",
             "Supuesto del modelo PxQ"],
        ],
        col_widths=[5, 4, 7],
    )

    h2("5.11.2 Consideraciones sobre la coyuntura argentina")
    para(
        "Si bien el modelo se expresa en USD —aislando los efectos de "
        "la inflación local—, el proyecto opera en un contexto "
        "macroeconómico argentino que presenta tres factores a "
        "monitorear: (i) la volatilidad cambiaria, que puede afectar "
        "el poder adquisitivo del ticket promedio en pesos y obligar "
        "a ajustes periódicos de pricing; (ii) la inflación "
        "persistente, que comprime los márgenes si los precios no se "
        "actualizan con la frecuencia requerida; y (iii) la evolución "
        "del riesgo país, cuya disminución sostenida reduciría la tasa "
        "de descuento y elevaría tanto el VAN como la atractividad del "
        "proyecto para inversores externos."
    )
    para(
        "El modelo financiero se mantiene robusto bajo escenarios "
        "macroeconómicos adversos por tres razones: el ticket "
        "promedio se actualiza naturalmente con la inflación (al "
        "estar referenciado a precios de mercado); los costos "
        "variables son proporcionalmente bajos respecto a los "
        "ingresos (con un componente mayoritario que es el pago a los "
        "trabajadores, 80% del GMV); y la estructura de costos fijos "
        "está parcialmente dolarizada (infraestructura cloud, "
        "herramientas SaaS), lo que protege el modelo de shocks "
        "cambiarios bruscos."
    )

    page_break()


# =========================================================================
# CAPÍTULO VI — ASPECTOS LEGALES
# =========================================================================
def build_capitulo_VI():
    section_title("Capítulo VI — Aspectos Legales")

    h1("6.1 Bases legales (Q1 2026)")
    para(
        "El marco legal es clave para OFiX porque representa protección "
        "para la empresa, los trabajadores y los usuarios. Asegura "
        "operaciones seguras, cumplimiento regulatorio, transparencia en "
        "los datos y reducción de riesgos laborales y comerciales."
    )
    bullets([
        "Redacción de Términos y Condiciones (responsabilidades, rol de "
        "intermediación, alcances, tarifas, reclamos).",
        "Redacción de Política de Privacidad + manejo de datos bajo Ley "
        "25.326.",
        "Inscripción de la Base de Datos ante la AAIP.",
        "Contrato de uso para trabajadores, dejando explícito que no "
        "existe relación laboral.",
        "NDA y cesión de derechos de software para desarrolladores y "
        "proveedores.",
        "Registro de marca OFiX en INPI (clases 35, 37, 42, 45).",
        "Registro de derechos de autor del software en DNDA.",
        "Constitución societaria → SAS.",
        "Acuerdo marco con aseguradora para ofrecer cobertura opcional "
        "por servicio, donde: el seguro lo paga el usuario (hogar o "
        "pyme), OFiX no asume costos, OFiX no asume responsabilidad civil "
        "directa, OFiX solo actúa como intermediario ofreciendo el canal "
        "de compra.",
        "Redacción del contrato marco B2B + SLA para pymes gastronómicas.",
    ])
    para(
        "Objetivo: operar legalmente desde el primer día, protegidos en "
        "datos, marca, software y responsabilidad, dejando clara la "
        "independencia entre OFiX y los trabajadores/usuarios, y la no "
        "asunción de costos de seguros."
    )

    h1("6.2 Compliance, seguridad y protección de datos (Q2 2026)")
    bullets([
        "Implementación técnica de políticas de privacidad.",
        "Cumplimiento integral de la Ley 25.326.",
        "KYC básico para trabajadores (identidad + antecedentes).",
        "Protocolo de incidentes en datos y reclamos.",
        "Ajustes contractuales post-piloto.",
        "Auditoría preliminar impositiva (AFIP + Ingresos Brutos).",
        "Validación del sistema de pagos y retenciones (Mercado Pago).",
        "Revisión del régimen de facturación.",
    ])
    para(
        "Objetivo: reducir riesgos legales y reforzar estándares de "
        "protección de datos, identidad y seguridad dentro de la "
        "plataforma."
    )

    h1("6.3 Consolidación jurídica y escalabilidad (Q3 2026)")
    bullets([
        "Actualización de Términos y Condiciones según uso real.",
        "Implementación del proceso formal de verificación de trabajadores.",
        "Formalización del sistema de seguros por servicio: el usuario "
        "decide si quiere cobertura (opcional u obligatoria según rubro); "
        "OFiX presenta las pólizas disponibles y facilita el pago; OFiX "
        "no toma riesgo indemnizatorio.",
        "Contratos específicos para grandes cuentas (hoteles, cadenas, "
        "coworks).",
        "Regularización laboral interna del equipo OFiX.",
        "Verificación legal de claims publicitarios.",
        "Protocolo de prevención de fraude.",
    ])
    para(
        "Objetivo: asegurar que la operación pueda escalar sin generar "
        "multas, riesgos o incumplimientos regulatorios a medida que crece "
        "la base de usuarios."
    )

    h1("6.4 Auditoría anual y estándares (Q4 2026)")
    bullets([
        "Auditoría legal integral del año.",
        "Actualización de políticas para 2027.",
        "Preparación legal para rondas de inversión (carpeta completa).",
        "Evaluación de certificaciones (ISO 27001, buenas prácticas de "
        "marketplaces).",
        "Regularización impositiva anual.",
        "Refuerzo de políticas de protección al consumidor.",
    ])
    para(
        "Objetivo: cerrar el año con cumplimiento total, menor exposición "
        "a riesgos y una estructura apta para escalar o levantar capital."
    )

    page_break()


# =========================================================================
# CAPÍTULO VII — PLAN DE IMPLEMENTACIÓN Y RIESGOS
# =========================================================================
def build_capitulo_VII():
    section_title("Capítulo VII — Plan de Implementación y Riesgos")

    h1("7.1 Plan de implementación del primer año de operaciones")
    para(
        "El objetivo del primer año es poner en marcha OFIX como "
        "plataforma operativa, lanzar el MVP funcional, validar su uso "
        "real con hogares y pymes gastronómicas, y adquirir a los primeros "
        "usuarios y trabajadores verificados."
    )
    para(
        "En esta sección se detalla el plan de implementación dividido por "
        "trimestres (Q1–Q4 2026) y organizado según las principales áreas "
        "del proyecto: Equipo y Organización, Desarrollo de Producto, "
        "Operaciones del Servicio, Marketing y Adquisición, Administración "
        "y Finanzas, y Legal y Normativa. Al finalizar el análisis, se "
        "presentan también los costos estimados asociados a cada etapa, "
        "lo que permite entender el esfuerzo operativo y financiero "
        "necesario para ejecutar el primer año del proyecto."
    )

    h1("7.2 Desarrollo de Producto — Año 1")
    para(
        "Durante el primer año, el foco del desarrollo de producto es "
        "llevar a OFIX desde un MVP funcional hasta una plataforma "
        "estable, confiable y lista para escalar. El trabajo se organiza "
        "por trimestres, acompañando el crecimiento del equipo y los "
        "aprendizajes del piloto."
    )
    h2("7.2.1 Q1 2026: Construcción del MVP y primeras pruebas reales")
    para(
        "En este trimestre desarrollamos la versión inicial del producto "
        "que permite validar la propuesta de valor con usuarios reales. "
        "El objetivo no es tener «la app perfecta», sino un MVP sólido "
        "que permita operar en un piloto controlado."
    )
    para("Principales desarrollos:")
    bullets([
        "Diseño final de UX/UI del MVP, priorizando simplicidad y claridad.",
        "Funcionalidades base: registro e inicio de sesión, creación de "
        "solicitudes, envío y recepción de cotizaciones, perfiles de "
        "usuarios y trabajadores.",
        "Configuración del backend, base de datos y seguridad.",
        "Integración básica con Google Maps para geolocalización.",
        "Primeras pruebas internas y correcciones rápidas.",
    ])
    para(
        "Objetivo del trimestre: tener un MVP funcional que permita "
        "iniciar una beta cerrada, recibir feedback real y entender cómo "
        "usan la plataforma tanto trabajadores como hogares."
    )

    h2("7.2.2 Q2–Q3 2026: Confianza, reputación y comunicación")
    para(
        "En estos dos trimestres el foco pasa de «funcionar» a «funcionar "
        "bien». Es decir, construir las funciones que generan confianza, "
        "que es lo más importante en un marketplace de servicios."
    )
    para("Principales desarrollos:")
    bullets([
        "Implementación del sistema de verificación de identidad de "
        "trabajadores.",
        "Sistema de reseñas y puntuaciones, clave para generar seguridad "
        "y transparencia.",
        "Integración de Mercado Pago (pagos, split, manejo de fondos).",
        "Desarrollo del chat interno cliente–trabajador.",
        "Calendario para que los trabajadores gestionen su disponibilidad "
        "y trabajos.",
        "Optimización del backend para manejar mayor volumen y tráfico.",
    ])
    para(
        "Objetivo del trimestre: lograr que la plataforma deje de ser "
        "solo funcional y pase a ser confiable. Estas features permiten "
        "que el cliente sienta seguridad al contratar y que el trabajador "
        "pueda operar mejor."
    )

    h2("7.2.3 Q4 2026: Panel del trabajador")
    para(
        "Con el aprendizaje del piloto, el feedback del mercado y las "
        "campañas de crecimiento, el objetivo del último trimestre es "
        "darle herramientas más avanzadas al trabajador y dejar el "
        "producto listo para escalar en 2027."
    )
    para("Principales desarrollos:")
    bullets([
        "Panel de estadísticas del trabajador con datos como ingresos, "
        "historial y rendimiento.",
        "Historial completo de trabajos realizados.",
        "Implementación de notificaciones push (si aplica).",
        "Mejoras de interfaz, fluidez, tiempos de carga y navegación.",
        "Refactor y optimización para preparar la plataforma para "
        "expansión territorial.",
    ])
    para(
        "Objetivo del trimestre: convertir el MVP en un producto estable, "
        "con mejores herramientas de gestión para el trabajador y con una "
        "experiencia más madura para todos los usuarios."
    )

    h1("7.3 Operaciones del Servicio")
    para(
        "La operación es el corazón de OFIX: es donde se conectan hogares, "
        "pymes gastronómicas y trabajadores. Durante el primer año, el "
        "objetivo es crear procesos simples, confiables y escalables que "
        "permitan entregar un servicio consistente."
    )
    h2("7.3.1 Q1 2026: Diseño de procesos y piloto inicial")
    para(
        "En esta etapa definimos cómo funciona OFIX «en la vida real». "
        "Todo lo operativo se prueba por primera vez con usuarios "
        "verdaderos."
    )
    para("Procesos clave desarrollados:")
    bullets([
        "Onboarding de trabajadores: cómo se registran, qué datos se "
        "validan, tiempos, documentación y pautas de calidad.",
        "Proceso de cotización: reglas, tiempos de respuesta y formato "
        "de presupuestos.",
        "Asignación de trabajos: cómo se selecciona al trabajador "
        "recomendado y cómo se presentan opciones al cliente.",
        "Gestión de reclamos: pasos, tiempos de resolución y políticas de "
        "retrabajo.",
        "Políticas de cancelación y horarios.",
    ])
    para("Piloto inicial — con el MVP activo, iniciamos un piloto real con:")
    bullets([
        "20–30 hogares.",
        "Primeras pymes gastronómicas interesadas.",
        "20–30 trabajadores piloto.",
    ])
    para(
        "Esto nos permite validar procesos, detectar problemas y ajustar "
        "el servicio antes de escalar."
    )
    h2("7.3.2 Q2 2026: Escalamiento del lado de la oferta")
    para(
        "Una vez ordenados los procesos iniciales, escalamos la base de "
        "trabajadores para poder atender más barrios y aumentar la "
        "disponibilidad."
    )
    para("Actividades clave:")
    bullets([
        "Objetivo de 80–100 trabajadores activos.",
        "Entrenamientos periódicos en uso de la app, trato al cliente y "
        "buenas prácticas.",
        "Medición de KPIs operativos: tiempos de respuesta, tiempo "
        "promedio de asignación, tasa de éxito por rubro, reclamos por "
        "servicio.",
    ])
    para(
        "En esta fase, ya empieza a existir un volumen real de "
        "solicitudes, lo que obliga a profesionalizar más el soporte."
    )
    h2("7.3.3 Q3 2026: Ajustes operativos y expansión por barrios")
    para("Con datos, métricas y feedback real, ajustamos procesos para mejorar la eficiencia.")
    para("Enfoque principal:")
    bullets([
        "Reducción de tiempos de respuesta.",
        "Mejoras en el matching entre cliente y profesional.",
        "Expansión a más barrios de CABA y parte de GBA.",
        "Ajustes en reglas de disponibilidad y cancelaciones.",
    ])
    para("El foco es pasar de «funcionar» a «funcionar bien y rápido».")
    h2("7.3.4 Q4 2026: Consolidación y preparación para 2027")
    para("Para fin de año, buscamos tener una operación sólida que pueda escalar.")
    para("Acciones principales:")
    bullets([
        "Incorporación del Customer Support / Community Operations.",
        "Formalización de protocolos de soporte 24/7 (no siempre "
        "full-time; puede ser distribución de turnos o servicio externo).",
        "Documentación de manuales operativos para preparar la expansión "
        "2027.",
    ])

    h1("7.4 Marketing y Adquisición — Plan trimestral")
    para(
        "El propósito del primer año en marketing es posicionar a OFIX "
        "como una plataforma confiable, cercana y transparente, tanto "
        "para hogares como para pymes gastronómicas. La estrategia "
        "combina campañas digitales, presencia territorial, construcción "
        "de confianza y contenido educativo. Además, se incorpora un eje "
        "clave: la creación de marca personal de los tres founders como "
        "forma de reforzar credibilidad."
    )
    h2("7.4.1 Q1 2026: Lanzamiento y comunicación inicial")
    para("Acciones principales:")
    bullets([
        "Campañas iniciales en Meta Ads y Google Ads enfocadas en "
        "servicios urgentes.",
        "Activación del Programa de Referidos para hogares y trabajadores.",
        "Presencia inicial en redes sociales con contenido sobre "
        "seguridad, proceso de trabajo y presentación del MVP.",
        "Comunicación de los 3 founders como las caras visibles del "
        "proyecto.",
    ])
    para("Marca personal de los founders:")
    bullets([
        "Presentación pública de Rocco, Francisco y Priscilla en redes y "
        "página web.",
        "Historias personales: por qué nace OFIX, qué problema vimos, "
        "cómo trabajamos.",
        "Publicaciones hablando de desafíos reales del emprendimiento, "
        "decisiones de producto, aprendizajes y visión del proyecto.",
    ])
    para(
        "Este enfoque ayuda a que los usuarios sepan quiénes están detrás "
        "de la plataforma, algo fundamental en un mercado donde confianza "
        "y credibilidad son todo."
    )
    h2("7.4.2 Q2 2026: Expansión geolocalizada y entrada al segmento B2B")
    para("Acciones:")
    bullets([
        "Campañas segmentadas por barrios de CABA.",
        "Visitas comerciales a pymes gastronómicas.",
        "Alianzas con cámaras gastronómicas y proveedores.",
        "Producción de contenido educativo (tips de mantenimiento, "
        "procesos de seguridad).",
    ])
    para("Marca personal en esta etapa:")
    bullets([
        "Los founders se posicionan como referentes en temas de economía "
        "del hogar, servicios, seguridad, verificación y eficiencia "
        "operativa.",
        "Lives, videos cortos y posteos mostrando el «detrás de escena» "
        "del equipo.",
        "Francisco mostrando aspectos tech, Rocco hablando del producto "
        "y la visión, Priscilla mostrando el día a día de la operación.",
    ])
    para("Esto humaniza la marca y genera cercanía con nuevos usuarios.")
    h2("7.4.3 Q3 2026: Reputación, seguridad y confianza")
    para("Acciones:")
    bullets([
        "Campaña «OFIX te cuida»: seguridad, reseñas, reputación y "
        "verificación de identidad.",
        "Micro Influencers barriales.",
        "Casos reales de usuarios satisfechos.",
    ])
    para("Marca personal:")
    bullets([
        "Videos cortos tipo «preguntas frecuentes» respondidos "
        "directamente por los founders.",
        "Historias del piloto, aprendizajes y mejoras que hicimos.",
        "Transparencia radical: mostrar errores, correcciones y "
        "evolución del producto.",
    ])
    para(
        "En esta fase, la marca personal funciona como sello de "
        "responsabilidad, reforzando la idea de que «hay gente real que "
        "da la cara»."
    )
    h2("7.4.4 Q4 2026: Eventos, estacionalidad y consolidación")
    para("Acciones:")
    para(
        "Participación en ferias gastronómicas y exposiciones sectoriales:"
    )
    bullets([
        "Poner un stand en La Rural, verificar que exposición es la mejor "
        "para participar. El precio promedio de un stand en La Rural ronda "
        "alrededor de 800-1000 USD, dependiendo la cantidad de m2 que "
        "tenga el stand. Esta información es tomada en cuenta en base a "
        "precios actuales (2025) de los valores de un stand en La Rural.",
        "Otra acción que podemos realizar es ir a encontrar usuarios a "
        "las ferias gastronómicas «Bocas Abiertas» y «Masticar», suele "
        "haber mucha gente joven, entre 15 y 50 años, muchas familias y a "
        "su vez muchas empresas gastronómicas, por lo tanto es buena.",
        "Campañas estacionales de fin de año, mantenimiento pre-verano.",
        "Retargeting y campañas de recurrencia.",
    ])
    para("Marca personal:")
    bullets([
        "Talleres, charlas o entrevistas donde los founders cuentan el "
        "proceso de emprender OFIX.",
        "Construcción de contenido aspiracional e inspirador para la "
        "comunidad.",
        "Branding unificado entre OFIX y sus founders, posicionándose como "
        "referentes en el sector de servicios digitales.",
    ])
    h2("7.4.5 ¿Por qué la marca personal es importante para OFIX?")
    para(
        "Porque OFIX es un marketplace donde el usuario debe confiar para "
        "dejar entrar un profesional a su casa o delegar trabajos "
        "esenciales a un desconocido. Mostrar quiénes somos los que "
        "estamos detrás del proyecto:"
    )
    bullets([
        "disminuye barreras de adopción.",
        "genera sensación de cercanía.",
        "transmite transparencia.",
        "refuerza profesionalismo.",
        "humaniza la marca.",
        "consolida fidelidad.",
    ])
    para(
        "Una app fría y anónima no genera la misma seguridad que un "
        "proyecto con founders que dan la cara."
    )

    h1("7.5 Administración y Finanzas")
    h2("7.5.1 Q1–Q2 2026: Fundaciones financieras")
    para("Acciones:")
    bullets([
        "Estructura de costos del primer año.",
        "Proyección de ingresos basada en TAM/SAM/SOM.",
        "Alta contable y fiscal de la sociedad.",
        "Control del burn rate y gastos mensuales.",
        "Registro y categorización de operaciones financieras.",
    ])
    para("Objetivo: tener control de caja y evitar desvíos.")
    h2("7.5.2 Q3 2026: Métricas clave y análisis")
    para("Acciones:")
    bullets([
        "Implementación del dashboard financiero (CAC, LTV, margen por "
        "categoría).",
        "Revisión del pricing según comportamiento real.",
        "Ajustes de presupuesto en campañas y operaciones.",
    ])
    para("Objetivo: tomar decisiones basadas en datos reales del mercado.")
    h2("7.5.3 Q4 2026: Cierre anual y planificación 2027")
    para("Acciones:")
    bullets([
        "Cierre contable anual.",
        "Auditoría externa (si aplica).",
        "Proyección financiera del segundo año.",
        "Análisis de unit economics.",
    ])
    para("Objetivo: preparar un 2027 más grande y financiado de manera responsable.")

    h1("7.6 Análisis de riesgos potenciales")
    note_grey(
        "Los riesgos potenciales fueron desarrollados en profundidad en la "
        "sección 2.9.4 (Amenazas del FODA), incluyendo informalidad "
        "estructural, marco regulatorio en debate, brechas tecnológicas, "
        "inestabilidad económica, entrada de actores internacionales, "
        "modelos informales gratuitos, resistencia cultural a la "
        "formalización, regulaciones cambiantes y barreras tecnológicas."
    )

    h1("7.7 Escalabilidad regional a 5 años")
    para(
        "A partir de distintas investigaciones realizamos un análisis de "
        "escalabilidad de acá a 5 años en distintos mercados de LATAM, "
        "considerando tanto a pymes gastronómicas como a hogares y "
        "trabajadores de oficios."
    )
    h2("7.7.1 Uruguay")
    para(
        "Uruguay es un mercado chico pero tentador para validar procesos "
        "e implementar el modelo. Existen alrededor de 17.000 locales "
        "gastronómicos, concentrados principalmente en Montevideo y "
        "Canelones, lo que facilita la implementación en un entorno más "
        "controlado y digitalizado. Aunque la informalidad laboral en "
        "oficios es menor que en otros países, sigue siendo importante y "
        "deja espacio para sistemas de reputación y pagos seguros. "
        "Además, la penetración de billeteras electrónicas como Mercado "
        "Pago está muy instalada, lo que reduce fricciones en la "
        "adopción. Más allá de las pymes gastronómicas, los hogares "
        "uruguayos representan un segmento relevante, ya que muestran "
        "alta conectividad digital y predisposición a pagar con "
        "billeteras electrónicas. Por el lado de la oferta, los "
        "trabajadores de oficio suelen captar clientes mediante Facebook "
        "y WhatsApp, lo que evidencia predisposición a adoptar soluciones "
        "digitales más integrales."
    )
    h2("7.7.2 México")
    para(
        "Por su parte, México representa una oportunidad estratégica de "
        "gran escala. Cuenta con más de 600.000 establecimientos "
        "gastronómicos y 130,9 millones de habitantes, lo que lo convierte "
        "en un mercado muy grande con necesidades urgentes. La "
        "informalidad es muy alta, lo que hace que la confianza y la "
        "reputación sean factores críticos para las pymes gastronómicas: "
        "un problema técnico puede frenar un restaurante por horas o "
        "días, generando pérdidas inmediatas. La digitalización de pagos "
        "avanza (CoDi, Mercado Pago, Stripe), aunque la bancarización "
        "sigue siendo limitada en micro-restaurantes. En paralelo, los "
        "hogares mexicanos constituyen un mercado masivo que también "
        "enfrenta problemas de confianza y tiempos de respuesta, con "
        "millones de usuarios acostumbrados a contratar por referencias "
        "personales. En cuanto a la oferta, la informalidad de los "
        "trabajadores de oficio supera el 55%, lo que abre una "
        "oportunidad para darles visibilidad y seguridad en los pagos. En "
        "un horizonte de cinco años, ciudades como Ciudad de México, "
        "Guadalajara y Monterrey se perfilan como nichos iniciales "
        "ideales para escalar tanto en pymes gastronómicas como en "
        "hogares."
    )
    h2("7.7.3 Colombia")
    para(
        "En Colombia, el mercado gastronómico ronda los 200.000 locales, "
        "concentrados principalmente en Bogotá y Medellín, donde habitan "
        "cerca de 14 millones de personas. La población total del país "
        "supera los 53 millones, lo que lo convierte en un mercado "
        "atractivo a considerar. La situación es similar a México, con "
        "alta informalidad y fuerte dependencia del boca a boca. Sin "
        "embargo, el uso de billeteras electrónicas (Nequi, Daviplata) y "
        "la digitalización de pymes gastronómicas está creciendo, "
        "acelerando la adopción de soluciones tecnológicas. Los hogares "
        "colombianos, al igual que las pymes gastronómicas, enfrentan "
        "dificultades para acceder a técnicos confiables y con precios "
        "transparentes, lo que los convierte en clientes potenciales "
        "clave. Por el lado de la oferta, los trabajadores de oficio "
        "dependen en gran medida de redes sociales para conseguir empleo, "
        "lo que muestra que existe un terreno fértil para integrarlos en "
        "una plataforma que les formalice sus ingresos. En una visión a "
        "cinco años, Colombia puede consolidarse como un mercado "
        "interesante para expandirse, priorizando las grandes ciudades y "
        "luego las regiones secundarias."
    )
    h2("7.7.4 Brasil")
    para(
        "Finalmente, Brasil aparece como un mercado muy atractivo a largo "
        "plazo, con más de un millón de locales gastronómicos y una "
        "demanda masiva y continua de servicios técnicos. El sistema de "
        "pagos PIX, de adopción casi universal, facilita la "
        "digitalización de transacciones. El principal desafío radica en "
        "la fragmentación del mercado y en la presencia de plataformas "
        "generalistas, aunque ninguna especializada en gastronomía. La "
        "estrategia de entrada debería concentrarse en grandes ciudades "
        "como São Paulo y Río de Janeiro, donde se encuentra la mayor "
        "densidad de locales. Al mismo tiempo, los hogares brasileros "
        "representan un mercado enorme, ya que el mantenimiento del "
        "hogar es un gasto frecuente y PIX facilita transacciones rápidas "
        "y seguras. En cuanto a la oferta, los trabajadores de oficio en "
        "Brasil suelen operar en la informalidad y captar clientes por "
        "OLX o WhatsApp, lo que demuestra la existencia de un ecosistema "
        "digital ya instalado. En un plazo de cinco años, Brasil ofrece "
        "un potencial de crecimiento enorme tanto por la escala de pymes "
        "gastronómicas como por el mercado masivo de hogares, siempre "
        "que se construyan alianzas estratégicas y se asegure la "
        "incorporación de la base laboral."
    )
    h2("7.7.5 Tabla comparativa de mercados regionales")
    add_table(
        ["País", "Pymes gastronómicas", "Hogares",
         "Trabajadores de oficio"],
        [
            ["Uruguay",
             "17.000 locales, concentrados en Montevideo y Canelones; "
             "mercado chico pero ideal para validar procesos; buena "
             "adopción de billeteras digitales.",
             "Hogares muy digitalizados, alta penetración de pagos "
             "electrónicos; predisposición a soluciones confiables.",
             "Informalidad menor que en otros países pero significativa; "
             "captan clientes en Facebook y WhatsApp; listos para "
             "digitalizarse."],
            ["México",
             "+600.000 locales gastronómicos, mercado enorme; alta "
             "informalidad; confianza y reputación críticas; urgencias "
             "constantes en equipamiento.",
             "+130M habitantes; hogares enfrentan mismas problemáticas de "
             "confianza y tiempos; bajo acceso a técnicos confiables.",
             "+55% informalidad laboral; millones de técnicos dependen de "
             "redes informales; necesitan visibilidad y pagos seguros."],
            ["Colombia",
             "~200.000 locales, concentrados en Bogotá y Medellín "
             "(14M hab.); digitalización creciente con Nequi/Daviplata.",
             "Los hogares también dependen del boca a boca; creciente "
             "adopción de billeteras digitales.",
             "Alta informalidad; técnicos usan redes sociales para "
             "conseguir trabajo; predisposición a plataformas que "
             "formalicen ingresos."],
            ["Brasil",
             "+1M locales, mercado masivo; sistema PIX universal; "
             "fragmentación del mercado; ciudades clave: São Paulo y Río.",
             "Hogares representan un mercado gigante; mantenimientos "
             "frecuentes; PIX simplifica cobros inmediatos.",
             "Amplia base de técnicos informales; buscan clientes en "
             "OLX/WhatsApp; mercado fértil para formalización digital."],
        ],
        col_widths=[2.5, 4.5, 4.5, 4.5],
    )

    page_break()


# =========================================================================
# CONCLUSIONES (capítulo general)
# =========================================================================
def build_conclusiones():
    section_title("Conclusiones generales")
    para(
        "El presente Trabajo Final de Graduación desarrolló de manera "
        "integral el plan de negocio del producto digital OFIX, una "
        "plataforma de marketplace orientada a la contratación formal, "
        "segura y transparente de trabajadores de oficios en Argentina. "
        "A lo largo de siete capítulos se examinó la oportunidad, se "
        "diseñó la solución, se proyectó el modelo "
        "económico-financiero y se planificó la implementación del "
        "primer año, en cumplimiento del propósito de articular los "
        "conocimientos adquiridos a lo largo de la Licenciatura en "
        "Negocios Digitales."
    )

    h1("Validación de la hipótesis")
    para(
        "La investigación primaria —102 respuestas de encuesta de "
        "demanda, 21 de oferta y ocho entrevistas en profundidad— "
        "valida empíricamente la hipótesis del proyecto: la necesidad "
        "existe, es masiva y recurrente. El 96 % de los encuestados "
        "contrató al menos un trabajador en el último año; el 69 % "
        "manifestó predisposición a utilizar una plataforma digital "
        "con verificación, reseñas y pagos seguros; y, del lado de la "
        "oferta, el 90 % de los trabajadores afirmó que la utilizaría "
        "para conseguir clientes con cobro asegurado y reputación "
        "validada. Los hallazgos cualitativos confirman, además, que "
        "los tres pain points centrales —confianza, transparencia de "
        "precios y tiempos de respuesta— son consistentes entre los "
        "segmentos de demanda y entre regiones geográficas."
    )

    h1("Diferencial competitivo")
    para(
        "El análisis de once competidores locales e internacionales y "
        "la construcción de la matriz de posicionamiento permitieron "
        "identificar un espacio claro en el mercado argentino. "
        "Ninguna plataforma local integra simultáneamente verificación "
        "de identidad, reputación validada, pago digital protegido y "
        "garantía post-servicio sobre una capa de geolocalización en "
        "tiempo real. Reeparando, HomeSolution, Habitissimo, Zolvers e "
        "IguanaFix resuelven sólo parcialmente la cadena de valor, lo "
        "que deja una ventana abierta para una propuesta integral "
        "end-to-end. Los benchmarks internacionales —TaskRabbit, "
        "Airtasker y Urban Company— demuestran que el modelo es "
        "escalable y rentable cuando se construye con disciplina "
        "operativa."
    )

    h1("Dimensionamiento de la oportunidad y viabilidad económica")
    para(
        "El dimensionamiento del mercado, construido sobre datos "
        "demográficos del INDEC, CEPAL y el Banco Mundial y validado "
        "contra fuentes externas (Statista, Fitch Solutions, Mordor "
        "Intelligence), ubica el SAM subregional (Argentina, Chile y "
        "Uruguay) en USD 2,9 mil millones y el SOM Argentina entre USD "
        "2,85 y USD 5,70 millones según el escenario de adopción, con "
        "un valor recomendado de USD 3,5 millones al quinto año. El "
        "modelo financiero, expresado en dólares y descontado al WACC "
        "del 27 %, arroja un VAN de USD 82.015 sin perpetuidad —y de "
        "USD 345.724 con valor terminal— y una TIR del 48 % y 77 % "
        "respectivamente, sustancialmente superiores al costo del "
        "capital. La inversión inicial requerida asciende a USD "
        "122.302, y el período de recupero se ubica en 35 meses "
        "(payback tradicional) y 44 meses (descontado). En conjunto, "
        "los indicadores confirman la viabilidad económica del "
        "proyecto."
    )

    h1("Viabilidad técnica y operativa")
    para(
        "El MVP fue diseñado bajo el criterio de mínima viabilidad: "
        "las funcionalidades clasificadas como Must Have en la matriz "
        "MoSCoW alcanzan para validar la propuesta de valor en el "
        "piloto inicial, previsto con 20 a 30 hogares y 20 a 30 "
        "trabajadores durante el primer trimestre. El prototipo "
        "navegable, sometido a testeo de usabilidad con resultados "
        "favorables de NPS y SUS, demuestra que la experiencia de "
        "usuario está suficientemente madura para iniciar la "
        "construcción del producto. El plan trimestral Q1–Q4 "
        "articula las seis áreas operativas del proyecto y los "
        "recursos requeridos se dimensionaron con criterios "
        "conservadores."
    )

    h1("Próximos pasos y limitaciones")
    para(
        "Tres prioridades organizan el trabajo de los próximos meses: "
        "construir y validar el prototipo navegable en Figma con "
        "usuarios reales de los tres segmentos; iniciar las "
        "conversaciones con aseguradoras y proveedores de KYC para "
        "asegurar la integración técnica previa al lanzamiento del "
        "piloto en Q1 2026; y formalizar el equipo de cinco personas "
        "con los procesos internos descritos en el Capítulo IV. Como "
        "limitaciones del estudio cabe reconocer que la muestra de la "
        "encuesta no es probabilísticamente representativa del "
        "universo nacional y que las pruebas de campañas digitales se "
        "ejecutaron con presupuesto acotado y durante un tiempo "
        "limitado, por lo que sus métricas deben interpretarse como "
        "referencias iniciales y no como compromisos."
    )

    h1("Reflexión final")
    para(
        "OFIX representa una oportunidad concreta de aportar valor "
        "social y económico a un sector ampliamente afectado por la "
        "informalidad estructural argentina. El equipo fundador asume "
        "el compromiso de avanzar con velocidad pero sin atajos, "
        "priorizando la construcción de confianza con usuarios y "
        "trabajadores por sobre la captura de cuota de mercado a "
        "cualquier costo. El presente trabajo deja sentadas las "
        "bases metodológicas y operativas para iniciar esa "
        "construcción durante 2026."
    )
    page_break()


# =========================================================================
# BIBLIOGRAFÍA (literal p.75-77)
# =========================================================================
def build_bibliografia():
    section_title("Bibliografía")
    note_grey("Referencias en formato APA, transcritas literalmente de la tesis original.")
    refs = [
        "Arslan, P. (2025, 11 19). Administrador de Meta Ads. Ads "
        "manager. https://adsmanager.facebook.com/adsmanager/manage/"
        "adsets/edit/standalone",
        "Cabrera, E. (2025, Abril 14). Trabajo informal: cuatro de cada "
        "10 personas está fuera del sistema registrado, según el INDEC. "
        "El Ámbito. https://www.ambito.com/economia/casi-la-mitad-los-"
        "trabajadores-argentinos-estan-la-informalidad-mas-9-millones-"
        "no-tienen-derechos-laborales-n6134573",
        "Clarin, R. (2024, 06 06). Cuánto cobra un electricista y qué "
        "tener en cuenta antes de contratarlo. Diario Clarín. "
        "https://www.clarin.com/servicios/cobra-electricista-tener-"
        "cuenta-contratarlo_0_5AsUY63IwP.html",
        "Electricistas de Argentina. (n.d.). Facebook. Retrieved "
        "November 10, 2025, from https://www.facebook.com/groups/"
        "886398221481016/?locale=es_LA",
        "Inflación: estas son las causas y herramientas para combatirla. "
        "(2025, October 28). BBVA. Retrieved November 10, 2025, from "
        "https://www.bbva.com/es/salud-financiera/inflacion-estas-son-"
        "las-causas-y-herramientas-para-combatirla/",
        "Instituto Nacional de Estadística y Censos de la República "
        "Argentina. (n.d.). INDEC: Instituto Nacional de Estadística y "
        "Censos de la República Argentina. Retrieved November 10, 2025, "
        "from https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-58",
        "Kemp, S. (n.d.). Digital 2024 Argentina. Data Reportal. "
        "https://datareportal-com.translate.goog/reports/"
        "digital-2024-argentina",
        "Libre, M. (2025, 11 8). Reputación de vendedores. Mercado "
        "Libre. https://developers.mercadolibre.com.ar/es_ar/"
        "reputacion-de-vendedores",
        "Mercado de trabajo. Indicadores de informalidad laboral (EPH). "
        "Cuarto trimestre de 2023 a cuarto trimestre de 2024. (2025, "
        "April 14). INDEC. Retrieved September 12, 2025, from "
        "https://www.indec.gob.ar/uploads/informesdeprensa/"
        "informalidad_laboral_eph_04_2529DEBE4DBB.pdf",
        "Mercado de trabajo. Tasas e indicadores socioeconómicos (EPH). "
        "Segundo trimestre de 2025. (2025, September 18). INDEC. "
        "Retrieved September 25, 2025, from https://www.indec.gob.ar/"
        "uploads/informesdeprensa/mercado_trabajo_eph_2trim25C42A813B2A"
        ".pdf",
        "Origlia, G. (2024, May 12). Vivir en negro: Los múltiples "
        "costos de la informalidad en el mundo laboral. CIPPEC. "
        "Retrieved November 10, 2025, from https://www.cippec.org/"
        "textual/vivir-en-negro-los-multiples-costos-de-la-informalidad-"
        "en-el-mundo-laboral/",
        "Pasos - Personas jurídicas - Inscripción - Régimen General. "
        "(n.d.). ARCA. Retrieved November 19, 2025, from https://www."
        "afip.gob.ar/regimenGeneral/inscripcion/personas-juridicas/"
        "pasos.asp",
        "Pedotti, A. C. (2025, October 7). Fintech y billeteras "
        "virtuales: del boom de los pagos al desafío de los préstamos. "
        "Clarin.com. Retrieved November 10, 2025, from https://www."
        "clarin.com/80-aniversario/bancos-finanzas/fintech-billeteras-"
        "virtuales-boom-pagos-desafio-prestamos_0_DzLTG9aqHi.html",
        "Pereyra, F. (2022, Diciembre 22). Desafíos de la regulación del "
        "trabajo de plataformas digitales de reparto en Argentina. "
        "Conicet. https://ri.conicet.gov.ar/handle/11336/222022",
        "Reinhold, M. (2025, March 30). ¿Hay techo?: las billeteras "
        "digitales van por todo y nuevos jugadores se suman al sector. "
        "La Nación. Retrieved November 10, 2025, from https://www."
        "lanacion.com.ar/economia/negocios/hay-techo-las-billeteras-"
        "digitales-van-por-todo-y-nuevos-jugadores-se-suman-al-sector-"
        "nid30032025/",
        "Resaltador, E. (2025, Abril 15). Según INDEC el 42% de los "
        "argentinos tiene empleo informal. El resaltador. https://"
        "elresaltador.com.ar/segun-indec-el-42-de-los-argentinos-tiene-"
        "empleo-informal/",
        "Unidas, N. (n.d.). La brecha digital limita las ventajas de la "
        "inteligencia artificial generativa en la esfera laboral de "
        "América Latina. Naciones Unidas. https://news.un.org/es/story/"
        "2024/07/1531666",
    ]
    for r in refs:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(1)
        p.paragraph_format.first_line_indent = Cm(-1)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run = p.add_run(r)
        _set_run(run, size=12)
    page_break()


# =========================================================================
# ANEXOS
# =========================================================================
def build_anexos():
    section_title("Anexos")
    note_grey(
        "Material complementario adicional al cuerpo principal del "
        "documento."
    )


# =========================================================================
# BUILD
# =========================================================================
if __name__ == "__main__":
    build_caratula()
    build_resumen()
    build_indice()
    build_agradecimientos()
    build_introduccion()
    build_capitulo_I()
    build_capitulo_II()
    build_capitulo_III()
    build_capitulo_IV()
    build_capitulo_V()
    build_capitulo_VI()
    build_capitulo_VII()
    build_conclusiones()
    build_bibliografia()
    build_anexos()
    out = "/Users/fran/Desktop/Tesis/TFG-OFIX-Final-Unificado.docx"
    doc.save(out)
    print(f"OK → {out}")

