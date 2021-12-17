local love = require "love"
local enemy = require "Enemy" -- get our enemy module

math.randomseed(os.time())

local game = {
    difficulty = 1, -- to set the game difficulty
    state = {
        menu = false,
        paused = false,
        running = true, -- the enemy should only move if running is true
        ended = false
    },
}

local player = {
    radius = 20,
    x = 30,
    y = 30
}

local enemies = {} -- this is where all the enemies we create will be stored in

function love.load()
    love.mouse.setVisible(false)
    love.window.setTitle("Save the Ball!")

    table.insert(enemies, 1, enemy()) -- this will insert 1 enemy for us into the table at position 1
end

function love.update(dt)
    player.x, player.y = love.mouse.getPosition()

    for i = 1, #enemies do -- so we can update all the enemies
        enemies[i]:move(player.x, player.y) -- move the enemies towards the player
    end
end

function love.draw()
    love.graphics.printf("FPS: " .. love.timer.getFPS(), love.graphics.newFont(16), 10, love.graphics.getHeight() - 30, love.graphics.getWidth())

    if game.state["running"] then
        for i = 1, #enemies do -- draw all the enemies
            enemies[i]:draw() -- every enemy has its own draw function
        end

        love.graphics.circle("fill", player.x, player.y, player.radius)
    end

    if not game.state["running"] then
        love.graphics.circle("fill", player.x, player.y, player.radius / 2)
    end
end