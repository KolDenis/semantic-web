const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let citiesCache = [];

// Utility function for querying SPARQL endpoint
async function querySPARQL(query) {
    const endpoint = 'http://dbpedia.org/sparql';
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=application/json`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('SPARQL query error:', error);
        throw new Error('Failed to fetch data');
    }
}

app.get('/cities', async (req, res) => {
    const name = (req.query.name || '').toLowerCase().trim();
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 20; // Number of cities per page
    const offset = (page - 1) * limit;

    if (!citiesCache.length) {
        const sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?city ?name WHERE {
            ?city a dbo:City ;
                  dbo:country dbr:Ukraine ;
                  foaf:name ?name .
        }
        LIMIT 1000`;

        try {
            const response = await querySPARQL(sparqlQuery);
            const cities = response.results.bindings.map((result, i) => ({
                id: i + 1,
                uri: result.city.value,
                name: result.name.value
            }));

            citiesCache = cities;
        } catch (error) {
            return res.status(500).json({ error: 'Помилка отримання даних' });
        }
    }

    let filteredCities = citiesCache;

    // If a name is provided, filter cities by name (including partial matches)
    if (name) {
        filteredCities = citiesCache.filter(city =>
            city.name.toLowerCase().includes(name) ||
            name.split('').every(char => city.name.toLowerCase().includes(char))
        );
    }

    const totalPages = Math.ceil(filteredCities.length / limit);
    const paginatedCities = filteredCities.slice(offset, offset + limit);

    res.json({
        cities: paginatedCities,
        totalPages
    });
});

// Route for getting city details by ID
app.get('/city/:city_id', async (req, res) => {
    const cityId = parseInt(req.params.city_id);
    const city = citiesCache.find(c => c.id === cityId);

    if (!city) {
        return res.status(404).json({ error: 'Місто не знайдено' });
    }

    const descriptionQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    SELECT ?description ?history ?population ?creationDate WHERE {
        <${city.uri}> dbo:abstract ?description .
        OPTIONAL { <${city.uri}> dbo:history ?history. }
        OPTIONAL { <${city.uri}> dbo:populationTotal ?population. }
            OPTIONAL { <${city.uri}> dbo:foundingDate ?creationDate. }
        FILTER (lang(?description) = 'uk')
    }`;

    try {
        const response = await querySPARQL(descriptionQuery);
        const description = response.results.bindings[0]?.description?.value;
        const history = response.results.bindings[0]?.history?.value;
        const population = response.results.bindings[0]?.population?.value;
        const creationDate = response.results.bindings[0]?.creationDate?.value;

        city.description = description;
        city.history = history;
        city.population = population;
        city.creationDate = creationDate;

        res.json(city);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати дані про місто' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
