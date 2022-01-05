local love = require "love"

--[[
    PARAMETERS:
    -> text: string - text to be displayed (required)
    -> x: number - x position of text (required)
    -> y: number - y position of text (required)
    -> font_size: string (optional)
        default: "p"
        options: "h1"-"h6", "p"
    -> fade_in: boolean - Should text fade in (optional)
        default: false
    -> fade_out: boolean - Should text fade in (optional)
        default: false
    -> wrap_width: number - Whe should text break (optional)
        default: love.graphics.getWidth() [window width]
    -> align: string - Align text to location (optional)
    -> opacity: number (optional)
        default: 1
        options: 0.1 - 1
        NB: Setting fade_in = true will overwrite this to 0.1
 ]]
 function Text(text, x, y, font_size, fade_in, fade_out, wrap_width, align, opacity)
    font_size = font_size or "p"
    fade_in = fade_in or false
    fade_out = fade_out or false
    wrap_width = wrap_width or love.graphics.getWidth()
    align = align or "left"
    opacity = opacity or 1
    
    local TEXT_FADE_DUR = 5

    local fonts = {
        h1 = love.graphics.newFont(60),
        h2 = love.graphics.newFont(50),
        h3 = love.graphics.newFont(40),
        h4 = love.graphics.newFont(30),
        h5 = love.graphics.newFont(20),
        h6 = love.graphics.newFont(10),
        p = love.graphics.newFont(16),
    }

    if fade_in then
        opacity = 0.1 -- if should fade in, then start at low opacity
    end

    return {
        text = text,
        x = x,
        y = y,
        opacity = opacity,

        colors = {
            r = 1,
            g = 1,
            b = 1
        },

        setColor = function (self, red, green, blue)
            self.colors.r = red
            self.colors.g = green
            self.colors.b = blue
        end,
        
        draw = function (self, tbl_text, index)
            if self.opacity > 0 then
                -- when pausing, the below will still fade out, it will not be paused
                if fade_in then
                    -- only render text if visible, otherwise skip it
                    if self.opacity < 1 then
                        self.opacity = self.opacity + (1 / TEXT_FADE_DUR / love.timer.getFPS())
                    else
                        fade_in = false
                    end
                elseif fade_out then
                    self.opacity = self.opacity - (1 / TEXT_FADE_DUR / love.timer.getFPS())
                end

                love.graphics.setColor(self.colors.r, self.colors.g, self.colors.b, self.opacity)
                love.graphics.setFont(fonts[font_size])
                love.graphics.printf(self.text, self.x, self.y, wrap_width, align)
                love.graphics.setFont(fonts["p"])
            else
                table.remove(tbl_text, index) -- remove yourself once you dissapear
                return false
            end

            return true
        end
    }
end

return Text