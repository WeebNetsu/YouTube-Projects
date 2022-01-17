from flask import Flask

import json

from .routes.root import root_page # imported this blueprint

app = Flask(__name__)
test_env = True

with app.open_resource("static/json/config.json", 'r') as json_data:
    config_data = json.load(json_data)
    if test_env:
        app.secret_key = 'testing_key'
        print("\t\tUsing Testing Environment")

app.url_map.strict_slashes = False

app.register_blueprint(root_page, url_prefix="/") # applied blueprint

# removed hello and moved into above blueprint