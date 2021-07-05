from flask import Flask
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
import requests
import json

app = Flask(__name__)

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
    results = pokemon.find()
    newContent = ""
    if (webContent-1) > results.count():
        newContent = content["results"][results.count():]
        for element in newContent:
            pokemon.insert_one({
            "name":element["name"],
            "ref":element["url"]
            })    

    return jsonify({
        "web-count":webContent,
        "local-count":results.count(),
        })


if __name__ == '__main__':
    app.run(debug=True)
