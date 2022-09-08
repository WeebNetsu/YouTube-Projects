#include <iostream>
#include <fstream> //to work with files
#include <iomanip> //to make sure double stay 0.00 and not 0.0
// #include <boost/algorithm/string.hpp> // legit just to use tolowercase

#include "Bank.h"
#include "User.h"

// basically the game loop, but this is an application, so an app loop
bool running;
// creates an object to store user data
User *user;

Bank::Bank(std::string bankName, double interest)
{
    this->bankName = bankName;
    this->interest = interest;
    // starts game loop
    running = true;

    // keeps double in 0.00 and not 0.0
    std::cout << std::fixed;
    std::cout << std::setprecision(2);

    std::cout << "   " << this->bankName << std::endl;
    user = new User();

    if (login())
    { // if sucessfully logged in
        std::cout << "\nWelcome " << user->getUsername() << "!" << std::endl;

        // uses app loop to make sure the user can keep using application until they quit
        while (running)
        {
            displayMenu();
        }
    }
}

void Bank::displayMenu()
{
    std::cout << "\n    " << this->bankName << std::endl;
    std::cout << "\tMain Menu" << std::endl;
    std::cout << "1) Deposit" << std::endl;
    std::cout << "2) Withdraw" << std::endl;
    std::cout << "3) Display Account" << std::endl;
    std::cout << "4) Send Transaction" << std::endl;

    // if the user is an admin, display the rest of the menu as well
    if (user->getAdmin() == '1')
    {
        std::cout << "5) Display Specific Account" << std::endl;
        std::cout << "6) Display All Accounts" << std::endl;
        std::cout << "7) Edit Account" << std::endl;
        std::cout << "8) Delete Account" << std::endl;
    }

    std::cout << "0) Exit" << std::endl;

    std::cout << "Your Option: ";
    int option;
    std::cin >> option;
    if (!std::cin)
    {
        // std::cout << "\nNo such option exists... Please try again." << std::endl;
        std::cin.clear();
        std::cin.ignore(100, '\n'); // moves 100 lines then goes to the next line
    }

    if (user->getAdmin() != '1')
    { // if user is not admin, limit their choices (they can not edit/remove/see others)
        switch (option)
        {
        case 0:
            running = false;
            break;

        case 1:
            deposit();
            break;

        case 2:
            withdraw();
            break;

        case 3:
            displayAccount();
            break;

        case 4:
            transferMoney();
            break;

        default:
            std::cout << "No such option, please try again\n"
                      << std::endl;
            break;
        }
    }
    else
    { // if admin, then allow all the options
        switch (option)
        {
        case 0:
            running = false;
            break;

        case 1:
            deposit();
            break;

        case 2:
            withdraw();
            break;

        case 3:
            displayAccount();
            break;

        case 4:
            transferMoney();
            break;

        case 5:
            displaySpecificAccount();
            break;

        case 6:
            displayAllAccounts();
            break;

        case 7:
            editAccount();
            break;

        case 8:
            deleteAccount();
            break;

        default:
            std::cout << "No such option, please try again\n"
                      << std::endl;
            break;
        }
    }
}

void Bank::transferMoney()
{
    std::cout << "Who would you like to deposit money to? (username): ";
    std::string rUsername;
    std::cin >> rUsername;

    if (compareStrings("0", rUsername))
    {
        std::cout << "Opperation canceled" << std::endl;

        return;
    }

    if (checkAccountExists(rUsername))
    {
        std::cout << "How much do you want to deposit? (interest: " << getInterest() << "%): ";
        double cash = optionExists(cash);
        double totalCost = cash + (cash * getInterest() / 100);
        if (user->getBalance() < totalCost)
        {
            std::cout << "You do not have enough money to transfer " << cash << ". (You need a minimum of " << totalCost << " to transfer amount)\nPlease try again (0 to cancel)" << std::endl;

            transferMoney();

            return;
        }
        else
        {
            std::cout << "You are about to extract a total of " << totalCost << " from you account, do you want to continue?\ny/n: ";
            std::string ans;
            std::cin >> ans;
            if (compareStrings("y", ans) || compareStrings("Y", ans) || compareStrings("yes", ans))
            {
                std::cout << "Transfer started" << std::endl;
            }
            else
            {
                std::cout << "Transfer canceled!" << std::endl;
                return;
            }
        }

        std::string theLine = displaySpecificAccount_mute(rUsername);
        std::string tLine = theLine;
        tLine.erase(0, tLine.find(",") + 1); // removes username
        tLine.erase(0, tLine.find(",") + 1); // removes password
        tLine.erase(0, tLine.find(",") + 1); // removes account type
        double balance = std::stof(tLine.substr(0, tLine.find(",")));
        balance += cash;
        updateFileSpecify(theLine, "balance", std::to_string(balance));

        updateFileSpecify(displaySpecificAccount_mute(user->getUsername()), "balance", std::to_string(user->getBalance() - totalCost));

        std::cout << "Money transfered succesfully! Current balance: " << user->getBalance() - totalCost << std::endl;

        return;
    }
    std::cout << "No such user exists... Please try again (0 to cancel)" << std::endl;

    transferMoney();

    return;
}

void Bank::deleteAccount()
{
    std::string rline = displaySpecificAccount_return(); // rline = returned_line
    if (compareStrings("error", rline))
    {           // if an error was returned
        return; // don't continue with procedure
    }

    std::string tusername; // t for temp

    std::size_t tsplit = rline.find(','); // finds ','
    tusername = rline.substr(0, tsplit);  // copies username

    if (compareStrings(tusername, user->getUsername()))
    {
        // warn user about deleting their own account
        std::cout << "\nWARNING! You are about to delete your own account.\n"
                  << std::endl;
    }

    std::cout << "Are you sure you want to delete the account? (y/n): ";
    char option;
    std::cin >> option;

    // if not a valid option
    if (!(option == 'y' || option == 'Y' || option == 'n' || option == 'N'))
    {
        std::cout << "\nPlease only enter \"y\" (yes)/ \"n\" (no)\n"
                  << std::endl;

        return;
    }

    if (option == 'y' || option == 'Y')
    {
        std::string username;
        char seperator = ',';

        std::size_t split = rline.find(seperator); // finds ','
        username = rline.substr(0, split);         // copies username

        std::ifstream FileUser("users.dat"); // gets input from the file
        std::ofstream tempFile("temp.tmp");  // create a temparary file
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, username))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::cout << "User " << username << " was deleted" << std::endl;

        if (compareStrings(username, user->getUsername()))
        {
            running = false; // stops app loop from executing, since user was deleted
        }
    }
    else
    {
        std::cout << "User not deleted" << std::endl;
    }
}

void Bank::editAccount()
{
    std::string line = displaySpecificAccount_return();
    std::string lineBackup = line;
    if (compareStrings("error", line))
    { // if the above function returned an error
        return;
    }

    std::string tusername; // t for temp

    std::size_t tsplit = line.find(','); // finds ','
    tusername = line.substr(0, tsplit);  // copies username

    if (compareStrings(tusername, user->getUsername()))
    {
        std::cout << "\nChanges will be applied on next login\n"
                  << std::endl;
    }

    std::cout << "What would you like to edit?" << std::endl;
    std::cout << "1) Username" << std::endl;     // change an username
    std::cout << "2) Password" << std::endl;     // change a password
    std::cout << "3) Account Type" << std::endl; // change account type from c->s or s->c
    std::cout << "4) Admin Rights" << std::endl; // enable/disable admin rights
    std::cout << "0) Exit" << std::endl;
    std::cout << "Your option: ";

    int option;
    option = optionExists(option);
    std::string strChange, oldUsername, oldPassword;
    char charChange, oldAccountType, oldAdminRights, seperator = ',';
    double balance;

    // username,password,acctype,balance,admin
    std::size_t split = line.find(seperator); // finds ','
    oldUsername = line.substr(0, split);      // copies username
    line.erase(0, split + 1);                 // deletes first part of string
    // password,acctype,balance

    split = line.find(seperator);
    oldPassword = line.substr(0, split); // copies password
    line.erase(0, split + 1);

    split = line.find(seperator);
    oldAccountType = line[0]; // copies account type
    line.erase(0, split + 1);

    split = line.find(seperator);
    balance = std::stod(line.substr(0, split));
    line.erase(0, split + 1);

    oldAdminRights = line[0];

    switch (option)
    {
    case 0: // exit
        return;
        break;

    case 1: // edit username
        std::cout << "New Username: ";
        std::cin >> strChange;
        updateFileSpecify(lineBackup, "username", strChange);
        // updateFile(line, strChange, oldPassword, oldAccountType, balance, oldAdminRights, oldUsername);
        break;

    case 2: // edit password
        std::cout << "New Password: ";
        std::cin >> strChange;

        updateFile(line, oldUsername, strChange, oldAccountType, balance, oldAdminRights);
        break;

    case 3: // edit account type
        std::cout << "Change account type from " << (oldAccountType == 'C' ? "Checkings Account" : "Savings Account") << " to " << (oldAccountType == 'C' ? "Savings Account" : "Checkings Account") << "? (y/n): ";
        std::cin >> charChange;
        if (!((charChange == 'y') || (charChange == 'n') || (charChange == 'Y') || (charChange == 'N')))
        {
            std::cout << "Please only enter y (yes)/n (no)." << std::endl;

            editAccount();

            return;
        }

        if (charChange == 'y' || charChange == 'Y')
        {
            // std::cout << (oldAccountType == 'C' ? 'S' : 'C') << std::endl;
            updateFile(line, oldUsername, oldPassword, (oldAccountType == 'C' ? 'S' : 'C'), balance, oldAdminRights);
            // std::cout << (oldAccountType == 'C' ? 'S' : 'C') << std::endl;
        }
        break;

    case 4: // edit admin rights
        if (oldAdminRights == '0')
        {
            std::cout << "This user is not admin, make user admin? (y/n): ";
        }
        else
        {
            std::cout << "This user is admin, remove user rights? (y/n): ";
        }

        std::cin >> charChange;
        if (!(charChange == 'y' || charChange == 'n' || charChange == 'N' || charChange == 'Y'))
        {
            std::cout << "Please only enter \"y\" or \"n\"." << std::endl;

            editAccount();

            return;
        }
        else if (charChange == 'y' || charChange == 'Y')
        {
            updateFile(line, oldUsername, oldPassword, oldAccountType, balance, (oldAdminRights == '1' ? '0' : '1'));
        }
        break;

    default:
        std::cout << "No such option exists, please choose again..." << std::endl;
        editAccount();
        return;
        break;
    }
}

void Bank::displaySpecificAccount()
{
    std::cout << "Which account are you looking for? (username): ";
    std::string username;
    std::cin >> username;

    if (checkAccountExists(username))
    { // make sure the account they're looking for exists
        std::ifstream FileUsers("users.dat");
        std::string line, pusername, password;
        char accountType, admin, seperator = ',';
        double balance;

        while (getline(FileUsers, line))
        {
            if (line == "")
            { // if empty line, don't try to read it
                continue;
            }

            // username,password,acctype,balance,admin
            std::size_t split = line.find(seperator); // finds ','
            pusername = line.substr(0, split);        // copies username
            line.erase(0, split + 1);                 // deletes first part of string
            // password,acctype,balance

            if (!compareStrings(pusername, username))
            { // if the usernames do not match, continue to next line
                continue;
            }

            split = line.find(seperator);
            password = line.substr(0, split); // copies password
            line.erase(0, split + 1);

            split = line.find(seperator);
            accountType = line[0]; // copies account type
            line.erase(0, split + 1);

            split = line.find(seperator);
            balance = std::stod(line.substr(0, split));
            line.erase(0, split + 1);

            admin = line[0];

            int usernameLength = username.length() / 2;
            for (int i = 0; i < 30 - usernameLength; i++)
            { // adds some basic design
                std::cout << "-";
            }

            std::cout << username;
            for (int i = 0; i < 30 - usernameLength; i++)
            {
                std::cout << "-";
            }

            std::cout << std::endl
                      << std::endl;

            std::cout << "Account Name: " << username << std::endl;
            std::cout << "Balance: " << balance << std::endl;
            std::cout << "Account Type: " << (accountType == 'C' ? "Checking" : "Savings") << std::endl;
            std::cout << "Current Withdrawal Interest: " << getInterest() << "%" << std::endl;
            std::cout << "Admin: " << (admin != '0' ? "Yes" : "No") << std::endl;

            std::cout << "\n-------------------------------END-------------------------------" << std::endl;
        }

        FileUsers.close();
        return;
    }

    std::cout << "\nNo Account Found\n"
              << std::endl;
    displaySpecificAccount();
}

std::string Bank::displaySpecificAccount_return()
{ // displays specific account, but returns username or error
    std::cout << "Which account are you looking for? (username): ";
    std::string username;
    std::cin >> username;

    if (checkAccountExists(username))
    {
        std::ifstream FileUsers("users.dat");
        std::string pusername, password, line, result;
        char accountType, seperator = ',';
        double balance;
        char admin;

        while (getline(FileUsers, line))
        {
            if (line == "")
            {
                continue;
            }

            // username,password,acctype,balance,admin
            std::size_t split = line.find(seperator); // finds ','
            pusername = line.substr(0, split);        // copies username
            line.erase(0, split + 1);                 // deletes first part of string
            // password,acctype,balance

            if (!compareStrings(pusername, username))
            {
                continue;
            }

            split = line.find(seperator);
            password = line.substr(0, split); // copies password
            line.erase(0, split + 1);

            split = line.find(seperator);
            accountType = line[0]; // copies account type
            line.erase(0, split + 1);

            split = line.find(seperator);
            balance = std::stod(line.substr(0, split));
            line.erase(0, split + 1);

            admin = line[0];

            int usernameLength = username.length() / 2;
            for (int i = 0; i < 30 - usernameLength; i++)
            {
                std::cout << "-";
            }
            std::cout << username;
            for (int i = 0; i < 30 - usernameLength; i++)
            {
                std::cout << "-";
            }
            std::cout << std::endl
                      << std::endl;

            std::cout << "Account Name: " << username << std::endl;
            std::cout << "Balance: " << balance << std::endl;
            std::cout << "Account Type: " << (accountType == 'C' ? "Checking" : "Savings") << std::endl;
            std::cout << "Current Withdrawal Interest: " << getInterest() << "%" << std::endl;
            std::cout << "Admin: " << (admin != '0' ? "Yes" : "No") << std::endl;

            std::cout << "\n-------------------------------END-------------------------------" << std::endl;
        }

        result = username + "," + password + "," + accountType + "," + std::to_string(balance) + "," + admin;
        FileUsers.close();
        return result;
    }

    std::cout << "\nNo Account Found\n"
              << std::endl;
    return "error"; // reports error (why "error" is an invalid username)
}

std::string Bank::displaySpecificAccount_mute(std::string username)
{
    if (checkAccountExists(username))
    {
        std::ifstream FileUsers("users.dat");
        std::string pusername, password, line, result;
        char accountType, seperator = ',';
        double balance;
        char admin;

        while (getline(FileUsers, line))
        {
            if (line == "")
            {
                continue;
            }

            // username,password,acctype,balance,admin
            std::size_t split = line.find(seperator); // finds ','
            pusername = line.substr(0, split);        // copies username
            line.erase(0, split + 1);                 // deletes first part of string
            // password,acctype,balance

            if (!compareStrings(pusername, username))
            {
                continue;
            }

            split = line.find(seperator);
            password = line.substr(0, split); // copies password
            line.erase(0, split + 1);

            split = line.find(seperator);
            accountType = line[0]; // copies account type
            line.erase(0, split + 1);

            split = line.find(seperator);
            balance = std::stod(line.substr(0, split));
            line.erase(0, split + 1);

            admin = line[0];
        }

        result = username + "," + password + "," + accountType + "," + std::to_string(balance) + "," + admin;
        FileUsers.close();
        return result;
    }

    return "error"; // reports error (why "error" is an invalid username)
}

void Bank::displayAllAccounts()
{ // displays all existing accounts
    std::ifstream FileUsers("users.dat");
    std::string line;

    while (getline(FileUsers, line))
    {
        if (line == "")
        {
            continue;
        }

        std::string username, password;
        char accountType, seperator = ',';
        double balance;
        char admin;

        // username,password,acctype,balance,admin
        std::size_t split = line.find(seperator); // finds ','
        username = line.substr(0, split);         // copies username
        line.erase(0, split + 1);                 // deletes first part of string
        // password,acctype,balance

        split = line.find(seperator);
        password = line.substr(0, split); // copies password
        line.erase(0, split + 1);

        split = line.find(seperator);
        accountType = line[0]; // copies account type
        line.erase(0, split + 1);

        split = line.find(seperator);
        balance = std::stod(line.substr(0, split));
        line.erase(0, split + 1);

        admin = line[0];

        int usernameLength = username.length() / 2;
        for (int i = 0; i < 30 - usernameLength; i++)
        {
            std::cout << "-";
        }
        std::cout << username;
        for (int i = 0; i < 30 - usernameLength; i++)
        {
            std::cout << "-";
        }
        std::cout << std::endl
                  << std::endl;

        std::cout << "Account Name: " << username << std::endl;
        std::cout << "Balance: " << balance << std::endl;
        std::cout << "Account Type: " << (accountType == 'C' ? "Checking" : "Savings") << std::endl;
        std::cout << "Current Withdrawal Interest: " << getInterest() << "%" << std::endl;
        std::cout << "Admin: " << (admin != '0' ? "Yes" : "No") << std::endl;

        std::cout << "\n-------------------------------END-------------------------------\n"
                  << std::endl;
    }

    FileUsers.close();
}

void Bank::displayAccount()
{ // display current user account
    std::cout << "\n\n------------------------------BEGIN------------------------------\n"
              << std::endl;

    std::cout << "Review of your account at " << getBankName() << std::endl;
    std::cout << "You, " << user->getUsername() << ", currently have the following in your account:" << std::endl;
    std::cout << "Balance: " << user->getBalance() << std::endl;
    std::cout << "Account Type: " << (user->getAccountType() == 'C' ? "Checking" : "Savings") << std::endl;
    std::cout << "Current Withdrawal Interest: " << getInterest() << "%" << std::endl;

    if (user->getAdmin() == '1')
    {
        std::cout << "\nYou are an admin" << std::endl;
    }

    std::cout << "\n-------------------------------END-------------------------------\n\n"
              << std::endl;
}

void Bank::withdraw()
{
    interest = getInterest();
    std::cout << "You currently have " << user->getBalance() << " in your account.\nHow much would you like to withdraw? Amount: ";
    double amount = optionExists(amount);
    interest /= 100;    // if interest was 7.14, then it is now 0.0714 (7.14%)
    interest *= amount; // gets 7.14% from amount being withdrawn

    if (user->getBalance() < 10)
    {
        std::cout << "You have less than ($)10 in your account, you are not eligible for withdrawing..." << std::endl;

        return;
    }

    if (amount < 5)
    {
        std::cout << "You can only withdraw a minimum of ($)5..." << std::endl;

        return;
    }

    double moneyInBank = user->getBalance();
    user->setBalance(moneyInBank - (amount + interest));

    std::cout << "Your balance of " << moneyInBank << " has been decreased to " << user->getBalance() << " (interest: " << getInterest() << "% ~ " << interest << ")" << std::endl;
    std::string theLine = user->getUsername() + "," + user->getPassword() + "," + user->getAccountType() + "," + std::to_string(moneyInBank) + "," + std::to_string(user->getAdmin());
    updateFile(theLine, user->getUsername(), user->getPassword(), user->getAccountType(), user->getBalance(), user->getAdmin());

    if (user->getBalance() < 0)
    { // if user has less than $0 in account
        std::cout << "Please note: You are now in dept, please repay borrowed amount within 30 days to avoid increase in dept (+" << getInterest() << "%)." << std::endl;
    }
}

void Bank::deposit()
{ // put money into user account
    std::cout << "You currently have " << user->getBalance() << " in your account.\nHow much would you like to deposit? Amount: ";
    double amount = optionExists(amount);

    if (amount < 5)
    { // why? so they can pay tax on what they put into their accounts
        std::cout << "You can only deposit a minimum of 5..." << std::endl;

        return;
    }

    double moneyInBank = user->getBalance();
    user->setBalance(moneyInBank + amount);

    std::cout << "Your balance of " << moneyInBank << " has been increased to " << user->getBalance() << std::endl;
    std::string theLine = user->getUsername() + "," + user->getPassword() + "," + user->getAccountType() + "," + std::to_string(moneyInBank) + "," + user->getAdmin();
    updateFile(theLine, user->getUsername(), user->getPassword(), user->getAccountType(), user->getBalance(), user->getAdmin());
}

void Bank::updateFileSpecify(std::string theLine, std::string updateItem, std::string newValue)
{
    // get details
    //  std::cout << "OG PASS: " << theLine << std::endl;
    std::string oUsername = theLine.substr(0, theLine.find(","));
    theLine.erase(0, theLine.find(",") + 1);
    std::string oPassword = theLine.substr(0, theLine.find(","));
    theLine.erase(0, theLine.find(",") + 1);
    std::string oAccountType = theLine.substr(0, theLine.find(","));
    theLine.erase(0, theLine.find(",") + 1);
    std::string oBalance = theLine.substr(0, theLine.find(","));
    theLine.erase(0, theLine.find(",") + 1);
    std::string oAdmin = theLine;

    std::ifstream FileUser("users.dat"); // gets input from the file
    std::ofstream tempFile("temp.tmp");  // create a temparary file

    if (compareStrings("username", updateItem))
    {
        std::cout << "Updating username" << std::endl;
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, oUsername))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::ofstream FileUser2; // create a file object
        FileUser2.open("users.dat", std::ios::app | std::ios::out);
        FileUser2 << std::fixed;
        FileUser2 << std::setprecision(2);
        FileUser2 << "\n"
                  << newValue << "," << oPassword << "," << oAccountType << "," << oBalance << "," << oAdmin;
        FileUser2.close();
    }
    else if (compareStrings("password", updateItem))
    {
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, oUsername))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::ofstream FileUser2; // create a file object
        FileUser2.open("users.dat", std::ios::app | std::ios::out);
        FileUser2 << std::fixed;
        FileUser2 << std::setprecision(2);
        FileUser2 << "\n"
                  << oUsername << "," << newValue << "," << oAccountType << "," << oBalance << "," << oAdmin;
        FileUser2.close();
    }
    else if (compareStrings("account type", updateItem))
    {
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, oUsername))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::ofstream FileUser2; // create a file object
        FileUser2.open("users.dat", std::ios::app | std::ios::out);
        FileUser2 << std::fixed;
        FileUser2 << std::setprecision(2);
        FileUser2 << "\n"
                  << oUsername << "," << oPassword << "," << newValue << "," << oBalance << "," << oAdmin;
        FileUser2.close();
    }
    else if (compareStrings("balance", updateItem))
    {
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, oUsername))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::ofstream FileUser2; // create a file object
        FileUser2.open("users.dat", std::ios::app | std::ios::out);
        FileUser2 << std::fixed;
        FileUser2 << std::setprecision(2);
        FileUser2 << "\n"
                  << oUsername << "," << oPassword << "," << oAccountType << "," << newValue << "," << oAdmin;
        FileUser2.close();
    }
    else if (compareStrings("admin", updateItem))
    {
        std::string line;

        while (getline(FileUser, line))
        {                                                     // reads line from file and puts it in variable
            std::size_t split = line.find(',');               // finds ','
            std::string thisusername = line.substr(0, split); // copies username

            if (!compareStrings(thisusername, oUsername))
            { // if the usernames match, dont copy over to temp file
                tempFile << "\n"
                         << line;
            }
        }

        tempFile.close();
        FileUser.close();

        remove("users.dat");             // delete original file
        rename("temp.tmp", "users.dat"); // rename temp file to name of original file

        std::ofstream FileUser2; // create a file object
        FileUser2.open("users.dat", std::ios::app | std::ios::out);
        FileUser2 << std::fixed;
        FileUser2 << std::setprecision(2);
        FileUser2 << "\n"
                  << oUsername << "," << oPassword << "," << oAccountType << "," << oBalance << "," << newValue;
        FileUser2.close();
    }
    else
    {
        std::cout << "Could not execute, error occured!" << std::endl;
        tempFile.close();
        FileUser.close();
    }
}

void Bank::updateFile(std::string theLine, std::string username, std::string password, char accountType, double balance, char admin)
{
    std::ifstream FileUser("users.dat"); // gets input from the file
    std::ofstream tempFile("temp.tmp");  // create a temparary file
    std::string line;

    while (getline(FileUser, line))
    {                                                     // reads line from file and puts it in variable
        std::size_t split = line.find(',');               // finds ','
        std::string thisusername = line.substr(0, split); // copies username

        if (!compareStrings(thisusername, username))
        { // if the usernames match, dont copy over to temp file
            tempFile << "\n"
                     << line;
        }
    }

    tempFile.close();
    FileUser.close();

    remove("users.dat");             // delete original file
    rename("temp.tmp", "users.dat"); // rename temp file to name of original file

    std::ofstream FileUser2; // create a file object
    FileUser2.open("users.dat", std::ios::app | std::ios::out);
    FileUser2 << std::fixed;
    FileUser2 << std::setprecision(2);
    FileUser2 << "\n"
              << username << "," << password << "," << accountType << "," << balance << "," << admin;
    FileUser2.close();
}

/*void Bank::updateFile(std::string theLine, std::string username, std::string password, char accountType, double balance, char admin, std::string oldUsername){
    std::ifstream FileUser("users.dat"); //gets input from the file
    std::ofstream tempFile("temp.tmp"); //create a temparary file
    std::string line;

    while(getline(FileUser, line)){ //reads line from file and puts it in variable
        std::size_t split = line.find(','); //finds ','
        std::string thisusername = line.substr(0,  split); //copies username

        if(!compareStrings(thisusername, oldUsername)){ //if the usernames match, dont copy over to temp file
            tempFile << "\n" << line;
        }
    }

    tempFile.close();
    FileUser.close();

    remove("users.dat"); //delete original file
    rename("temp.tmp", "users.dat"); //rename temp file to name of original file

    std::ofstream FileUser2; //create a file object
    FileUser2.open("users.dat", std::ios::app | std::ios::out);
    FileUser2 << std::fixed;
    FileUser2 << std::setprecision(2);
    FileUser2 << "\n" << username << "," << password << "," << accountType << "," << balance << "," << admin;
    FileUser2.close();
}*/

bool Bank::login()
{ // allows user to log in
    std::cin.clear();
    std::cout << "1) Create New Account" << std::endl;
    std::cout << "2) Use Existing Account" << std::endl;
    std::cout << "Your Option: ";

    int option;
    std::cin >> option;
    if (!std::cin)
    {
        // std::cout << "\nNo such option exists... Please try again." << std::endl;
        std::cin.clear();
        std::cin.ignore(100, '\n'); // moves 100 lines then goes to the next line
    }

    std::string username, password;
    switch (option)
    {
    case 1: // create a new account
        if (createAccount())
        {
            std::cout << "\nYou have successfully created a new account. You can now log in\n"
                      << std::endl;
        }
        else
        {
            login(); // if account could not be created, attempt new log in
        }
        break;

    case 2: // log in with existing account
        std::cout << "\n--- Log In ---" << std::endl;
        ;
        std::cout << "Please enter your username: ";
        std::cin >> username;
        std::cout << "Please enter your password: ";
        std::cin >> password;

        if (checkAccountExists(username, password))
        {
            std::cout << "Logged in successfully" << std::endl;
        }
        else
        {
            std::cout << "Username or password is incorrect\n"
                      << std::endl;

            login();
        }
        break;

    default:
        std::cout << "\nNo such option exists... Please try again.\n"
                  << std::endl;

        login();
        break;
    }

    return true; // starts program
}

bool Bank::createAccount()
{ // allows user to create new account
    std::string username, password;
    char accountType;
    double balance = 0.01; // to avoid any bugs and be nice to the user by giving them 1 cent for free

    std::cout << "\n--- Create New Account ---" << std::endl;
    ;
    std::cout << "Please enter your username: ";
    std::cin >> username;
    std::cout << "Please enter your password: ";
    std::cin >> password;

    if (username.length() < 4)
    { // makes hacking user accounts more difficult
        std::cout << "Username is not long enough (minimum 4 characters)" << std::endl;

        return false;
    }
    else if (password.length() < 4)
    {
        std::cout << "Password is too short (minimum 4 characters)" << std::endl;

        return false;
    }

    // I return "error" in some functions to check for errors, so an "error" username/password could cause problems
    if (compareStrings("error", username) || compareStrings("error", password))
    {
        std::cout << "Invalid username or password" << std::endl;

        return false;
    }

    if (!checkAccountExists(username, password))
    { // if account does not exist, create a new one
        std::cout << "What account type do you want?" << std::endl;
        std::cout << "1) Check Account" << std::endl;
        std::cout << "2) Savings Account" << std::endl;
        std::cout << "Your Option: ";

        int option = optionExists(option);
        switch (option)
        {
        case 1:
            accountType = 'C';

            std::cout << "Your account type: Checkings Account" << std::endl;
            break;

        case 2:
            accountType = 'S';

            std::cout << "Your account type: Savings Account" << std::endl;
            break;

        default:
            std::cout << "Invalid value entered." << std::endl;

            createAccount();
            break;
        }

        std::ofstream FileUser;                                    // create a file object
        FileUser.open("users.dat", std::ios::app | std::ios::out); // appends to the end of the file

        FileUser << "\n"
                 << username << "," << password << "," << accountType << "," << balance << ",0";

        FileUser.close();

        user->setPassword(password);
        user->setUserName(username);
        user->setAccountType(accountType);
        user->setBalance(balance);
        user->setAdmin('0');

        return true;
    }

    std::cout << "Could not create account. Maybe the username already exists?" << std::endl;
    return false;
}

bool Bank::checkAccountExists(std::string pusername)
{
    std::string line, username;
    std::ifstream FileUser("users.dat"); // gets input from the file

    while (getline(FileUser, line))
    { // reads line from file and puts it in variable
        // username,password,acctype,balance
        std::size_t split = line.find(','); // finds ','
        username = line.substr(0, split);   // copies username

        if (compareStrings(pusername, username))
        {
            FileUser.close();
            return true;
        }
    }

    FileUser.close();
    return false;
}

bool Bank::checkAccountExists(std::string pusername, std::string ppassword)
{
    std::string line, username, password;
    char accountType, seperator = ',', admin;
    double balance;

    std::ifstream FileUser("users.dat"); // gets input from the file

    while (getline(FileUser, line))
    { // reads line from file and puts it in variable
        // username,password,acctype,balance
        std::size_t split = line.find(seperator); // finds ','
        username = line.substr(0, split);         // copies username
        line.erase(0, split + 1);                 // deletes first part of string
        // password,acctype,balance

        if (compareStrings(pusername, username))
        {
            split = line.find(seperator);
            password = line.substr(0, split); // copies password
            line.erase(0, split + 1);

            if (compareStrings(ppassword, password))
            {
                split = line.find(seperator);
                accountType = line[0]; // copies account type
                line.erase(0, split + 1);

                split = line.find(seperator);
                balance = std::stod(line.substr(0, split));
                line.erase(0, split + 1);

                admin = line[0];

                user->setUserName(username);
                user->setPassword(password);
                user->setAccountType(accountType);
                user->setBalance(balance);
                user->setAdmin(admin);

                FileUser.close();
                return true;
            }
        }
    }

    FileUser.close();
    return false;
}

bool Bank::compareStrings(std::string str1, std::string str2)
{
    int str1_length = str1.length();
    int str2_length = str2.length();

    if (str1_length == str2_length)
    {
        for (int i = 0; i < str1_length; i++)
        {
            if (!(str1[i] == str2[i]))
            {
                return false;
            }
        }

        return true;
    }

    return false;
}

int Bank::optionExists(int option)
{
    std::cin >> option;

    while (!std::cin)
    {
        std::cout << "\nInvalid value, please retype the correct value: ";
        std::cin.clear();
        std::cin.ignore(200, '\n'); // moves 200 lines then goes to the next line
        std::cin >> option;
    }

    return option;
}

double Bank::optionExists(double amount)
{
    std::cin >> amount;

    while (!std::cin)
    {
        std::cout << "\nInvalid value, please retype the correct value: ";
        std::cin.clear();
        std::cin.ignore(100, '\n'); // moves 200 lines then goes to the next line
        std::cin >> amount;
    }

    return amount;
}

double Bank::getInterest()
{
    return this->interest;
}

std::string Bank::getBankName()
{
    return this->bankName;
}

// displays a nice message when the user quits the application
Bank::~Bank()
{
    std::cout << "\nThank you for using " << getBankName() << std::endl;
}