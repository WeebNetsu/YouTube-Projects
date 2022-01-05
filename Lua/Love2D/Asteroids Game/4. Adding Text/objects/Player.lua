local love = require "love"

function Player(debugging)
    local SHIP_SIZE = 30
    local VIEW_ANGLE = math.rad(90)

    debugging = debugging or false

    return {
        x = love.graphics.getWidth() / 2,
        y = love.graphics.getHeight() / 2,
        radius = SHIP_SIZE / 2,
        angle = VIEW_ANGLE, -- angle gets calculated as radian
        rotation = 0,
        thrusting = false,
        thrust = {
            x = 0,
            y = 0,
            speed = 5,
            big_flame = false, -- this will change flame size
            flame = 2.0 -- this will help with animation
        },

        -- below will draw the flame behind the ship whenever we move
        draw_flame_thrust = function (self, fillType, color)
            love.graphics.setColor(color)

            love.graphics.polygon(
                fillType, -- flame outside ship
                -- the 4 / 3 and 2 / 3 is to find the center of the triangle correctly
                self.x - self.radius * (2 / 3 * math.cos(self.angle) + 0.5 * math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) - 0.5 * math.cos(self.angle)),
                self.x - self.radius * self.thrust.flame * math.cos(self.angle),
                self.y + self.radius * self.thrust.flame * math.sin(self.angle),
                self.x - self.radius * (2 / 3 * math.cos(self.angle) - 0.5 * math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) + 0.5 * math.cos(self.angle))
            )
        end,

        draw = function (self)
            local opacity = 1

            if self.thrusting then -- only show the flame whenever we thrust forwards
                -- create flame resizing animation
                if not self.thrust.big_flame then
                    self.thrust.flame = self.thrust.flame - 1 / love.timer.getFPS()

                    if self.thrust.flame < 1.5 then
                        self.thrust.big_flame = true
                    end
                else
                    self.thrust.flame = self.thrust.flame + 1 / love.timer.getFPS()

                    if self.thrust.flame > 2.5 then
                        self.thrust.big_flame = false
                    end
                end

                self:draw_flame_thrust("fill", {255/255 ,102/255 ,25/255}) -- draw flame thrust
                self:draw_flame_thrust("line", {1, 0.16, 0}) -- flame thrust outline
            end
            
            if debugging then
                love.graphics.setColor(1, 0, 0)

                love.graphics.rectangle( "fill", self.x - 1, self.y - 1, 2, 2 ) -- shows center of triangle
                
                love.graphics.circle("line", self.x, self.y, self.radius) -- the hitbox of the ship
            end

            love.graphics.setColor(1, 1, 1, opacity)

            love.graphics.polygon(
                "line",
                self.x + ((4 / 3) * self.radius) * math.cos(self.angle),
                self.y -  ((4 / 3) * self.radius) * math.sin(self.angle),
                self.x - self.radius * (2 / 3 * math.cos(self.angle) + math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) - math.cos(self.angle)),
                self.x - self.radius * (2 / 3 * math.cos(self.angle) - math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) + math.cos(self.angle))
            )
        end,

        movePlayer = function (self)
            local FPS = love.timer.getFPS()
            local friction = 0.7 -- 0 = no friction

            -- basically turn 360 deg every second
            self.rotation = 360 / 180 * math.pi / FPS

            if love.keyboard.isDown("a") or love.keyboard.isDown("left") or love.keyboard.isDown("kp4") then -- rotate left
                self.angle = self.angle + self.rotation
            end
            
            if love.keyboard.isDown("d") or love.keyboard.isDown("right") or love.keyboard.isDown("kp6") then -- rotate right
                self.angle = self.angle - self.rotation
            end

            if self.thrusting then
                self.thrust.x = self.thrust.x + self.thrust.speed * math.cos(self.angle) / FPS
                self.thrust.y = self.thrust.y - self.thrust.speed * math.sin(self.angle) / FPS
            else
                -- applies friction to stop the ship
                if self.thrust.x ~= 0 or self.thrust.y ~= 0 then
                    self.thrust.x = self.thrust.x - friction * self.thrust.x / FPS
                    self.thrust.y = self.thrust.y - friction * self.thrust.y / FPS
                end
            end

            self.x = self.x + self.thrust.x
            self.y = self.y + self.thrust.y

            -- make sure the ship can't go off screen on x axis
            if self.x + self.radius < 0 then
                self.x = love.graphics.getWidth() + self.radius
            elseif self.x - self.radius > love.graphics.getWidth() then
                self.x = -self.radius
            end

            -- make sure the ship can't go off screen on y axis
            if self.y + self.radius < 0 then
                self.y = love.graphics.getHeight() + self.radius
            elseif self.y - self.radius > love.graphics.getHeight() then
                self.y = -self.radius
            end
        end
    }
end

return Player