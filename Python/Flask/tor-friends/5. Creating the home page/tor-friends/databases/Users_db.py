from .db import db

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.Text, nullable=False)
    mod_ = db.Column(db.Integer, nullable=False, default=0)  # 0 = false
    # admins are the only people who can remove mods
    admin_ = db.Column(db.Integer, nullable=False, default=0)
    # TODO: Do data signed in and torrent dates and stuffs
    date_accessed = db.Column(db.Date, nullable=False)

        # when you say BlogPost.query.all() the below will be returned
    def __repr__(self):
        return f"ID: {id}\nusername: {self.username}\npassword: {self.password}\nmod: {self.mod_}"