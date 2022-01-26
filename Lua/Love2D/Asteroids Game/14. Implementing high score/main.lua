require "globals"

local love = require "love"

local Player = require "objects/Player"
local Game = require "states/Game"
local Menu = require "states/Menu"
local resetComplete = false -- if game needs to be reset

math.randomseed(os.time())

-- this will both fix a bug (where we restart where we left off)
-- and allow us to reset all game stuff
function reset()
    local save_data = readJSON("save")

    player = Player(3)
    game = Game(save_data)
    menu = Menu(game, player)
    destroy_ast = false
end

function love.load()
    love.mouse.setVisible(false)

    mouse_x, mouse_y = 0, 0
    
    reset()
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
        else
            clickedMouse = true
        end
    end
end
-- KEYBINDINGS --

function love.update(dt)
    mouse_x, mouse_y = love.mouse.getPosition()

    if game.state.running then
        player:movePlayer(dt)

        for ast_index, asteroid in pairs(asteroids) do
            if not player.exploading and not player.invincible then
                if calculateDistance(player.x, player.y, asteroid.x, asteroid.y) < player.radius + asteroid.radius then
                    player:expload()
                    destroy_ast = true
                end
            else
                player.expload_time = player.expload_time - 1
    
                if player.expload_time == 0 then
                    if player.lives - 1 <= 0 then
                        game:changeGameState("ended")
                        return
                    end
                    player = Player(player.lives - 1)
                end
            end

            for _, lazer in pairs(player.lazers) do
                if calculateDistance(lazer.x, lazer.y, asteroid.x, asteroid.y) < asteroid.radius then
                    lazer:expload()
                    asteroid:destroy(asteroids, ast_index, game)
                end
            end

            if destroy_ast then
                if player.lives - 1 <= 0 then
                    if player.expload_time == 0 then
                        destroy_ast = false
                        asteroid:destroy(asteroids, ast_index, game)
                    end
                else
                    destroy_ast = false
                    asteroid:destroy(asteroids, ast_index, game)
                end
            end

            asteroid:move(dt)
        end

        if #asteroids == 0 then
            game.level = game.level + 1
            game:startNewGame(player)
        end
    elseif game.state.menu then
        menu:run(clickedMouse)
        clickedMouse = false

        -- this will reset everything to original state
        if not resetComplete then
            reset()
            resetComplete = true
        end
    elseif game.state.ended then
        -- we should reset the game
        resetComplete = false
    end
end

function love.draw()
    if game.state.running or game.state.paused then
        player:drawLives(game.state.paused)
        player:draw(game.state.paused)

        for _, asteroid in pairs(asteroids) do
            asteroid:draw(game.state.paused)
        end

        game:draw(game.state.paused)
    elseif game.state.menu then
        menu:draw()
    elseif game.state.ended then
        game:draw()
    end


    love.graphics.setColor(1, 1, 1, 1)
    
    if not game.state.running then
        love.graphics.circle("fill", mouse_x, mouse_y, 10)
    end

    love.graphics.print(love.timer.getFPS(), 10, 10)
end