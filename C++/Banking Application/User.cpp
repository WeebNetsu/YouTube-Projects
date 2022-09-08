#include "User.h"

User::User()
{
    // constructor doesn't do anything
}

void User::setUserName(std::string username)
{
    this->username = username;
}

void User::setPassword(std::string password)
{
    this->password = password;
}

void User::setBalance(double balance)
{
    this->balance = balance;
}

void User::setAccountType(char accountType)
{
    this->accountType = accountType;
}

void User::setAdmin(char admin)
{
    this->admin = admin;
}

std::string User::getUsername()
{
    return this->username;
}

double User::getBalance()
{
    return this->balance;
}

std::string User::getPassword()
{
    return this->password;
}

char User::getAccountType()
{
    return this->accountType;
}

char User::getAdmin()
{
    return this->admin;
}