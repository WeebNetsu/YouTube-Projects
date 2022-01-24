local love = require "love"

local Player = require "objects/Player"
local Game = require "states/Game"

function love.load()
    love.mouse.setVisible(false)
    mouse_x, mouse_y = 0, 0

    local show_debugging = true
    
    player = Player(show_debugging)
    game = Game()
end

-- KEYBINDINGS --
function love.keypressed(key)
    if game.state.running then -- only accept this if the game state is running
        if key == "w" or key == "up" or key == "kp8" then
            player.thrusting = true
        end

        -- allows us to pause the game
        if key == "escape" then
            game:changeGameState("paused")
        end
    elseif game.state.paused then -- if game is paused
        if key == "escape" then -- allows us to unpause
            game:changeGameState("running")
        end
    end
end

function love.keyreleased(key)
    if key == "w" or key == "up" or key == "kp8" then
        player.thrusting = false
    end
end
-- KEYBINDINGS --

function love.update(dt)
    mouse_x, mouse_y = love.mouse.getPosition()

    if game.state.running then -- only execute below if game is running
        player:movePlayer()
    end
end

function love.draw()
    player:draw()

    love.graphics.setColor(1, 1, 1, 1)
    
    love.graphics.print(love.timer.getFPS(), 10, 10)
end