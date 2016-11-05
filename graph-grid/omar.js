var g = require('./graph.js')

var l = 4
var w = 3
var total = l*w

var grid = []
var arr = []

for (var i = 0; i < w; i++) {
    grid.push([])
    for (var j = 0; j < l; j++) {
        grid[i].push(0)
    }
}

grid[1][1] = 1
grid[0][1] = 1
grid[1][0] = 1
grid[2][1] = 1
grid[0][3] = 1

for (var i = 0; i < w; i++) {
    for (var j = 0; j < l; j++) {
        arr.push(grid[i][j])
    }
}

function addUp(i) {
    var conn = i-l
    if (conn >= 0 && arr[i] !== 1 && arr[conn] !== 1) {
        g.connect(i, conn, 1)
    }
}
function addRight(i) {
    var conn = i+1
    if ((i+1)%l !== 0 && arr[i] !== 1 && arr[conn] !== 1) {
        g.connect(i, conn, 1)
    }
}
function addDown(i) {
    var conn = i+l
    if (conn < total && arr[i] !== 1 && arr[conn] !== 1) {
        g.connect(i, conn, 1)
    }
}
function addLeft(i) {
    var conn = i-1
    if (i%l !== 0 && arr[i] !== 1 && arr[conn] !== 1) {
        g.connect(i, conn, 1)
    }
}

for (var i = 0; i < total; i++) {
    g.add()
}

for (var i = 0; i < total; i++) {
    addUp(i)
    addRight(i)
    addDown(i)
    addLeft(i)
}


/*
//console.log(g.BFS(0,10))
var path = g.Dijkstra(0,10)
/*for (i in path) {
    console.log(path[i].id,path[i].cost)
}*/

var path = g.Astar(10, 0, true, l, w)
for (i in path) {
    console.log(path[i].id,path[i].heuristic,path[i].cost)
}
//console.log(g.vertices,g.edges)
