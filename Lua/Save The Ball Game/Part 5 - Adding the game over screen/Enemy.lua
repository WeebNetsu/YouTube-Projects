local love = require "love"

function Enemy(level) -- we now take in the enemy level
    local dice = math.random(1, 4)
    local _x, _y
    local _radius = 20

    if dice == 1 then -- come from above --
        _x = math.random(_radius, love.graphics.getWidth())
        _y = -_radius * 4
    elseif dice == 2 then -- come from the left --
        _x = -_radius * 4
        _y = math.random(_radius, love.graphics.getHeight())
    elseif dice == 3 then -- come from the bottom --
        _x = math.random(_radius, love.graphics.getWidth())
        _y = love.graphics.getHeight() + (_radius * 4)
    else -- come from the right --
        _x = love.graphics.getWidth() + (_radius * 4)
        _y = math.random(_radius, love.graphics.getHeight())
    end

    return {
        -- we set the enemy level to whatever is passed in, this will make the enemy faster the higher the level
        level = level,
        radius = _radius,
        x = _x,
        y = _y,

        checkTouched = function (self, player_x, player_y, cursor_radius) -- collision detection with the player
            -- below will detect if the enemy is anywhere near the player
            return math.sqrt((self.x - player_x) ^ 2 + (self.y - player_y) ^ 2) <= cursor_radius * 2
        end,

        move = function (self, player_x, player_y)
            if player_x - self.x > 0 then
                self.x = self.x + self.level
            elseif player_x - self.x < 0 then
                self.x = self.x - self.level
            end
         
            if player_y - self.y > 0 then
                self.y = self.y + self.level
            elseif player_y - self.y < 0 then
                self.y = self.y - self.level
            end
        end,

        draw = function (self)
            love.graphics.setColor(1, 0.5, 0.7)
            love.graphics.circle("fill", self.x, self.y, self.radius)

            love.graphics.setColor(1, 1, 1)
        end,
    }
end

return Enemy