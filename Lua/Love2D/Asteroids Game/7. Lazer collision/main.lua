require "globals" -- we now require a globals file

local love = require "love"

local Player = require "objects/Player"
local Game = require "states/Game"

math.randomseed(os.time())

function love.load()
    love.mouse.setVisible(false)
    mouse_x, mouse_y = 0, 0
    
    player = Player() -- removed show_debugging
    game = Game()
    game:startNewGame(player)
end

-- KEYBINDINGS --
function love.keypressed(key)
    if game.state.running then
        if key == "w" or key == "up" or key == "kp8" then
            player.thrusting = true
        end

        if key == "space" or key == "down" or key == "kp5" then
            player:shootLazer()
        end

        if key == "escape" then
            game:changeGameState("paused")
        end
    elseif game.state.paused then
        if key == "escape" then
            game:changeGameState("running")
        end
    end
end

function love.keyreleased(key)
    if key == "w" or key == "up" or key == "kp8" then
        player.thrusting = false
    end
end

function love.mousepressed(x, y, button, istouch, presses)
    if button == 1 then
        if game.state.running then
            player:shootLazer()
        end
    end
end
-- KEYBINDINGS --

function love.update(dt)
    mouse_x, mouse_y = love.mouse.getPosition()

    if game.state.running then
        player:movePlayer()

        for ast_index, asteroid in pairs(asteroids) do
            -- we new check to see for lazer collision detection
            for _, lazer in pairs(player.lazers) do
                if calculateDistance(lazer.x, lazer.y, asteroid.x, asteroid.y) < asteroid.radius then
                    lazer:expload() -- delete lazer
                    asteroid:destroy(asteroids, ast_index, game)
                end
            end

            asteroid:move(dt)
        end
    end
end

function love.draw()
    if game.state.running or game.state.paused then
        player:draw(game.state.paused)

        for _, asteroid in pairs(asteroids) do
            asteroid:draw(game.state.paused)
        end

        game:draw(game.state.paused)
    end


    love.graphics.setColor(1, 1, 1, 1)

    love.graphics.print(love.timer.getFPS(), 10, 10)
end