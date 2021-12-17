local love = require "love"

function Enemy()
    -- basically throw a dice to see where the player should come from (from what side)
    local dice = math.random(1, 4)
    local _x, _y -- this x and y will be the side it comes from
    local _radius = 20 -- this is the radius of the enemy

    if dice == 1 then -- come from above
        _x = math.random(_radius, love.graphics.getWidth()) -- get a random location on the x axis
        _y = -_radius * 4 -- where to start from the y axis (4 * the enemy radius, to give it time to appear and move)
    elseif dice == 2 then -- come from the left
        _x = -_radius * 4
        _y = math.random(_radius, love.graphics.getHeight())
    elseif dice == 3 then -- come from the bottom
        _x = math.random(_radius, love.graphics.getWidth())
        _y = love.graphics.getHeight() + (_radius * 4)
    else -- come from the right
        _x = love.graphics.getWidth() + (_radius * 4)
        _y = math.random(_radius, love.graphics.getHeight())
    end

    return { -- return a table with enemy functions and data
        level = 1, -- the level will basically say how fast the enemy should move
        radius = _radius, -- set enemy radius
        x = _x, -- set enemy x pos
        y = _y, -- set enemy y pos

        move = function (self, player_x, player_y) -- move the enemy towards the player
            -- move to in player x pos
            if player_x - self.x > 0 then
                self.x = self.x + self.level
            elseif player_x - self.x < 0 then
                self.x = self.x - self.level
            end
         
            -- move to player y pos
            if player_y - self.y > 0 then
                self.y = self.y + self.level
            elseif player_y - self.y < 0 then
                self.y = self.y - self.level
            end
        end,

        draw = function (self) -- draw enemy
            -- set the color to white
            love.graphics.setColor(1, 0.5, 0.7)
            -- draw a circle (the enemy)
            love.graphics.circle("fill", self.x, self.y, self.radius)

            -- reset the color back to white
            love.graphics.setColor(1, 1, 1)
        end,
    }
end

return Enemy