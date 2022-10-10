from flask import Flask

from .databases.db import db

from .routes.root import root_page
from .routes.torrent import torrent_page  # get our torrent page data
from .routes.user import user_page

app = Flask(__name__)
test_env = True

if test_env:
    app.secret_key = "testing_key"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/users.db"
    print("\t\tUsing Testing Environment")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(root_page, url_prefix="/")
# set default torrent url prefix
app.register_blueprint(torrent_page, url_prefix="/torrent")
app.register_blueprint(user_page, url_prefix="/user")
