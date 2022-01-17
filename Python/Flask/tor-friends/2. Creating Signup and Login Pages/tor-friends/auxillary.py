import os

def get_root() -> str:
    """
    Gets the file current location (root).

    NOTE: Modify if auxillary.py is ever moved.
    """
    return os.path.realpath(__file__)[:-len(os.path.basename(__file__))]
