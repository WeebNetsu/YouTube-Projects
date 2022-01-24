local love = require "love"

function Lazer(x, y, angle)
    local LAZER_SPEED = 500 -- lazer speed in pixel/second
   
    return {
        x = x,
        y = y,
        x_vel = LAZER_SPEED * math.cos(angle) / love.timer.getFPS(),
        y_vel = -LAZER_SPEED * math.sin(angle) / love.timer.getFPS(),
        distance = 0, -- distance traveled

        draw = function (self, faded)
            local opacity = 1
            
            if faded then
                opacity = 0.2
            end

            love.graphics.setColor(1, 1, 1, opacity)
            -- set size of points in px (or dpi, idk)
            love.graphics.setPointSize(3)
            -- put point on screen
            love.graphics.points(self.x, self.y)
        end,

        move = function (self)
            self.x = self.x + self.x_vel
            self.y = self.y + self.y_vel

            -- if the lazers go off screen, bring them back
            if self.x < 0 then
                self.x = love.graphics.getWidth()
            elseif self.x > love.graphics.getWidth() then
                self.x = 0
            end

            if self.y < 0 then
                self.y = love.graphics.getHeight()
            elseif self.y > love.graphics.getHeight() then
                self.y = 0
            end

            -- increase the distance traveled
            self.distance = self.distance + math.sqrt((self.x_vel ^ 2) + (self.y_vel ^ 2))
        end,
    }
end

return Lazer