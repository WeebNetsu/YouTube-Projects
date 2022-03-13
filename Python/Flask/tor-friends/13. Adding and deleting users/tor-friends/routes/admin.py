from flask import (
    Blueprint,
    session,
    redirect,
    url_for,
    render_template,
    request,
)  # new imports
from datetime import datetime  # new import

from ..auxillary import *
from ..databases.db import db  # add db
from ..databases.Users_db import *  # add users

torrents = read_json_file("torrents")  # add torrents

admin_page = Blueprint(
    "admin",
    __name__,
    static_folder=f"{get_root()}static",
    template_folder=f"{get_root()}templates/admin",
)


@admin_page.route("/")
def admin():
    if "id" in session and "mod" in session and not "guest" in session:
        return render_template("admin.html", session=[session])

    return redirect(url_for("root.index", notmod=True))


# new routes
@admin_page.route("/user/delete")
def delete_user():
    if "id" in session and "mod" in session and not "guest" in session:
        if request.args.get("notfound"):
            flash("User not found.", "error")

        if request.args.get("userdeleted"):
            flash("User successfully deleted.", "info")

        if request.args.get("ismod"):
            flash("Cannot remove other mods.", "warning")

        if request.args.get("wrongpass"):
            flash("Password is incorrect.", "error")

        return render_template("delete_user.html", session=[session])
    return redirect(url_for("root.index", notmod=True))


@admin_page.route("/user/deleted/", methods=["GET", "POST"])
def remove_user():
    if "id" in session and "mod" in session and not "guest" in session:
        if request.method == "POST":  # if they logged in
            username = request.form["username"]
            admin_password = request.form["admin_password"]

            admin = Users.query.filter_by(username=session["username"]).all()[0]
            if not verify_encrypted_string(admin.password, admin_password):
                return redirect(url_for("admin.delete_user", wrongpass=True))

            try:
                user = Users.query.filter_by(username=username).all()[0]
            except IndexError:  # if user not found
                return redirect(url_for("admin.delete_user", notfound=True))
            else:
                if user.mod_:
                    # if the user we want to delete is a moderator
                    # then we should be an admin
                    if not admin.admin_:
                        return redirect(url_for("admin.delete_user", ismod=True))

                # remove all user torrents
                x = []
                for key, val in torrents.items():
                    if val["user"] == user.username:
                        x.append(key)

                for key in x:
                    torrents.pop(str(key))

                # we already know the user exists, so no "or_404" needed
                user = Users.query.get(user.id)
                db.session.delete(user)
                db.session.commit()

                write_torrent_json(torrents)
                return redirect(url_for("admin.delete_user", userdeleted=True))

    return redirect(url_for("root.index", notmod=True))


@admin_page.route("/user/add")
def add_user():
    if "id" in session and "mod" in session and not "guest" in session:
        if request.args.get("added"):
            flash("Successfully added user.", "info")

        if request.args.get("usernameexist"):
            flash("Username already exists.", "error")

        return render_template("add_user.html", session=[session])
    return redirect(url_for("root.index", notmod=True))


@admin_page.route("/user/added/", methods=["GET", "POST"])
def create_user():
    if "id" in session and "mod" in session and not "guest" in session:
        if request.method == "POST":  # if they logged in
            username = request.form["username"]
            password = request.form["password"]
            # if there is at least 1 value in it, they're a mod
            is_mod = 0
            if len(request.form.getlist("is_mod")) == 1:
                is_mod = 1

            try:
                # this also checks if the user exists, we get an index error if they dont
                user = Users.query.filter_by(username=username).all()[
                    0
                ]  # [0] so we don't get a list returned
            except IndexError:  # if user does not exist
                # insert data into database
                new_user = Users(
                    username=username,
                    password=encrypt_string(password),
                    mod_=is_mod,
                    date_accessed=datetime.today(),
                )
                db.session.add(new_user)  # adds content to database
                db.session.commit()  # save all changes to database

                return redirect(url_for("admin.add_user", added=True))
            else:  # if user exists then:
                return redirect(url_for("admin.add_user", usernameexist=True))

    return redirect(url_for("root.index", notmod=True))
