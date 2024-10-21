let jokes = []
let types = []
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let lastJokeId = 0;
const updateJoke = ()=>{
  jokes = require('./jokes/index.json');
  types = Array.from(new Set(jokes.map(joke => joke.type)));
}

updateJoke();

const randomJoke = () => {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray, n) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map(randomIndex => {
    return jokeArray[randomIndex];
  });
};

const randomTen = () => randomN(jokes, 10);

const randomSelect = (number) => randomN(jokes, number);

const jokeByType = (type, n) => {
  return randomN(jokes.filter(joke => joke.type === type), n);
};

const count = Object.keys(jokes).length;

/** 
 * @param {Number} id - joke id
 * @returns a single joke object or undefined
 */
const jokeById = (id) => (jokes.filter(jk => jk.id === id)[0]);

const jokeByCategory = ({category, skip, count}) => {
  let endLimit = parseInt(skip)+parseInt(count)
  const filteredJokes = jokes.filter(joke => joke.type === category)
  endLimit = endLimit > filteredJokes.length ? filteredJokes.length : endLimit
  return filteredJokes.reverse().slice(parseInt(skip), endLimit)
}

const addJoke = (joke) => {
  const allJokes = require('./jokes/index.json');
  let jokesList = [...allJokes];
  const jokeObj = {
    ...joke,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    rating: 0,
    ratedBy: 0
  }
  jokesList.push(jokeObj)
  // todo: I need to update this read method to async
  fs.writeFileSync('./jokes/index.json', JSON.stringify(jokesList, null, 2));
  updateJoke();
  return {
    status: "success",
    message: "Joke added successfully!",
    joke: jokeObj
  }
}

const addRating  = ({id, rating}) =>{
  let jokeObj = jokeById(id);
  const updatedRatedBy = jokeObj.ratedBy+1
  let updatedRating = ((jokeObj.totalRating + rating) / updatedRatedBy);
  updatedRating = Number.isInteger(updatedRating) ? updatedRating : updatedRating.toFixed(1)
  jokeObj = {
    ...jokeObj,
    totalRating: jokeObj.totalRating + rating,
    rating: updatedRating,
    ratedBy: updatedRatedBy
  }
  let jokeIndex = jokes.findIndex(item => item.id === id)
  jokes[jokeIndex] = jokeObj;
  // todo: I need to update this read method to async
  fs.writeFileSync('./jokes/index.json', JSON.stringify(jokes, null, 2));
  updateJoke();
  return {
    status: "success",
    message: "Joke rated successfully!",
    joke: jokeObj
  }
}

module.exports = { jokes, types, randomJoke, randomN, randomTen, randomSelect, jokeById, jokeByType, count, jokeByCategory, addJoke, addRating };
