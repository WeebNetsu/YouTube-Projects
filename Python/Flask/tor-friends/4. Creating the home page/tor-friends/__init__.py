from flask import Flask

import json

from .databases.db import db # import our db

from .routes.root import root_page

app = Flask(__name__)
test_env = True

with app.open_resource("static/json/config.json", 'r') as json_data:
    config_data = json.load(json_data)
    if test_env:
        app.secret_key = 'testing_key'
        # database location added
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/users.db"
        print("\t\tUsing Testing Environment")
    else:
        # if not a test env, they can specifu database location in config file
        app.config["SQLALCHEMY_DATABASE_URI"] = config_data["database"]

app.url_map.strict_slashes = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # don't track modifications

db.init_app(app) # initialize the db with the flask app

app.register_blueprint(root_page, url_prefix="/")