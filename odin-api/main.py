import os
import json

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from OSMPythonTools.api import Api as OSMApi
from OSMPythonTools.nominatim import Nominatim
from OSMPythonTools.overpass import overpassQueryBuilder, Overpass


app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return "ODIN-API NOT FOUND"

@app.get("/SAR_image", responses={200: {"description": "SAR constellation  image."}})
def SAR_image():
    file_path = "SAR_image_20420212.png"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    return {"error": "File not found!"}

@app.get("/SAR_image_coordinates", responses={200: {"description": "Coordinates for the SAR constellation image."}})
def SAR_image_coordinates():
    coordinates_file = open('SAR_image_coordinates.json')
    coordinates_data = json.load(coordinates_file)
    return coordinates_data

@app.get("/lighthouse_locations",  responses={200: {"description": "Coordinates of the lighthouses"}})
def lighthouse_locations():
    ## Getting data directly from OSM was failing because of unverifiable certificates. Even disabling cert verification failed
    # nominatim = Nominatim()
    # turkuAreaId = nominatim.query('Varsinais-Suomi').areaId()
    # print(turkuAreaId)
    # overpass = Overpass()
    # query = overpassQueryBuilder(area=areaId, elementType='node', selector='"natural"="tree"', out='count')
    # result = overpass.query(query)        

    file_path = "southwest_finland_lighthouses.geojson"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/json")
    return {"error": "File not found!"}