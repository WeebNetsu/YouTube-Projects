---@diagnostic disable: lowercase-global
-- https://www.gameart2d.com/red-hat-boy-free-sprites.html (sprites)
-- Sprite made with https://codeshack.io/images-sprite-sheet-generator/

function love.load()
    character = {
        sprite = love.graphics.newImage("sprites/spritesheet.png"), -- load in an image
        x = 0,
        y = 0
    }

     SPRITE_WIDTH, SPRITE_HEIGHT = 5352, 569
     QUAD_WIDTH, QUAD_HEIGHT = 669, SPRITE_HEIGHT -- Quad height is the same as sprite height
    -- Note: depending on your sprite, the QUAD_HEIGHT may NOT be the same as the SPRITE_HEIGHT

    -- NOTE: we want to do the quads inside the .load function so it doesn't get made repeatedly as
    -- The game loop runs

    -- newQuad(x, y, width, height, sprite_width, sprite_height)
    -- We create a quad for every part of the sprite (every moving frame)
    --[[ love.graphics.newQuad(0, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 2, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 3, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 4, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 5, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 6, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    love.graphics.newQuad(QUAD_WIDTH * 7, 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT) ]]

    quads = {}

    -- We can do the above in a for loop instead
    for i = 1, 8 do
        quads[i] = love.graphics.newQuad(QUAD_WIDTH * (i - 1), 0, QUAD_WIDTH, QUAD_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)
    end

    animation = { -- you don't have to create a table, but I find it easier
        direction = "right", -- what direction is the player facing
        iteration = 1, -- what frame
        MAX_ITERATION = 8, -- max frames
        idle = true, -- is the character standing still
        timer = 0.1, -- determains when to change character frame
        speed = 15 -- how fast the character moves
    }
end

function love.update(dt)
    if not animation.idle then
        animation.timer = animation.timer + dt
        if animation.timer > 0.2 then
            animation.timer = 0.1

            animation.iteration = animation.iteration + 1

            if love.keyboard.isDown("d") then
                character.x = character.x + animation.speed
            elseif love.keyboard.isDown("a") then
                character.x = character.x - animation.speed
            end

            if animation.iteration > animation.MAX_ITERATION then
                animation.iteration = 1
            end
        end        
    end
end

function love.keypressed(key)
    -- if you used the arrow keys you could've done:
    -- if quads[key] then animation.direction = key end
    if key == "d" then
        animation.direction = "right"

    elseif key == "a" then
        animation.direction = "left"
    end

    animation.idle = false
end

function love.keyreleased(key) -- if a key was stopped being pressed
    animation.idle = true
    animation.iteration = 1
end

function love.draw()
    love.graphics.scale(0.3) -- the sprite was a bit large, so I scaled it to a resonable size

    -- draw(image, quad, x, y, rotation, idk (default = 1), idk2 (default = 2), QUAD_WIDTH, QUAD_HEIGHT)
    if animation.direction == "right" then
        love.graphics.draw(character.sprite, quads[animation.iteration], character.x, character.y)
    else
        -- since we're not modifying the quad height (-1 - x(width), 1 - y(heigth)) we don't have to specify
        -- The quad height, but we can if we want to
        love.graphics.draw(character.sprite, quads[animation.iteration], character.x, character.y, 0, -1, 1, QUAD_WIDTH, 0)
    end
end