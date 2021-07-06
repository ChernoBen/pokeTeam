#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jul  6 13:05:41 2021

@author: fang
"""

import pandas as pd

pokeSet = pd.read_csv("dataSets/pokemons.csv")
sets = pokeSet[["name","attributes"]]
data = sets.to_dict("records")
for item in data:
    print(item['attributes'])