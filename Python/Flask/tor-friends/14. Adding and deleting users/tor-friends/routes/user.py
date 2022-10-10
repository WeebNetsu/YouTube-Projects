from flask import Blueprint, request, session, redirect, url_for, flash, render_template

from ..auxillary import *
from ..databases.db import db  # new import
from ..databases.Users_db import *  # new import

torrents = read_json_file("torrents")

user_page = Blueprint(
    "user",
    __name__,
    static_folder=f"{get_root()}static",
    template_folder=f"{get_root()}templates/user",
)


@user_page.route("/")
def user():
    if "id" in session and not "guest" in session:
        if request.args.get("passchanged"):
            flash("Password changed successfully.", "info")

        if request.args.get("notdeleted"):
            flash("Error deleting account. Refresh the page and try again.", "error")

        if request.args.get("username_changed"):
            flash("Username was changed.", "info")

        return render_template(
            "user.html",
            session=[session],
            torrents=torrents,
            rsc=remove_special_characters,
        )
    return redirect(url_for("root.index", guest=True))


# new routes
@user_page.route("/self/delete/")
def user_self_delete():
    if "id" in session and not "guest" in session:
        try:
            user = Users.query.filter_by(username=session["username"]).all()[0]
        except IndexError:  # if user not found
            return redirect(url_for("user.user", notdeleted=True))
        else:
            # remove all user torrents
            x = []
            for key, val in torrents.items():
                if val["user"] == user.username:
                    x.append(key)

            for key in x:
                torrents.pop(str(key))

            write_torrent_json(torrents)

            # we already know the user exists, so no "or_404" needed
            user = Users.query.get(user.id)
            db.session.delete(user)
            db.session.commit()

            return redirect(url_for("root.logout", acc_deleted=True))

    return redirect(url_for("root.index", guest=True))


@user_page.route("/edit/username/")
def edit_username():
    if "id" in session and not "guest" in session:
        if request.args.get("found"):
            flash("Username already exists.", "error")

        if request.args.get("passed"):
            flash("Password is incorrect.", "error")

        return render_template("edit_user.html", session=[session], edit_username=True)
    return redirect(url_for("root.index", guest=True))


@user_page.route("/edit/username/change/", methods=["GET", "POST"])
def change_username():
    if "id" in session and not "guest" in session:
        if request.method == "POST":
            username = request.form["username"]
            password = request.form["password"]
            name = Users.query.filter_by(username=username).all()

            if name:  # username already exists
                return redirect(url_for("user.edit_username", found=True))

            user = Users.query.get_or_404(session["id"])
            if verify_encrypted_string(user.password, password):
                # user.username = username
                # db.session.commit()  # save all changes to database
                update_user_db_field(user.username, username)
            else:
                return redirect(url_for("user.edit_username", passed=True))

            for key, val in torrents.items():
                if val["user"] == session["username"]:
                    val["user"] = username

            write_torrent_json(torrents)

            session["username"] = username

        return redirect(url_for("user.user", username_changed=True))
    return redirect(url_for("root.index", guest=True))


@user_page.route("/edit/password/")
def edit_password():
    if "id" in session and not "guest" in session:
        if request.args.get("passed"):
            flash("Password is incorrect.", "error")

        if request.args.get("cpass"):
            flash("Passwords do not match.", "warning")

        return render_template("edit_user.html", session=[session])
    return redirect(url_for("root.index", guest=True))


@user_page.route("/edit/password/change/", methods=["GET", "POST"])
def change_password():
    if "id" in session and not "guest" in session:
        if request.method == "POST":
            new_password = request.form["password"]
            con_password = request.form["password_confirm"]
            old_password = request.form["old_password"]

            if not new_password == con_password:
                return redirect(url_for("user.edit_password", cpass=True))

            user = Users.query.get_or_404(session["id"])
            if verify_encrypted_string(user.password, old_password):
                # user.password = encrypt_string(new_password)
                # db.session.commit()  # save all changes to database
                update_user_db_field(
                    user.username, encrypt_string(new_password), "password"
                )
            else:
                return redirect(url_for("user.edit_password", passed=True))

            return redirect(url_for("user.user", passchanged=True))
        return redirect(url_for("user.user"))
    return redirect(url_for("root.index", guest=True))
