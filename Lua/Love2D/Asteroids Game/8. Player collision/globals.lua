ASTEROID_SIZE = 100
show_debugging = false
destroy_ast = false -- this is so the level doesn't increase when the player crashes into the last asteroid and has 0 lives left

function calculateDistance(x1, y1, x2, y2)
    return math.sqrt(((x2 - x1) ^ 2) + ((y2 - y1) ^ 2))
end