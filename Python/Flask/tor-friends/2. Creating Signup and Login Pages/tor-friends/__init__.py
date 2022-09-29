from flask import Flask

from .routes.root import root_page  # imported this blueprint

app = Flask(__name__)
test_env = True

if test_env:
    app.secret_key = "testing_key"
    print("\t\tUsing Testing Environment")

# we removed the url strict stuff, since my understanding was wrong
# it actually does the oppisite of what we want, it makes it strict!

app.register_blueprint(root_page, url_prefix="/")  # applied blueprint

# removed hello and moved into above blueprint
