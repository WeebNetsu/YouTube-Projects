from flask import Blueprint, request, flash, render_template, redirect, url_for, json # added json
from datetime import datetime
from collections import OrderedDict # importing orderdDict

from ..auxillary import *
from ..databases.db import db
from ..databases.Users_db import *

root_page = Blueprint(
    "root", __name__, static_folder=f"{get_root()}static", template_folder=f"{get_root()}templates/root")

@root_page.route("/", methods=["GET", "POST"])
def index():
    # set dummy torrent data
    torrents = OrderedDict(
        json.loads(
            """{
                "1": {
                    "full_name": "Linux Mint 20.3 FULL ISO FREE",
                    "name": "Linux Mint 20.3",
                    "magnet": "magnet:?sdasdasdas",
                    "size": "2",
                    "size_type": "GB",
                    "type": "Other",
                    "minor_type": "None",
                    "desc": "This is just pure Linux Mint",
                    "user": "jack"
                },
                "2": {
                    "full_name": "Spider-Man The Hardcore Epic Monster Game! PS1",
                    "name": "Spider-Man: The Epic Monster",
                    "magnet": "magnet:?sdaaaaasdaasdsdas",
                    "size": "500",
                    "size_type": "MB",
                    "type": "Game",
                    "minor_type": "Windows",
                    "desc": "A spider man game for PS1",
                    "user": "nickBRUH232"
                }
            }"""
        )
    )
    rev_torrents = reverse_dict(torrents) # so the newiest torrent is first

    if request.args.get('deleted'):
        flash("Torrent Deleted.", "info")

    if request.args.get('guest'):
        flash("Only logged in users can use that feature.", "info")

    if request.args.get('torrent_added'):
        flash("Hoorah! Torrent has been added!", "info")

    if request.args.get('torrent_modified'):
        flash("Torrent has been modified!", "info")

    if request.args.get('notmod'):
        flash("Only mods may use that feature.", "warning")

    return render_template("index.html", torrents=rev_torrents, rsc=remove_special_characters)

@root_page.route("/signup/")
def signup():
    if request.args.get('usernameexist'):
        flash("Username already exists.", "error")

    return render_template("login.html", no_nav=True, signup=True)


@root_page.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["uname"]
        password = request.form["pwd"]

        try:
            Users.query.filter_by(username=username).all()[
                0]
        except IndexError:
            new_user = Users(username=username,
                             password=encrypt_string(password), date_accessed=datetime.today())
            db.session.add(new_user)
            db.session.commit()

            flash("Account has been created! Log in to get started.", "info")
        else:
            return redirect(url_for("root.signup", usernameexist=True))

    if request.args.get('auth') == "fail":
        flash("Username or password is incorrect", "error")

    if request.args.get('acc_deleted'):
        flash("Account removal successful.", "info")

    return render_template("login.html", no_nav=True)
