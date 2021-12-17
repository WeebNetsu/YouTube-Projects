local love = require "love"

function Button(text, func, func_param, width, height)
    return { -- return table
        width = width or 100, -- button width
        height = height or 100, -- button height
        -- the function that should be called when button is pressed
        func = func or function() print("This button has no function attached") end,
        -- function parameter that should be passed in when function is called
        func_param = func_param,
        text = text or "No Text", -- text to be displayed on the button
        button_x = 0, -- button x/y position
        button_y = 0, -- button x/y position
        text_x = 0, -- text x/y position
        text_y = 0, -- text x/y position

        checkPressed = function (self, mouse_x, mouse_y, cursor_radius) -- check if button is pressed
            -- if the mouse x pos + it's radious (because player is a ball) fits into the button, then it is selected and can be pressed
            if (mouse_x + cursor_radius >= self.button_x) and (mouse_x - cursor_radius <= self.button_x + self.width) then
                if (mouse_y + cursor_radius >= self.button_y) and (mouse_y - cursor_radius <= self.button_y + self.height) then
                    -- execute the passed in function with/without parameter
                    if self.func_param then
                        self.func(self.func_param)
                    else
                        self.func()
                    end
                end
            end
        end,

        draw = function (self, button_x, button_y, text_x, text_y) -- draw the button
            self.button_x = button_x or self.button_x -- set the button at it's x/y position
            -- the above and below steps are important for the checkPressed method as well
            self.button_y = button_y or self.button_y -- set the button at it's x/y position
        
            if text_x then -- set text x position
                self.text_x = text_x + self.button_x
            else
                self.text_x = self.button_x
            end
        
            if text_y then -- set text y position
                self.text_y = text_y + self.button_y
            else
                self.text_y = self.button_y
            end
        
            -- NOTE: The drawing order is important
            love.graphics.setColor(0.6, 0.6, 0.6) -- set button color
            -- draw button
            love.graphics.rectangle("fill", self.button_x, self.button_y, self.width, self.height)
        
            love.graphics.setColor(0, 0, 0) -- set text color
            -- draw text
            love.graphics.print(self.text, self.text_x, self.text_y)
        
            love.graphics.setColor(1, 1, 1) -- reset the colors
        end,
    }
end

return Button