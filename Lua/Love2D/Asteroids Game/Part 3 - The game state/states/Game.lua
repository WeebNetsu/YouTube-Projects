function Game()
    return {
        state = { -- will store game state
            menu = false,
            paused = false,
            running = true,
            ended = false
        },

        -- will allow to change game state
        changeGameState = function (self, state)
            self.state.menu = state == "menu"
            self.state.paused = state == "paused"
            self.state.running = state == "running"
            self.state.ended = state == "ended"
        end,
    }
end

return Game