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

If you are using Windows and you have to include the MySQL system path to your IDE cpp compile settings . To be precise, include C:/Program Files/MySQL/MySQL Server 8.0/include" and ${the same}/MySQL Server 8.0/lib". Here you may bump into a problem with the libmysql.dll - if you are using a 32 bit compiler and that file is 64 bit you cannot build the project and vice-versa. Either everything is 64 bit or 32 bit. If you have found it difficult, have a look at a more modern and simplified API offered through the MySQL Connector C++ in cleaner C++ (header file: <mysqlx/xdevapi.h>), have a look at their guide and examples on Github ---> Thank you to "Em Outras Palavras - Marlon Couto Ribeiro" for providing this information
 */

// g++ connectdb.cpp -o output -L/usr/include/mariadb/mysql -lmariadbclient
// or
// g++ main.cpp -o output -L/usr/include/mysql/mysql -lmariadb
#include <iostream>
#include <tuple>

// this might change depending on your install, it can be #include <mariadb/mysql.h> you never know
#include <mysql/mysql.h> // /usr/includes/mariadb/mysql.h
#include <mysql/mysqld_error.h>
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

/**
 * @brief
 * Will try to connect to SQL, return a tuple, first value will be true if connection was a success
 *
 * @param mysql_details Details to connect ot SQL db
 * @return std::tuple<bool, MYSQL *>
 */
std::tuple<bool, MYSQL *> sqlConnectionSetup(struct SQLConnection mysql_details)
{
    // there are multiple ways to return multiple values, here we use a tuple
    MYSQL *connection = mysql_init(NULL); // mysql instance
    bool success = true;

    // connect database
    // c_str -> converts std::string to char
    if (!mysql_real_connect(connection, mysql_details.server.c_str(), mysql_details.user.c_str(), mysql_details.password.c_str(), mysql_details.database.c_str(), 0, NULL, 0))
    {
        success = false;
        std::cout << "Connection Error: " << mysql_error(connection) << std::endl;
    }

    return std::make_tuple(success, connection);
}

/**
 * @brief
 * Execute a SQL query, will return a tuple, first value will be true if success
 *
 * @param connection SQL connection
 * @param query SQL query
 * @return result struct with success and res (result)
 */
auto execSQLQuery(MYSQL *connection, std::string query)
{
    // instead of returning a tuple, you could return a struct instead
    struct result
    {
        bool success;
        MYSQL_RES *res;
    };
    bool success = true;

    // send query to db
    if (mysql_query(connection, query.c_str()))
    {
        std::cout << "MySQL Query Error: " << mysql_error(connection) << std::endl;
        mysql_error(connection);
        success = false;
    }

    return result{success, mysql_use_result(connection)};
}

int main(int argc, char const *argv[])
{
    bool success;

    MYSQL *con; // the connection
    // MYSQL_RES *res; // the results
    MYSQL_ROW row; // the results rows (array)

    struct SQLConnection sqlDetails("localhost", "steve", "password", "yt");

    // connect to the mysql database
    std::tie(success, con) = sqlConnectionSetup(sqlDetails);

    if (!success)
    {
        // you can handle any errors here
        return;
    }

    // get the results from executing commands
    auto result = execSQLQuery(con, "select * from tblUsers;");

    if (!result.success)
    {
        // handle any errors
        return;
    }

    std::cout << ("Database Output:\n") << std::endl;

    while ((row = mysql_fetch_row(result.res)) != NULL)
    {
        // the below row[] parametes may change depending on the size of the table and your objective
        std::cout << row[0] << " | " << row[1] << " | " << row[2] << " | " << row[3] << " | " << row[4] << std::endl
                  << std::endl;
    }

    // clean up the database result
    mysql_free_result(result.res);

    // close database connection
    mysql_close(con);

    return 0;
}
