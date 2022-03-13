from flask import Blueprint, session, redirect, url_for, render_template

from ..auxillary import *

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
