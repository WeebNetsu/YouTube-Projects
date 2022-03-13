from flask import (
    Blueprint,
    request,
    flash,
    render_template,
    redirect,
    url_for,
    json,
    session,
    make_response,
)  # added session, make_response
from datetime import datetime
from collections import OrderedDict

from ..auxillary import *
from ..databases.db import db
from ..databases.Users_db import *

root_page = Blueprint(
    "root",
    __name__,
    static_folder=f"{get_root()}static",
    template_folder=f"{get_root()}templates/root",
)


@root_page.route("/", methods=["GET", "POST"])
def index():
    # we can now read the torrents from the file itself!
    torrents = read_json_file("torrents")

    rev_torrents = reverse_dict(torrents)

    if request.method == "POST":  # if they are logging in
        username = request.form["uname"]
        password = request.form["pwd"]

        try:
            # this also checks if the user exists, we get an index error if they dont
            user = Users.query.filter_by(username=username).all()[
                0
            ]  # [0] so we don't get a list returned
        except IndexError:
            return redirect(url_for("root.login", auth="fail"))

        # since we do one-way encrytption, we need to use auxillaries
        # new function to verify user password
        if verify_encrypted_string(user.password, password):
            session["id"] = user.id
            session["username"] = user.username
            if user.mod_:
                session["mod"] = user.mod_

            # update last login field in db (function can be found
            # inside Users_db.py file)
            update_user_db_field(user.username, datetime.today(), "date_accessed")

            return render_template(
                "index.html",
                torrents=rev_torrents,
                session=[session],
                rsc=remove_special_characters,
            )
        else:
            return redirect(url_for("root.login", auth="fail"))

    # incase user is a guest and not loged in
    if not "id" in session:  # if they didn't log in and is not logged in
        guest_sign_in()

    if request.args.get("deleted"):
        flash("Torrent Deleted.", "info")

    if request.args.get("guest"):
        flash("Only logged in users can use that feature.", "info")

    if request.args.get("torrent_added"):
        flash("Hoorah! Torrent has been added!", "info")

    if request.args.get("torrent_modified"):
        flash("Torrent has been modified!", "info")

    if request.args.get("notmod"):
        flash("Only mods may use that feature.", "warning")

    # we add our session data in here now
    return render_template(
        "index.html",
        torrents=rev_torrents,
        rsc=remove_special_characters,
        session=[session],
    )


# we can now go to the rules page
@root_page.route("/rules/")
def rules():
    if not "id" in session:
        guest_sign_in()

    return render_template("rules.html", session=[session])


@root_page.route("/signup/")
def signup():
    if request.args.get("usernameexist"):
        flash("Username already exists.", "error")

    return render_template("login.html", no_nav=True, signup=True)


@root_page.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["uname"]
        password = request.form["pwd"]

        try:
            Users.query.filter_by(username=username).all()[0]
        except IndexError:
            new_user = Users(
                username=username,
                password=encrypt_string(password),
                date_accessed=datetime.today(),
            )
            db.session.add(new_user)
            db.session.commit()

            flash("Account has been created! Log in to get started.", "info")
        else:
            return redirect(url_for("root.signup", usernameexist=True))

    if request.args.get("auth") == "fail":
        flash("Username or password is incorrect", "error")

    if request.args.get("acc_deleted"):
        flash("Account removal successful.", "info")

    return render_template("login.html", no_nav=True)


@root_page.route("/logout/")
def logout():
    session.pop("id", None)
    session.pop("mod", None)
    session.pop("username", None)
    session.pop("guest", None)

    if request.args.get("acc_deleted"):
        return redirect(url_for("root.login", acc_deleted=True))

    return redirect(url_for("root.login"))
