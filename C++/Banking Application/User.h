#ifndef USER_H
#define USER_H

#include <string>

class User
{
private:
    std::string username, password;
    char accountType, admin;
    double balance;

public:
    User();

    // setters
    void setBalance(double);
    void setAccountType(char);
    void setUserName(std::string);
    void setPassword(std::string);
    void setAdmin(char);

    // getters
    std::string getUsername();
    std::string getPassword();
    char getAccountType();
    char getAdmin();
    double getBalance();
};

#endif