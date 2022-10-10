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


# new route
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
