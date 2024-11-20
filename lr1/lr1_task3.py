from rdflib import Graph, Literal, RDF, URIRef, Namespace
from rdflib.namespace import FOAF, XSD

# Створення графа
g = Graph()

# Визначаємо базові URI та простори імен
EX = Namespace("http://example.org/")
g.bind("ex", EX)

# Інформація про Кейда
cade = URIRef("http://example.org/Cade")
g.add((cade, RDF.type, FOAF.Person))
g.add((cade, FOAF.name, Literal("Cade", datatype=XSD.string)))
g.add((cade, FOAF.homepage, URIRef("http://example.org/CadeHomepage")))
g.add((cade, FOAF.interest, Literal("Birds")))
g.add((cade, FOAF.interest, Literal("Ecology")))
g.add((cade, FOAF.interest, Literal("Environment")))
g.add((cade, FOAF.interest, Literal("Photography")))
g.add((cade, FOAF.interest, Literal("Traveling")))
g.add((cade, EX.degree, Literal("Bachelor of Biology", datatype=XSD.string)))
g.add((cade, EX.university, Literal("University of California", datatype=XSD.string)))
g.add((cade, EX.graduationYear, Literal(2011, datatype=XSD.gYear)))
g.add((cade, EX.address, Literal("1516 Henry Street, Berkeley, California 94709, USA")))
g.add((cade, EX.visitedCountry, Literal("Canada")))
g.add((cade, EX.visitedCountry, Literal("France")))

# Інформація про Емму
emma = URIRef("http://example.org/Emma")
g.add((emma, RDF.type, FOAF.Person))
g.add((emma, FOAF.name, Literal("Emma", datatype=XSD.string)))
g.add((emma, FOAF.homepage, URIRef("http://example.org/EmmaHomepage")))
g.add((emma, FOAF.interest, Literal("Cycling")))
g.add((emma, FOAF.interest, Literal("Music")))
g.add((emma, FOAF.interest, Literal("Traveling")))
g.add((emma, EX.degree, Literal("Master of Chemistry", datatype=XSD.string)))
g.add((emma, EX.university, Literal("University of Valencia", datatype=XSD.string)))
g.add((emma, EX.graduationYear, Literal(2015, datatype=XSD.gYear)))
g.add((emma, EX.address, Literal("Carrer de la Guardia Civil 20, 46020 Valencia, Spain")))
g.add((emma, EX.expertise, Literal("Waste Management")))
g.add((emma, EX.expertise, Literal("Toxic Waste")))
g.add((emma, EX.expertise, Literal("Air Pollution")))
g.add((emma, EX.visitedCountry, Literal("Portugal")))
g.add((emma, EX.visitedCountry, Literal("Italy")))
g.add((emma, EX.visitedCountry, Literal("France")))
g.add((emma, EX.visitedCountry, Literal("Germany")))
g.add((emma, EX.visitedCountry, Literal("Denmark")))
g.add((emma, EX.visitedCountry, Literal("Sweden")))

# Взаємозв'язок між Кейдом і Еммою
g.add((cade, FOAF.knows, emma))
g.add((EX.meeting, EX.year, Literal(2014, datatype=XSD.gYear)))
g.add((EX.meeting, EX.location, Literal("Paris", datatype=XSD.string)))


# Сериалізація у форматі Turtle
with open("graph.ttl", "w") as f:
    f.write(g.serialize(format="turtle"))

# Сериалізація у форматі XML
##print(g.serialize(format="xml"))


# Редагуємо файл: Кейд відвідував Німеччину, Еммі 36 років
g.remove((emma, FOAF.age, None))  # Видалення старих даних про вік, якщо вони були
g.add((emma, FOAF.age, Literal(36, datatype=XSD.integer)))
g.add((cade, EX.visitedCountry, Literal("Germany")))

# Перезаписуємо у файл Turtle
with open("graph.ttl", "w") as f:
    f.write(g.serialize(format="turtle"))


# Виведення всіх трійок
for s, p, o in g:
    print((s, p, o))


# Фільтрація для трійок з Еммою
for s, p, o in g.triples((emma, None, None)):
    print((s, p, o))


# Виведення трійок з іменами
for s, p, o in g.triples((None, FOAF.name, None)):
    print((s, p, o))
