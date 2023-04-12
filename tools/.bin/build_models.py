import json
import requests
import os
import shutil
import argparse
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
import tensorflowjs as tfjs

GITHUB_API_URL = "https://api.github.com"
SCRIPT_PATH = os.path.dirname(__file__)
CACHE_PATH = f"{SCRIPT_PATH}/.cache"
DOWNLOAD_PATH = f"{CACHE_PATH}/download"
BUILD_PATH = f"{SCRIPT_PATH}/../../public/models"

model_config_file = open(SCRIPT_PATH + "/../../src/assets/models.json","r")
model_config = json.load(model_config_file)

model_assets = {}

parser = argparse.ArgumentParser()
parser.add_argument("--clean", help="clean cache and builds",
                    action="store_true")
args = parser.parse_args()

def getAssetsList(owner, repo, tag):
  releaseUrl = GITHUB_API_URL + f'/repos/{owner}/{repo}/releases/tags/{tag}'
  response = requests.get(releaseUrl)

  if response.status_code != 200:
    print("Response status: " + response.status_code)
    return []

  response = response.json()
  return response['assets']

def initialize_assets_list():
  for model_name in model_config:
    model = model_config[model_name]
    owner = model['owner']
    repo = model['repo']
    tag = model['tag']
    model_assets[model_name] = getAssetsList(owner, repo, tag)

def download_assets(model):
  model = model_config[model_name]
  tag = model['tag']

  assets_download_path = f"{DOWNLOAD_PATH}/{model_name}/{tag}/"

  if os.path.exists(assets_download_path):
    print(f"{model_name}/{tag} will be loaded from cache")
    return

  os.makedirs(os.path.dirname(assets_download_path), exist_ok=True)
  assetsList = model_assets[model_name]
  for asset in assetsList:
    print(f"Downloading {asset['name']} from {model_name}...")
    downloaded_asset = requests.get(asset['browser_download_url'])
    output_file_path = os.path.join(assets_download_path, asset['name'])
    with open(output_file_path, "wb") as output_file:
      output_file.truncate(0)
      output_file.write(downloaded_asset.content)

def build_models(model):
  tag = model['tag']

  assets_path = f"{DOWNLOAD_PATH}/{model_name}/{tag}/"
  for asset in model_assets[model_name]:
    asset_name = asset['name']
    filepath = os.path.join(assets_path, asset_name)

    keras_model = tf.keras.models.load_model(filepath)

    outputdir = os.path.join(BUILD_PATH, f"{model_name}/{asset_name}")
    os.makedirs(outputdir, exist_ok=True)

    print(f"Building {asset_name}");
    tfjs.converters.save_keras_model(keras_model, outputdir)

def clean_cache():
  shutil.rmtree(CACHE_PATH, ignore_errors=True)

def clean_build():
  shutil.rmtree(BUILD_PATH, ignore_errors=True)

if args.clean:
  clean_cache()
  clean_build()
else:
  initialize_assets_list()
  for model_name in model_config:
    model = model_config[model_name]
    download_assets(model)
    build_models(model)
