from flask import Flask

from .databases.db import db

from .routes.root import root_page
from .routes.torrent import torrent_page
from .routes.user import user_page
from .routes.admin import admin_page  # add admin page

app = Flask(__name__)
test_env = True

if test_env:
    app.secret_key = "testing_key"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/users.db"
    print("\t\tUsing Testing Environment")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(root_page, url_prefix="/")
app.register_blueprint(torrent_page, url_prefix="/torrent")
app.register_blueprint(user_page, url_prefix="/user")
app.register_blueprint(admin_page, url_prefix="/admin")  # add admin
