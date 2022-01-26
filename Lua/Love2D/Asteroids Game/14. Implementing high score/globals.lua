local lunajson = require 'lunajson' -- luarocks install lunajson
-- NOTE might have to add eval "$(luarocks path --bin)" for luarocks to work
-- this also requires lua5.3 (not 5.4 or up)

ASTEROID_SIZE = 100
show_debugging = false
destroy_ast = false

function calculateDistance(x1, y1, x2, y2)
    return math.sqrt(((x2 - x1) ^ 2) + ((y2 - y1) ^ 2))
end

--[[ 
    DESCRIPTION
    Read a json file and return the contents as a lua table. This function will automatically search inside the data/ folder and add a '.json' to the file name.

    PARAMETERS
    -> file_name: string - name of file to read (required)
        example: "save"
        description: Will search for 'data/save.json'
 ]]
 function readJSON(file_name)
    local file = io.open("src/data/" .. file_name .. ".json", "r")
    local data = file:read("*all")
    file:close()

    return lunajson.decode(data)
end

--[[ 
    DESCRIPTION
    Convert a table to JSON and save it in a file. This will overwrite the file if it already exists. This function will automatically search inside the data/ folder and add a '.json' to the file name.

    PARAMETERS
    -> file_name: string - name of file to write to (required)
        example: "save"
        NB: Will search for 'data/save.json'
    -> data: table - table to be converted to JSON and saved. (required)
        example: { name = "max" }
 ]]
 function writeJSON(file_name, data)  -- added a method to write json
    print(lunajson.encode(data))
    local file = io.open("src/data/" .. file_name .. ".json", "w")
    file:write(lunajson.encode(data))
    file:close()
end