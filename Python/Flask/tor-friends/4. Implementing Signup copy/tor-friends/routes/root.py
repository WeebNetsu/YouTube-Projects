from flask import Blueprint, request, flash, render_template, redirect, url_for # added redirect and url for
from datetime import datetime # added datetime

from ..auxillary import *
from ..databases.db import db # import db
from ..databases.Users_db import * # import users db layout

root_page = Blueprint(
    "root", __name__, static_folder=f"{get_root()}static", template_folder=f"{get_root()}templates/root")

@root_page.route("/", methods=["GET", "POST"]) # index page can now handle post requests
def index():
    # NOTE: Index page wll handle login
    return "<h1>Hello World</h1>"

@root_page.route("/signup/")
def signup():
    if request.args.get('usernameexist'):
        flash("Username already exists.", "error")

    return render_template("login.html", no_nav=True, signup=True)


@root_page.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":  # if they logged in
        username = request.form["uname"] # get username/passwd from form
        password = request.form["pwd"] # get username/passwd from form

        try:
            # this also checks if the user exists, we get an index error if they dont
            Users.query.filter_by(username=username).all()[
                0]  # [0] so we don't get a list returned
        except IndexError:  # if user does not exist
            # NOTE: Login also handles signup process
            # insert data into database
            new_user = Users(username=username,
                             password=encrypt_string(password), date_accessed=datetime.today())
            db.session.add(new_user)  # adds content to database
            db.session.commit()  # save all changes to database

            flash("Account has been created! Log in to get started.", "info")
        else:  # if user exists then:
            return redirect(url_for("root.signup", usernameexist=True))

    if request.args.get('auth') == "fail":
        flash("Username or password is incorrect", "error")

    if request.args.get('acc_deleted'):
        flash("Account removal successful.", "info")

    return render_template("login.html", no_nav=True)
