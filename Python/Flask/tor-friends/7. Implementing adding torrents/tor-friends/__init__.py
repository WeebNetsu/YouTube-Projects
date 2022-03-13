from flask import Flask

import json

from .databases.db import db

from .routes.root import root_page
from .routes.torrent import torrent_page # get our torrent page data

app = Flask(__name__)
test_env = True

with app.open_resource("static/json/config.json", 'r') as json_data:
    config_data = json.load(json_data)
    if test_env:
        app.secret_key = 'testing_key'
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/users.db"
        print("\t\tUsing Testing Environment")
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = config_data["database"]

app.url_map.strict_slashes = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(root_page, url_prefix="/")
# set default torrent url prefix
app.register_blueprint(torrent_page, url_prefix="/torrent")