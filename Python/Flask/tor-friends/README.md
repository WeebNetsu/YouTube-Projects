# Asteroids Game Tutorial

_Please consider subscribing to my YouTube channel, [Steve's teacher](https://www.youtube.com/stevesteacher)!_

## Homework

This is your homework! You can do this to help you get better at Flask (and web development)! The point of the homework is to help you to learn how to **google** your questions and solve problems on your own and how to use Flask without following a tutorial.

### Before you continue

**View the Flask tutorial playlist [here](https://youtube.com/playlist?list=PLYBJzqz8zpWbW_H3YRxIxdVUv-OEgHlOB).**

### Tasks

#### Add 404 page

If a page does not exist, such as /users/my/user/is (this URL does not exist on the website), make a 404 page appear!

#### Report option

Currently, if someone tries to report a torrent they think is fake or spam, they can't, there is no such option. Try to create a report button that stores the report in the database (or in the torrents JSON file), and allow admins to view reported torrents and remove them if required.

#### Add follow button

It could be nice if a user could follow another user if they like the type of torrents the user uploads. Then allow the user to see a feed of all the torrents released by the people they follow/

#### Add notifications

Add notifications! If someone follows you, get notified! A torrent was marked as spam? Notify the admin! Add a notification page or section that will display all the user's notifications.

#### Delete inactive user accounts

Having forgotten accounts on your website is a horrible tragedy, it uses up storage and slows down database performance with search queries... That is why you should delete all the inactive accounts! If the account has no active torrents, delete the user after 6 months! If the account has active torrents, then delete them in a year or 2!

This will teach you how to run code periodically to do something you need it to.

#### Delete old torrents

Sometimes old torrents end up with no more seeds, causing them to become unusable... Delete them and free up some space for more, new torrents!

#### Prevent admins modifying themselves

Admins can delete various users. There is a problem here that I deliberately didn't fix, mods and admins can delete their accounts from the admin page. This should only be possible from their accounts page, so make sure that they are blocked or warned if they enter their account details.

This is also a problem in the whole admin section of the website.

TL;DR: Block/Warn admins when they try to edit their own account on the admin section of the website.

#### Create user invites

Allow the user to invite more people to the website by sending them an email. This task will help you implement an email service such as [SendGrid](https://app.sendgrid.com) into the website.

#### Redesign the website

Redesign the website, make it your own!

#### Use a different frontend for the website

Whilst using Flask+Jinja is fine, usually, it is more popular to use a JS framework such as React or Vue along with Flask.

#### Implement seed watcher

Write some code that will get the number of seeds and leechers of a torrent and display it on the torrents page

#### Create Admin Dashboard

Create an admin dashboard that will allow admins to see the stats of the website, such as how many torrents there are, how many users, allowing the admins to look through all of the users and see the details of that specific user etc.

#### Implement search

Currently, if you want a specific torrent, then you will have to scroll down until you hopefully find it... Add a search and/or filter to the torrent list that will allow users to find torrents faster

#### Implement pagination

Once there are thousands of torrents on the website, you don't want the torrent page to display too many torrents at once since it will take longer to load and will take too much space vertically. Implement pagination that will limit the number of torrents on the page to 5, 10, 15 or 20, then allow the user to click "next" or "go back" to scroll through all the torrents.
