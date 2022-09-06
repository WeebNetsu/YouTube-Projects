/*
    This primarily works on Linux (and probably Mac), Windows users will have to do a little more effort

    Steps:
    1. Clone LuaCPP library, used to run Lua in C++
        git clone https://github.com/jordanvrtanoski/luacpp.git

    2. Go into folder and create a build folder
        cd luacpp
        mkdir build
        cd build

    3. Build the source
        cmake ../Source
        make -j `nproc`

    4. Install
        make install

    5. Export env variable to point to folder containing libluacpp.so (this should appear after building the project)
        export LD_LIBRARY_PATH=/home/netsu/Downloads/luacpp/build/

    6. Compile source code with (might change depending on lua version and OS), you need Lua libraries installed for this to work
        gcc main.cpp -I /usr/local/include/LuaCpp -I /usr/include/lua5.3/ -lluacpp -llua5.3 -lstdc++ -o output
 */

#include <LuaCpp.hpp>
#include <iostream>
using namespace LuaCpp::Registry;
using namespace LuaCpp::Engine;
using namespace LuaCpp;

// PART 1
void runBasicLuaCode()
{
    std::cout << "Hi from C++, this is a demo how LuaCpp can be used"
              << std::endl;
    LuaContext lua;

    // The simples way is to use CompileStringAndRun method
    try
    {
        lua.CompileStringAndRun("print('The fastest way to start using lua in a project')");
    }
    catch (std::runtime_error &e)
    {
        std::cout << e.what() << std::endl;
    }
}

// PART 2
void runLuaFile()
{
    LuaContext ctx;

    try
    {
        ctx.CompileFileAndRun("main.lua");
    }
    catch (std::runtime_error &e)
    {
        std::cout << e.what() << std::endl;
    }
}

// PART 3
void passVariablesToAndFromLua()
{
    LuaContext ctx;

    // create a Lua string value in C++
    /*
        You have a lot of different types you can use
        in C++ for Lua

        “LuaTString”: The equivalent of “std::string” in C++.

        “LuaTNumber”: the equivalent of “double” in C++. Lua allows the LUA_TNUMBER (the internal Lua type of number) to be compiled as float, however, LuaCpp will contain to be presented in the C++ context as a double, which means that, in cases where Lua library is customized to define a number as a float, there could be loss of data due to precision.

        “LuaTBoolean”: The equivalent of “bool” in C++.

        “LuaTNil”: a null type that is used by the Lua engine to signify a lack of value.

        “LuaTTable”: a hybrid of array/map, which in C++ is implemented as a “std::map”. The map can have a string or number as a key, and there is a special case when all the keys in the map are of type number, the map represents an array. This follows the logic of the Lua Table implementation.

        “LuaTUserData”: a special type that allows implementation of user-defined types. This is a very powerful type, and the engine’s LuaMetaObject type is implemented based on this primitive type. This concept deserves its own separate article.
     */
    std::shared_ptr<Engine::LuaTString> helloWorld = std::make_shared<Engine::LuaTString>(
        "Hello World!");

    // add the value inside the helloWorld variable into a Lua
    // global variable (world), this will connect the "world"
    // variable in Lua to our helloWorld variable, so if either
    // changes it will reflect in both Lua and our C++ code
    ctx.AddGlobalVariable("world", helloWorld);

    // Will compile lua into "test" string, so whenever we
    // run "test", we'll the the output, almost like a function
    ctx.CompileString("test",
                      "print('Saying '.. world)"
                      // change the world variable
                      "world = 'world from lua!'");

    // Try Catch Block
    try
    {
        // run the "test" string
        ctx.Run("test");
    }
    catch (std::runtime_error &e)
    {
        std::cout << e.what() << std::endl;
    }

    // get the value from our lua string we created
    // it is now changed because we changed it in lua
    std::cout
        << helloWorld->getValue() << std::endl;

    helloWorld->setValue("Cool");
    // is now "cool", since we changed it above
    ctx.CompileStringAndRun("print(world)");
}

int main(int argc, char **argv)
{
    runBasicLuaCode();
    runLuaFile();
    passVariablesToAndFromLua();
}
