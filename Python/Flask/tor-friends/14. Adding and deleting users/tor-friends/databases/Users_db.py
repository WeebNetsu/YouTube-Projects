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


# will allow us to update fields in database
def update_user_db_field(username, value, field="username"):
    user = Users.query.filter_by(username=username).all()[0]
    user = Users.query.get_or_404(user.id)

    if field == "username":
        user.username = value
    elif field == "password":
        user.password = value
    elif field == "mod":
        user.mod_ = value
    elif field == "date_accessed":
        user.date_accessed = value

    db.session.commit()