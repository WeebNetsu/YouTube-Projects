import os, hashlib, binascii, re # added re

def get_root() -> str:
    """
    Gets the file current location (root).

    NOTE: Modify if auxillary.py is ever moved.
    """
    return os.path.realpath(__file__)[:-len(os.path.basename(__file__))]

def encrypt_string(str_: str) -> str:
    """
    This will hash the string.
    """
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    str_hash = hashlib.pbkdf2_hmac(
        'sha512', str_.encode('utf-8'), salt, 100000)
    str_hash = binascii.hexlify(str_hash)
    return (salt + str_hash).decode('ascii')

# will make the string link-safe
def remove_special_characters(str_: str) -> str:
    """
    Will remove special characters in string (characters not letters or numbers) and replace it with an underscore
    """
    return re.sub('[^A-Za-z0-9]+', '_', str_)


# to reverse a dictionairy
def reverse_dict(dict_: dict) -> dict:
    """
    Reverses the dict
    """
    rev_torrents = dict()
    for k, v in reversed(dict_.items()):
        rev_torrents[k] = v

    return rev_torrents
