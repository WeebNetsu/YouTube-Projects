from flask import Flask

from .databases.db import db  # import our db

from .routes.root import root_page

app = Flask(__name__)
test_env = True

if test_env:
    app.secret_key = "testing_key"
    # database location added
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/users.db"
    print("\t\tUsing Testing Environment")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # don't track modifications

db.init_app(app)  # initialize the db with the flask app

app.register_blueprint(root_page, url_prefix="/")

"""
Creating the databse:
with app.app_context():
    db.create_all()

In Shell:
from __init__ import db, Users
"""
