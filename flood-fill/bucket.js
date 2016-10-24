var target = 0;
var replacement = 3;
var wall = 1;

var speed = 10;

var grid = [];
var q = [];

var container = $('#grid');
var width     = $('#width');
var height    = $('#height');

var interval;

var getColor = function(val) {
    switch(val) {
        case target:
            return 'blue'
            break;

        case replacement:
            return 'green'
            break;

        default:
            return 'red';
    }
};

var bucket = function(a,b) {
    var arr = [[a,b]];

    while( arr.length ) {
        var choices = []; 

        //var coord = arr.shift(); // breadth
         var coord = arr.pop(); // depth
        var x = parseInt(coord[0]), y = parseInt(coord[1]);
        if(!grid[x] || grid[x][y] !== target || neighborsVisited(x,y)) {
            continue;
        }

        grid[x][y] = replacement;
        q.push(coord);

        if( !interval ) {
            interval = setInterval(function() {
                updateHtmlGrid(q.shift());

                if( !q.length ) {
                    clearInterval(interval);
                    interval = null;
                }
            }, speed);
        }
        
        choices.push([x-1, y]);
        choices.push([x, y+1]);
        choices.push([x+1, y]);
        choices.push([x, y-1]);

        //splice at random index, then pop/push all remaining
        while (choices.length > 0) {
            var c = choices.splice(getRandomInt(0,choices.length), 1)[0]
            arr.push(c);
        }
    }
};

function neighborsVisited(x,y) {
    var count = 0
    var choices = []
    choices.push([x-1, y]);
    choices.push([x, y+1]);
    choices.push([x+1, y]);
    choices.push([x, y-1]);
    var choice
    while (choices.length > 0) {
        choice = choices.pop()
            console.log(x,y,choice)
        if (grid[choice[0]] !== undefined && grid[choice[0]][choice[1]] !== undefined && grid[choice[0]][choice[1]] == replacement) {
            count++
        } 
    }
    if (count == 1 || count == 0) {
        return false
    } 
    return true
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var updateHtmlGrid = function(arr) {
    var x = arr[0], y = arr[1];

    $(`.block[data-x="${x}"][data-y="${y}"]`).attr('data-color', getColor(replacement));
};

$('#randomGrid').on('click', function() {
    var w = width.val() || 10, h = height.val() || 10;

    grid = [];
    clearInterval(interval);
    interval = null;
    q = [];

    for( var i = 0; i < h; i++ ) {
        grid[i] = [];

        for( var j = 0; j < w; j++ ) {
            var rand = Math.floor(Math.random() * 10);
//            if( rand < 6 ) {
                grid[i][j] = target
//            } else {
//                grid[i][j] = wall;
//            }
        }
    }

    container.html('');

    for( var i = 0; i < grid.length; i++ ) {
        var row = $('<div/>', { class: 'row' });

        for( var j = 0; j < grid[i].length; j++ ) {
            var block = $('<div/>', { class: 'block' })
                .attr({
                    'data-x': i,
                    'data-y': j,
                    'data-color': getColor(grid[i][j])
                });

            row.append(block);
        }

        container.append(row);
    }
});

container.on('click', 'div', function(e) {
    var div = e.currentTarget,
        x = div.getAttribute('data-x'),
        y = div.getAttribute('data-y');

    bucket(x,y)
});
