from flask import Flask
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
from flask_cors import CORS
import requests
import json
from pokeTypes import types

app = Flask(__name__)
CORS(app)
app.config['MONGO_DBNAME'] = 'test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/test'
mongo = PyMongo(app)

@app.route('/worker', methods=['GET'])
def verify():
    pokeWeb = requests.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
    webContent = json.loads(pokeWeb.content)
    content = webContent
    webContent = len(webContent["results"])
    pokemon = mongo.db.pokemons
    pokemonTypes = mongo.db.counters
    results = pokemon.find()
    newContent = ""
    arr = []
    arr2 = []
    if (webContent-1) > results.count():
        newContent = content["results"][results.count():]
        for element in newContent:
            res = requests.get(f"https://pokeapi.co/api/v2/pokemon/{element['name']}")
            arr.append(json.loads(res.content))
        for item in arr:
            name = item["name"]
            attributes = [att["type"]["name"] for att in item["types"]]
            arr2.append(
                {
                    "name":name,
                    "attributes":attributes
                }
            )
        for instance in arr2:
            pokemon.insert_one({
            "name":instance["name"],
            "attributes":instance["attributes"]
            })
        for tp in types:
            pokemonTypes.insert_one(tp)  
    return jsonify({
        "web-count":webContent,
        "local-count":results.count(),
        "tipos":types
        })

if __name__ == '__main__':
    print("running...")
    app.run(debug=True,port=5000)
