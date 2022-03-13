import os, hashlib, binascii, re, random, json  # added json
from flask import flash, session
from collections import OrderedDict  # import ordered dict


def get_root() -> str:
    """
    Gets the file current location (root).

    NOTE: Modify if auxillary.py is ever moved.
    """
    return os.path.realpath(__file__)[: -len(os.path.basename(__file__))]


def encrypt_string(str_: str) -> str:
    """
    This will hash the string.
    """
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode("ascii")
    str_hash = hashlib.pbkdf2_hmac("sha512", str_.encode("utf-8"), salt, 100000)
    str_hash = binascii.hexlify(str_hash)
    return (salt + str_hash).decode("ascii")


def verify_encrypted_string(stored_str: str, provided_str: str) -> bool:
    """
    Compares hashed string with string provided by user and returns true if they match.
    stored_str = the already hashed string
    provided_str = the string that should be compared to the stored one
    """
    # verify_encrypted_string(hashed_str, "string to be compared")
    salt = stored_str[:64]
    stored_str = stored_str[64:]
    str_hash = hashlib.pbkdf2_hmac(
        "sha512", provided_str.encode("utf-8"), salt.encode("ascii"), 100000
    )
    str_hash = binascii.hexlify(str_hash).decode("ascii")
    return str_hash == stored_str


def remove_special_characters(str_: str) -> str:
    """
    Will remove special characters in string (characters not letters or numbers) and replace it with an underscore
    """
    return re.sub("[^A-Za-z0-9]+", "_", str_)


def reverse_dict(dict_: dict) -> dict:
    """
    Reverses the dict
    """
    rev_torrents = dict()
    for k, v in reversed(dict_.items()):
        rev_torrents[k] = v

    return rev_torrents


# allows user to view website as a guest
def guest_sign_in() -> None:
    """
    This gives non-signed in users a random session id and the username 'Guest' as well as set their status as guest.
    This allows them to still use the website without an account
    """
    session["id"] = random.randint(1, 999999)  # guest random ID
    session["username"] = "Guest"
    session["guest"] = True
    flash("Signed in as Guest user", "info")


# allow us to read json file
def read_json_file(file: str) -> OrderedDict():
    """
    file: the file name, do not add the '.json' at the end, so: read_json_file("config") (will read config.json)
    """
    try:
        json_data = open(f"{get_root()}static/json/{file}.json", "r")
        # will read from file (and convert to dictionary)
        torrents = OrderedDict(json.load(json_data))
        json_data.close()
    except FileNotFoundError:
        # erase everything and rewrite the file
        tFile = open(f"{get_root()}static/json/{file}.json", "w")
        tFile.write("{\n}")
        tFile.close()

        json_data = open(f"{get_root()}static/json/{file}.json", "r")
        # will read from file (and convert to dictionary)
        torrents = OrderedDict(json.load(json_data))
        json_data.close()

    return torrents


# allow us to write to json file
def write_torrent_json(torrents: dict) -> None:
    """
    Writes data to torrents.json file (converts OrderedDict or Dict to json then dumps into the file)
    """
    with open(f"{get_root()}/static/json/torrents.json", "w") as json_file:
        json.dump(torrents, json_file, indent=4)
