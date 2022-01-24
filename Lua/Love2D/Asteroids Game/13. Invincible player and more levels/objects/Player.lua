require "globals"

local love = require "love"

local Lazer = require "objects/Lazer"

function Player(num_lives)
    local SHIP_SIZE = 30
    local EXPLOAD_DUR = 3
    local VIEW_ANGLE = math.rad(90)
    local LAZER_DISTANCE = 0.6
    local MAX_LAZERS = 10
    local USABLE_BLINKS = 10 * 2 -- How many times the ship should blink before becoming vincible again (* 2 since it gets cut in half later)

    return {
        x = love.graphics.getWidth() / 2,
        y = love.graphics.getHeight() / 2,
        radius = SHIP_SIZE / 2,
        angle = VIEW_ANGLE,
        rotation = 0,
        expload_time = 0,
        exploading = false,
        thrusting = false,
        invincible = true, -- if the playes is immortal/invincible
        invincible_seen = true, -- if player is grayed out
        time_blinked = USABLE_BLINKS, -- amount of times player can blink while immortal
        lazers = {},
        thrust = {
            x = 0,
            y = 0,
            speed = 5,
            big_flame = false,
            flame = 2.0
        },
        lives = num_lives or 3,

        draw_flame_thrust = function (self, fillType, color)
            if self.invincible_seen then
                -- make the color seethrough if invisible_seen active
                table.insert(color, 0.5)
            end
            
            love.graphics.setColor(color)

            love.graphics.polygon(
                fillType,
                self.x - self.radius * (2 / 3 * math.cos(self.angle) + 0.5 * math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) - 0.5 * math.cos(self.angle)),
                self.x - self.radius * self.thrust.flame * math.cos(self.angle),
                self.y + self.radius * self.thrust.flame * math.sin(self.angle),
                self.x - self.radius * (2 / 3 * math.cos(self.angle) - 0.5 * math.sin(self.angle)),
                self.y + self.radius * (2 / 3 * math.sin(self.angle) + 0.5 * math.cos(self.angle))
            )
        end,

        shootLazer = function (self)
            if (#self.lazers <= MAX_LAZERS) then
                table.insert(self.lazers, Lazer(
                    self.x + ((4 / 3) * self.radius) * math.cos(self.angle),
                    self.y -  ((4 / 3) * self.radius) * math.sin(self.angle),
                    self.angle
                ))
            end
        end,

        destroyLazer = function (self, index)
            table.remove(self.lazers, index)
        end,

        draw = function (self, faded)
            local opacity = 1
            
            if faded then
                opacity = 0.2
            end

            -- deleted old polygon stuffs and setcolor

            if not self.exploading then
                if self.thrusting then
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

                    self:draw_flame_thrust("fill", {255/255 ,102/255 ,25/255})
                    self:draw_flame_thrust("line", {1, 0.16, 0})
                end
                
                if show_debugging then
                    love.graphics.setColor(1, 0, 0)
    
                    love.graphics.rectangle( "fill", self.x - 1, self.y - 1, 2, 2 )
                    
                    love.graphics.circle("line", self.x, self.y, self.radius)
                end

                -- change opacity depending if player is invisible_seen
                if self.invincible_seen then
                    love.graphics.setColor(1, 1, 1, faded and opacity or 0.5)
                else
                    love.graphics.setColor(1, 1, 1, opacity)
                end

                love.graphics.polygon(
                    "line",
                    self.x + ((4 / 3) * self.radius) * math.cos(self.angle),
                    self.y -  ((4 / 3) * self.radius) * math.sin(self.angle),
                    self.x - self.radius * (2 / 3 * math.cos(self.angle) + math.sin(self.angle)),
                    self.y + self.radius * (2 / 3 * math.sin(self.angle) - math.cos(self.angle)),
                    self.x - self.radius * (2 / 3 * math.cos(self.angle) - math.sin(self.angle)),
                    self.y + self.radius * (2 / 3 * math.sin(self.angle) + math.cos(self.angle))
                )

                for _, lazer in pairs(self.lazers) do
                    lazer:draw(faded)
                end
            else
                love.graphics.setColor(1, 0, 0)
                love.graphics.circle("fill", self.x, self.y, self.radius * 1.5)

                love.graphics.setColor(1, 158/255, 0)
                love.graphics.circle("fill", self.x, self.y, self.radius * 1)

                love.graphics.setColor(1, 234/255, 0)
                love.graphics.circle("fill", self.x, self.y, self.radius * 0.5)
            end
        end,

        drawLives = function (self, faded)
            local opacity = 1

            if faded then
                opacity = 0.2
            end

            if self.lives == 2 then
                love.graphics.setColor(1, 1, 0.5, opacity)
            elseif self.lives == 1 then
                love.graphics.setColor(1, 0.2, 0.2, opacity)
            else
                love.graphics.setColor(1, 1, 1, opacity)
            end
            
            local x_pos, y_pos = 45, 30
            for i = 1, self.lives do
                if self.exploading then
                    if i == self.lives then
                        love.graphics.setColor(1, 0, 0, opacity)
                    end
                end

                love.graphics.polygon(
                    "line",
                    (i * x_pos) + ((4 / 3) * self.radius) * math.cos(VIEW_ANGLE),
                    y_pos -  ((4 / 3) * self.radius) * math.sin(VIEW_ANGLE),
                    (i * x_pos) - self.radius * (2 / 3 * math.cos(VIEW_ANGLE) + math.sin(VIEW_ANGLE)),
                    y_pos + self.radius * (2 / 3 * math.sin(VIEW_ANGLE) - math.cos(VIEW_ANGLE)),
                    (i * x_pos) - self.radius * (2 / 3 * math.cos(VIEW_ANGLE) - math.sin(VIEW_ANGLE)),
                    y_pos + self.radius * (2 / 3 * math.sin(VIEW_ANGLE) + math.cos(VIEW_ANGLE))
                )
            end
        end,

        -- now we take in dt
        movePlayer = function (self, dt)
            -- if player is invisible
            if self.invincible then
                -- decrease availible times blinked
                self.time_blinked = self.time_blinked - dt * 2

                -- on every uneven blink, make the player fully visible
                if math.ceil(self.time_blinked) % 2 == 0 then
                    self.invincible_seen = false
                else
                    self.invincible_seen = true
                end

                -- set invisible to false if time blinked ended
                if self.time_blinked <= 0 then
                    self.invincible = false
                end
            else
                -- reset values to original
                self.time_blinked = USABLE_BLINKS
                self.invincible_seen = false
            end


            self.exploading = self.expload_time > 0

            if not self.exploading then
                local FPS = love.timer.getFPS()
                local friction = 0.7

                self.rotation = 360 / 180 * math.pi / FPS

                if love.keyboard.isDown("a") or love.keyboard.isDown("left") or love.keyboard.isDown("kp4") then
                    self.angle = self.angle + self.rotation
                end
                
                if love.keyboard.isDown("d") or love.keyboard.isDown("right") or love.keyboard.isDown("kp6") then
                    self.angle = self.angle - self.rotation
                end

                if self.thrusting then
                    self.thrust.x = self.thrust.x + self.thrust.speed * math.cos(self.angle) / FPS
                    self.thrust.y = self.thrust.y - self.thrust.speed * math.sin(self.angle) / FPS
                else
                    if self.thrust.x ~= 0 or self.thrust.y ~= 0 then
                        self.thrust.x = self.thrust.x - friction * self.thrust.x / FPS
                        self.thrust.y = self.thrust.y - friction * self.thrust.y / FPS
                    end
                end

                self.x = self.x + self.thrust.x
                self.y = self.y + self.thrust.y

                if self.x + self.radius < 0 then
                    self.x = love.graphics.getWidth() + self.radius
                elseif self.x - self.radius > love.graphics.getWidth() then
                    self.x = -self.radius
                end

                if self.y + self.radius < 0 then
                    self.y = love.graphics.getHeight() + self.radius
                elseif self.y - self.radius > love.graphics.getHeight() then
                    self.y = -self.radius
                end
            end

            for index, lazer in pairs(self.lazers) do
                if (lazer.distance > LAZER_DISTANCE * love.graphics.getWidth()) and (lazer.exploading == 0) then
                    lazer:expload()
                end
                
                if lazer.exploading == 0 then
                    lazer:move()
                elseif lazer.exploading == 2 then
                    self.destroyLazer(self, index)
                end
            end
        end,

        expload = function (self) -- player can now expload
            self.expload_time = math.ceil(EXPLOAD_DUR * love.timer.getFPS())
        end
    }
end

return Player