from flask import Blueprint, request, flash, render_template

from ..auxillary import *

root_page = Blueprint(
    "root",
    __name__,
    static_folder=f"{get_root()}static",
    template_folder=f"{get_root()}templates/root",
)


@root_page.route("/")
def index():
    return "<h1>Hello World</h1"


@root_page.route("/signup/")
def signup():
    if request.args.get("usernameexist"):
        flash("Username already exists.", "error")

    return render_template("login.html", no_nav=True, signup=True)


@root_page.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":  # if they logged in
        flash("Account has been created! Log in to get started.", "info")

    if request.args.get("auth") == "fail":
        flash("Username or password is incorrect", "error")

    if request.args.get("acc_deleted"):
        flash("Account removal successful.", "info")

    return render_template("login.html", no_nav=True)
