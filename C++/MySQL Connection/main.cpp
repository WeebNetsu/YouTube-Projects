/*
CREATE TABLE `tblUsers` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` varchar(30) NOT NULL,
    `surname` varchar(50) NOT NULL,
    `email` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO tblUsers(name, surname, email, password) VALUES ("mike", "wowzowski", "mike@gmail.com", "password");
INSERT INTO tblUsers(name, surname, email, password) VALUES ("luke", "bordom", "luke@gmail.com", "password2");
INSERT INTO tblUsers(name, surname, email, password) VALUES ("sam", "dally", "sam@gmail.com", "password3");
 */

// g++ connectdb.cpp -o output -L/usr/include/mariadb/mysql -lmariadbclient
// or
// g++ main.cpp -o output -L/usr/include/mysql/mysql -lmariadb
#include <iostream>
// this might change depending on your install, it can be #include <mariadb/mysql.h> you never know
#include <mysql/mysql.h> // /usr/includes/mariadb/mysql.h
/*
    The above include may change to mysql/mysql.h or mysql.h or even something else depending
    on what OS you use and what database language you're using. On Parrot OS the default is
    mariadb and can be found in /usr/includes/mariadb/

    If you use a different Linux distro and use MySQL, then you'll probably find it in
    /usr/includes/mysql/
*/

struct SQLConnection
{
    std::string server, user, password, database;

    SQLConnection(std::string server, std::string user, std::string password, std::string database)
    {
        this->server = server;
        this->user = user;
        this->password = password;
        this->database = database;
    }
};

MYSQL *connectionSetup(struct SQLConnection mysql_details)
{
    MYSQL *connection = mysql_init(NULL); // mysql instance

    // connect database
    // c_str -> converts std::string to char
    if (!mysql_real_connect(connection, mysql_details.server.c_str(), mysql_details.user.c_str(), mysql_details.password.c_str(), mysql_details.database.c_str(), 0, NULL, 0))
    {
        std::cout << "Connection Error: " << mysql_error(connection) << std::endl;
        exit(1);
    }

    return connection;
}

MYSQL_RES *execQuery(MYSQL *connection, std::string query)
{
    // send query to db
    if (mysql_query(connection, query.c_str()))
    {
        std::cout << "MySQL Query Error: " << mysql_error(connection) << std::endl;
        exit(1);
    }

    return mysql_use_result(connection);
}

int main(int argc, char const *argv[])
{
    MYSQL *con;     // the connection
    MYSQL_RES *res; // the results
    MYSQL_ROW row;  // the results rows (array)

    struct SQLConnection sqlDetails("localhost", "steve", "password", "yt");

    // connect to the mysql database
    con = connectionSetup(sqlDetails);

    // get the results from executing commands
    res = execQuery(con, "select * from tblUsers;");

    std::cout << ("Database Output:\n") << std::endl;

    while ((row = mysql_fetch_row(res)) != NULL)
    {
        // the below row[] parametes may change depending on the size of the table and your objective
        std::cout << row[0] << " | " << row[1] << " | " << row[2] << " | " << row[3] << " | " << row[4] << std::endl
                  << std::endl;
    }

    // clean up the database result
    mysql_free_result(res);

    // close database connection
    mysql_close(con);

    return 0;
}
