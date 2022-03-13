from flask import Blueprint, request, session, redirect, url_for, flash, render_template

from ..auxillary import *

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
