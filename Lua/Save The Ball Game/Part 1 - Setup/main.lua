local love = require "love"

-- to give us new random values on every game start
math.randomseed(os.time())

local game = { -- create a game object/table to set some of the states
    state = { -- state of the game will determaine what to show
        menu = true,
        paused = false,
        running = false,
        ended = false
    },
}

local player = { -- this is the player object
    radius = 20, -- the player is a circle, and this determains the player size
    x = 30, -- player x pos
    y = 30 -- y pos
}

function love.load()
    love.mouse.setVisible(false) -- makes mouse invisible (since the players character is the mouse)
    love.window.setTitle("Save the Ball!") -- set the title from inside load, can also be done inside conf
end

function love.update(dt)
    player.x, player.y = love.mouse.getPosition() -- set the player position based on the cursor/mouse position
end

function love.draw()
    -- so we can look at the FPS we're getting. This is optional
    love.graphics.printf("FPS: " .. love.timer.getFPS(), love.graphics.newFont(16), 10, love.graphics.getHeight() - 30, love.graphics.getWidth())

    if game.state["running"] then -- only execute if the game state is running
        love.graphics.circle("fill", player.x, player.y, player.radius) -- draw the player
    end

    if not game.state["running"] then -- only execute if the game state is NOT running
        love.graphics.circle("fill", player.x, player.y, player.radius / 2) -- draw the player half the size
    end
end