export const ApiList = [
    {
        "label": "Grab a random joke",
        "list": [
            "https://official-joke-api.appspot.com/random_joke",
            "https://official-joke-api.appspot.com/jokes/random"
        ],
        "id": "1",
        "clickable": true
    },
    {
        "label": "Get joke types",
        "list": ["https://official-joke-api.appspot.com/types"],
        "id": "2",
        "clickable": true
    },
    {
        "label": "Grab ten random jokes",
        "list": ["https://official-joke-api.appspot.com/random_ten", "https://official-joke-api.appspot.com/jokes/ten"],
        "id": "3",
        "clickable": true
    },
    {
        "label": "Grab any number of random jokes",
        "list": ["Usage: https://official-joke-api.appspot.com/jokes/random/<any-number>"],
        "id": "4",
        "clickable": false
    },
    {
        "label": "For example:",
        "list": ["https://official-joke-api.appspot.com/jokes/random/5", "https://official-joke-api.appspot.com/jokes/random/25","https://official-joke-api.appspot.com/jokes/random/250"],
        "id": "5",
        "clickable": true
    },
    {
        "label": "Grab joke by id",
        "list": ["Use endpoint /jokes/:id"],
        "id": "6",
        "clickable": false
    },
]

export const TypeAPIList = [
    {
        "label": "Grab jokes by type",
        "list": ["The endpoints are jokes/:type/random or jokes/:type/ten"],
        "id": "1",
        "clickable": false
    },
    {
        "label": "For example:",
        "list": ["https://official-joke-api.appspot.com/jokes/programming/random", "https://official-joke-api.appspot.com/jokes/programming/ten"],
        "id": "2",
        "clickable": true
    }
]