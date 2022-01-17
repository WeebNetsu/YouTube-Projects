from flask import Flask

import json

app = Flask(__name__)
test_env = True  # if i'm using a test environment

with app.open_resource("static/json/config.json", 'r') as json_data:
    config_data = json.load(json_data)
    if test_env:
        app.secret_key = 'testing_key'
        print("\t\tUsing Testing Environment")

app.url_map.strict_slashes = False  # doesn't force a "/" at the end of a link

@app.route("/")
def hello():
    return "<h1>Hello World</h1"