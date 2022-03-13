from flask import Blueprint, request, session, redirect, url_for, render_template

from ..auxillary import *

torrents = read_json_file("torrents")  # read torrents file

torrent_page = Blueprint(
    "torrent",
    __name__,
    static_folder=f"{get_root()}static",
    template_folder=f"{get_root()}templates/torrent",
)


@torrent_page.route("/")
def torrent():
    if "id" in session and not "guest" in session:
        return render_template("torrent-mod.html", add_torrent=True, session=[session])
    return redirect(url_for("root.index", guest=True))


@torrent_page.route("/add/", methods=["GET", "POST"])
def add_torrent():
    if "id" in session and not "guest" in session:
        if request.method == "POST":
            print(session["username"])
            try:
                torrents[str(int(list(torrents.keys())[-1]) + 1)] = {
                    "full_name": request.form["full-name"],
                    "name": request.form["display-name"],
                    "magnet": request.form["magnet"],
                    "size": request.form["file-size"],
                    "size_type": request.form["file-size-type"],
                    "type": request.form["file-type"],
                    "minor_type": request.form["file-type-minor"],
                    "desc": request.form["desc"],
                    "user": session["username"],
                }
            except IndexError:  # if torrent file is empty
                torrents["1"] = {
                    "full_name": request.form["full-name"],
                    "name": request.form["display-name"],
                    "magnet": request.form["magnet"],
                    "size": request.form["file-size"],
                    "size_type": request.form["file-size-type"],
                    "type": request.form["file-type"],
                    "minor_type": request.form["file-type-minor"],
                    "desc": request.form["desc"],
                    "user": session["username"],
                }

            write_torrent_json(
                torrents
            )  # will create file if it does not already exist

            return redirect(url_for("root.index", torrent_added=True))

        # if not post request, return torrent index page
        return redirect(url_for("torrent.torrent"))
    # if not signed in, return to home page
    return redirect(url_for("root.index", guest=True))


@torrent_page.route("/<int:tor_id>/")
def torrent_editing(tor_id):
    if "id" in session and not "guest" in session:
        return render_template(
            "torrent-mod.html",
            data=torrents[str(tor_id)],
            tor_id=tor_id,
            session=[session],
        )
    return redirect(url_for("root.index", guest=True))


@torrent_page.route("/edit/<int:tor_id>/", methods=["GET", "POST"])
def edit_torrent(tor_id):
    # should be signed in and not as a guest
    if "id" in session and not "guest" in session:
        if request.method == "POST":
            user = torrents[str(tor_id)]["user"]

            torrents.pop(str(tor_id))

            try:
                # if there was only 1 torrent, then this would cause
                # an error
                torrent_index = str(int(list(torrents.keys())[-1]) + 1)
            except IndexError:
                torrent_index = "1"

            torrents[torrent_index] = {
                "full_name": request.form["full-name"],
                "name": request.form["display-name"],
                "magnet": request.form["magnet"],
                "size": request.form["file-size"],
                "size_type": request.form["file-size-type"],
                "type": request.form["file-type"],
                "minor_type": request.form["file-type-minor"],
                "desc": request.form["desc"],
                "user": user,
            }

            write_torrent_json(torrents)

            return redirect(url_for("root.index", torrent_modified=True))
        return redirect(url_for("torrent.torrent"))
    return redirect(url_for("root.index", guest=True))


# new routes
@torrent_page.route("/del/<int:tor_id>/")
def confirm_delete(tor_id):
    # custom confirm page to allow user to confirm torrent delete
    if "id" in session and not "guest" in session:
        return render_template("confirm.html", tor_id=tor_id)
    return redirect(url_for("root.index", guest=True))


@torrent_page.route("/del/<int:tor_id>/confirmed", methods=["GET", "POST"])
def torrent_deleting(tor_id):
    # once user confirmed, delete torrent
    if "id" in session and not "guest" in session:
        if torrents[str(tor_id)]["user"] == session["username"] or session["mod"]:
            torrents.pop(str(tor_id))

            write_torrent_json(torrents)

            return redirect(url_for("root.index", deleted=True))
        return redirect(url_for("root.index"))
    return redirect(url_for("root.index", guest=True))
