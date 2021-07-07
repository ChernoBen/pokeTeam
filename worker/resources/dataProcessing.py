#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jul  6 12:39:30 2021

@author: fang
"""

import pandas as pd
import requests
import json


names = requests.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
names = json.loads(names.content)
names = [name["name"] for name in names["results"]]
data =[]
for item in names:
    poke = requests.get(f"https://pokeapi.co/api/v2/pokemon/{item}")
    poke= json.loads(poke.content)
    data.append(poke)
pokeSet = []
for item in data:
    pokeSet.append({
        "name":item["name"],
        "attributes":[tp["type"]["name"] for tp in item["types"]]
        })
df = pd.DataFrame(pokeSet)
df.to_csv('pokemons.csv')
