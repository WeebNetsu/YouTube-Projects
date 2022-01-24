local love = require "love"

local Text = require "../components/Text"
local Asteroids = require "../objects/Asteroids"

function Game(save_data)
    return {
        level = 1,
        state = {
            menu = true,
            paused = false,
            running = false,
            ended = false
        },
        score = 0, -- set initial score on game start
        high_score = save_data.high_score or 0, -- saved high score

        changeGameState = function (self, state)
            self.state.menu = state == "menu"
            self.state.paused = state == "paused"
            self.state.running = state == "running"
            self.state.ended = state == "ended"
        end,

        draw = function (self, faded)
            local opacity = 1 -- set opacity to 1
            
            if faded then -- new if faded opacity
                opacity = 0.2
            end

            -- Text that should always be on screen when in game state
            Text( -- show user score
                "SCORE: " .. self.score,
                -20,
                10,
                "h4",
                false,
                false,
                love.graphics.getWidth(),
                "right",
                faded and opacity or 0.6 -- if faded, use provided opacity, otherwise 0.6
            ):draw()

            Text( -- show user high score
                "HIGH SCORE: " .. self.high_score,
                0,
                10,
                "h5",
                false,
                false,
                love.graphics.getWidth(),
                "center",
                faded and opacity or 0.5
            ):draw()

            if faded then
                Text(
                    "PAUSED",
                    0,
                    love.graphics.getHeight() * 0.4,
                    "h1",
                    false,
                    false,
                    love.graphics.getWidth(),
                    "center",
                    1
                ):draw()
            end
        end,

        startNewGame = function (self, player)
            self:changeGameState("running")
        
            asteroids = {}
        
            local as_x = math.floor(math.random(love.graphics.getWidth()))
            local as_y = math.floor(math.random(love.graphics.getHeight()))
    
            table.insert(asteroids, 1, Asteroids(as_x, as_y, 100, self.level, true))
        end
    }
end

return Game