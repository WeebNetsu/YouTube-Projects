#ifndef BANK_H
#define BANK_H

#include <string>

class Bank
{
private:
    std::string bankName;
    double interest;

public:
    Bank(std::string bankName, double interest);
    ~Bank();

    void displayMenu();
    void deposit();
    void withdraw();
    void displayAccount();
    void displaySpecificAccount();
    std::string displaySpecificAccount_return();
    std::string displaySpecificAccount_mute(std::string username);
    void displayAllAccounts();
    void editAccount();
    void deleteAccount();
    void transferMoney();

    void updateFile(std::string theLine, std::string username, std::string password, char accountType, double balance, char admin);
    // void updateFile(std::string theLine, std::string username, std::string password, char accountType, double balance, char admin, std::string oldUsername);
    void updateFileSpecify(std::string theLine, std::string updateItem, std::string newValue);

    // getters
    std::string getBankName();
    double getInterest();

    bool login();
    bool createAccount();
    bool checkAccountExists(std::string pusername);
    bool checkAccountExists(std::string pusername, std::string ppassword);
    bool compareStrings(std::string str1, std::string str2);

    int optionExists(int);
    double optionExists(double);
};

#endif