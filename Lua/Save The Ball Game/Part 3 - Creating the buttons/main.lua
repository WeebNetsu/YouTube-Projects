local love = require "love"
local enemy = require "Enemy"
local button = require "Button"

math.randomseed(os.time())

local game = {
    difficulty = 1,
    state = {
        menu = true, -- so we can see the menu
        paused = false,
        running = false,
        ended = false
    },
}

local player = {
    radius = 20,
    x = 30,
    y = 30
}

local buttons = { -- basically a button default
    menu_state = {}, -- all the buttons that should be displayed when the menu is shown
}

local enemies = {}

local function startNewGame()
    game.state["menu"] = false -- we're no longer in the menu, make it false
    game.state["running"] = true -- we're now in the running phase, make it true

    table.insert(enemies, 1, enemy()) -- the enemy gets inserted in here now
end

function love.mousepressed(x, y, button, istouch, presses) -- if mouse is pressed, touch support for mobile can be given here as well
    if not game.state["running"] then -- if game state is not running
        if button == 1 then -- and the left mouse button is clicked
            if game.state["menu"] then -- if the state is menu
                for index in pairs(buttons.menu_state) do -- check if one of the buttons were pressed
                    buttons.menu_state[index]:checkPressed(x, y, player.radius) -- do your thing if pressed, otherwise ignore
                end
            end
        end
    end
end

function love.load()
    love.mouse.setVisible(false)
    love.window.setTitle("Save the Ball!")

    buttons.menu_state.play_game = button("Play Game", startNewGame, nil, 120, 40) -- play game button
    buttons.menu_state.settings = button("Settings", nil, nil, 120, 40) -- settings button
    buttons.menu_state.exit_game = button("Exit Game", love.event.quit, nil, 120, 40) -- exit game button

    -- we removed the enemy here, since it will now be created in startnewgame()
end

function love.update(dt)
    player.x, player.y = love.mouse.getPosition()

    if game.state["running"] then -- so the enemies don't chase you while in the menu
        for i = 1, #enemies do
            enemies[i]:move(player.x, player.y)
        end
    end
end

function love.draw()
    love.graphics.printf("FPS: " .. love.timer.getFPS(), love.graphics.newFont(16), 10, love.graphics.getHeight() - 30, love.graphics.getWidth())

    if game.state["running"] then
        for i = 1, #enemies do
            enemies[i]:draw()
        end

        love.graphics.circle("fill", player.x, player.y, player.radius)
    elseif game.state["menu"] then -- if we're at the menu, draw the buttons
        buttons.menu_state.play_game:draw(10, 20, 17, 10)
        buttons.menu_state.settings:draw(10, 70, 17, 10)
        buttons.menu_state.exit_game:draw(10, 120, 17, 10)
    end

    if not game.state["running"] then
        love.graphics.circle("fill", player.x, player.y, player.radius / 2)
    end
end