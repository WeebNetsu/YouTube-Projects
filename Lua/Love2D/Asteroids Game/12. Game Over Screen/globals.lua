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
 function readJSON(file_name) -- added a method to read json
    local file = io.open("src/data/" .. file_name .. ".json", "r")
    local data = file:read("*all")
    file:close()

    return lunajson.decode(data)
end