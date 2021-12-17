local love = require "love"
local enemy = require "Enemy"
local button = require "Button"

math.randomseed(os.time())

local game = {
    difficulty = 1,
    state = {
        menu = true,
        paused = false,
        running = false,
        ended = false
    },
    -- these are the amount of points the user has gained
    -- this could optionally also fall under the player table
    points = 0,
    -- these levels will determain when new/more enemies will appear
    -- it's point based
    levels = {15, 30, 60, 120}
}

local player = {
    radius = 20,
    x = 30,
    y = 30
}

local buttons = {
    menu_state = {},
}

local enemies = {}

-- this function will allow us to change the game state more safely
-- since we won't be setting the and then maybe accidentally leaving a state as true
local function changeGameState(state)
    game.state["menu"] = state == "menu"
    game.state["paused"] = state == "paused"
    game.state["running"] = state == "running"
    game.state["ended"] = state == "ended"
end

local function startNewGame()
    changeGameState("running") -- we now change the game state like this
    game.points = 0 -- reset all the points

    enemies = { -- remove all the enemies and add a new enemy
        enemy(1) -- we now pass in 1 into enemy to specify level 1
    } 
end

function love.mousepressed(x, y, button, istouch, presses)
    if not game.state["running"] then
        if button == 1 then
            if game.state["menu"] then
                for index in pairs(buttons.menu_state) do
                    buttons.menu_state[index]:checkPressed(x, y, player.radius)
                end
            end
        end
    end
end

function love.load()
    love.mouse.setVisible(false)
    love.window.setTitle("Save the Ball!")

    buttons.menu_state.play_game = button("Play Game", startNewGame, nil, 120, 40)
    buttons.menu_state.settings = button("Settings", nil, nil, 120, 40)
    buttons.menu_state.exit_game = button("Exit Game", love.event.quit, nil, 120, 40)
end

function love.update(dt)
    player.x, player.y = love.mouse.getPosition()

    if game.state["running"] then
        for i = 1, #enemies do

            -- check if enemies colided with the player
            if not enemies[i]:checkTouched(player.x, player.y, player.radius) then
                -- if not, then move the enemies
                enemies[i]:move(player.x, player.y)

                -- generate more enemies, this will create an enemy for every level set up
                -- in game.levels
                for i = 1, #game.levels do
                    if math.floor(game.points) == game.levels[i] then
                        table.insert(enemies, 1, enemy(game.difficulty * (i + 1)))
                        game.points = game.points + 1 -- give the player a full point if they reach a new level (bonus point, also avoids bug)
                    end
                end
            else
                -- if the enemy touched the player, then change the state
                changeGameState("menu")
            end
        end

        game.points = game.points + dt -- increase the points with dt every update
    end
end

function love.draw()
    love.graphics.printf("FPS: " .. love.timer.getFPS(), love.graphics.newFont(16), 10, love.graphics.getHeight() - 30, love.graphics.getWidth())

    if game.state["running"] then
        -- now display the amount of points the user has gained up until now
        love.graphics.printf(math.floor(game.points), love.graphics.newFont(24), 0, 10, love.graphics.getWidth(), "center")

        for i = 1, #enemies do
            enemies[i]:draw()
        end

        love.graphics.circle("fill", player.x, player.y, player.radius)
    elseif game.state["menu"] then
        buttons.menu_state.play_game:draw(10, 20, 17, 10)
        buttons.menu_state.settings:draw(10, 70, 17, 10)
        buttons.menu_state.exit_game:draw(10, 120, 17, 10)
    end

    if not game.state["running"] then
        love.graphics.circle("fill", player.x, player.y, player.radius / 2)
    end
end