cmake_minimum_required(VERSION 3.0)

set(CMAKE_BUILD_TYPE Debug)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

project(banking_app)

add_executable(
	output 
	main.cpp
	Bank.cpp
	Bank.h
	User.cpp
	User.h
)