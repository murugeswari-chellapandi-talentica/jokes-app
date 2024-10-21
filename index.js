const express = require('express');
const LimitingMiddleware = require('limiting-middleware');
const { types, randomJoke, randomTen, randomSelect, jokeByType, jokeById, count, jokeByCategory, addJoke, addRating } = require('./handler');
const app = express();
const cors = require('cors');

app.use(new LimitingMiddleware().limitByIp());

// Configure CORS options
const corsOptions = {
  origin: '*', // Adjust this to specify which origins can access your API
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/<any-number>');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/random_joke', (req, res) => {
  res.json(randomJoke());
});

app.get('/random_ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/random', (req, res) => {
  res.json(randomJoke());
});

app.get("/jokes/random/:num", (req, res) => {
  let num;
  try {
    num = parseInt(req.params.num);
    if (!num) {
      res.send("The passed path is not a number.");
    } else {
      if (num > count) {
        res.send(`The passed path exceeds the number of jokes (${count}).`);
      } else {
        res.json(randomSelect(num));
      }
    }
  } catch (e) {
    return next(e);
  } 
});

app.get('/jokes/ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/:type/random', (req, res) => {
  res.json(jokeByType(req.params.type, 1));
});

app.get('/jokes/:type/ten', (req, res) => {
  res.json(jokeByType(req.params.type, 10));
});

app.get('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

app.get('/types', (req, res, next) => {
  res.json(types);
})

app.get('/jokes/:category/:skip/:count', (req, res, next) => {
  res.json(jokeByCategory(req.params));
})

app.use(express.json())
app.post("/addJoke", (req, res, next) =>{
  try{
    const response = addJoke(req.body)
    if(response?.status === 'success')
      res.json(response)
    else  throw new Error("error");
  }
  catch(error){
    return next({
      status: "error",
      message: "There was an error in adding the joke",
      joke: {}
    })
  }
})

app.post("/addRating", (req, res, next) =>{
  try {
    const response = addRating(req.body)
    if(response?.status === 'success')
      res.json(response)
    else  throw new Error("error");
  }
  catch(error){
    return next({
      status: "error",
      message: "There was an error. Please try again!",
      joke: {}
    })
  }
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

