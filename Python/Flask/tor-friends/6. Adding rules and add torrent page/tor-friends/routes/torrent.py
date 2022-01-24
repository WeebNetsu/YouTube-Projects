from flask import Blueprint, request, session, redirect, url_for, render_template

from ..auxillary import *

torrent_page = Blueprint(
    "torrent", __name__, static_folder=f"{get_root()}static", template_folder=f"{get_root()}templates/torrent")

# root torrent page to add torrents
@torrent_page.route("/")
def torrent():
    if "id" in session and not "guest" in session:
        return render_template("torrent-mod.html", add_torrent=True, session=[session])
    return redirect(url_for("root.index", guest=True))
