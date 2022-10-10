import os, hashlib, binascii # added hashlib and binascii

def get_root() -> str:
    """
    Gets the file current location (root).

    NOTE: Modify if auxillary.py is ever moved.
    """
    return os.path.realpath(__file__)[:-len(os.path.basename(__file__))]

def encrypt_string(str_: str) -> str:  # hash the string passed in
    """
    This will hash the string.
    """
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    str_hash = hashlib.pbkdf2_hmac(
        'sha512', str_.encode('utf-8'), salt, 100000)
    str_hash = binascii.hexlify(str_hash)
    return (salt + str_hash).decode('ascii')
