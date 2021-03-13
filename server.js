const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];
const POKEDEX = require('./pokedex.json')

// ----------------------------------------
// middleware
// ----------------------------------------
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

// ----------------------------------------
// routes
// ----------------------------------------
app.get('/types', handleGetTypes);
app.get('/pokemon', handleGetPokemon);

// ----------------------------------------
// middleware & route functionality
// ----------------------------------------
function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: "unauthorized request" });
  }
  next();
}

function handleGetTypes(req, res) {
  res.json(validTypes);
}

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  if (req.query.name) {
    response = response.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    })
  }

  if (req.query.type) {
    response = response.filter(pokemon => {
      return pokemon.type.includes(req.query.type)
    })
  }

  // console.log(response);
  res.json(response);
}

app.listen(PORT, () => {
  console.log(`The app is running at http://localhost:${PORT}`);
});