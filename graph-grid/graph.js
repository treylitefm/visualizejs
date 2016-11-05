(function() {
    "use strict";

    class Node {
        constructor(val) {
            this.val = val;
            this.next = null;
        }
    }

    class Queue {
        constructor() {
            this.head = null;
        }

        enqueue(val) {
            var node = new Node(val);

            if( !this.head ) {
                this.head = node;
            } else {
                var r = this.head;
                while( r.next ) {
                    r = r.next;
                }
                r.next = node;
            }
        }

        dequeue() {
            var ret = null;

            if( this.head ) {
                ret = this.head.val;
                this.head = this.head.next;
            }

            return ret;
        }
    }

    class Graph {
        constructor() {
            this.idTrack = 0;
            this.vertices = {

            };
            this.edges = {

            };
        }

        getVertices() {
            console.log(this.vertices);
        }

        getEdges() {
            console.log(this.edges);
        }

        add() {
            this.vertices[this.idTrack] = {
                id: this.idTrack++,
                cost: Infinity,
                exists: true
            };
            return this;
        }

        connect(A, B, weight) {
            if( this.vertices[A] && this.vertices[B] ) {
                if( !this.edges[A] ) this.edges[A] = {};
                if( !this.edges[B] ) this.edges[B] = {};
                this.edges[A][B] = weight;
                this.edges[B][A] = weight;
                return this;
            } else {
                return false;
            }
        }

        Dijkstra(start, target, Q) {
            //RESET
            for( var v in this.vertices ) {
                this.vertices[v].cost = Infinity;
                this.vertices[v].visited = false; //not used for djikstra
                this.vertices[v].previous = null;
            }

            start = this.vertices[start];
            target = this.vertices[target];
            start.cost = 0;

            var curr = start;
            var moves = [];
            var Q = require('./priorityqueue.js')('min');

            while(curr !== target) {
                for( var child in this.edges[curr.id] ) {
                    var v = this.vertices[child];
                    if( v.cost > curr.cost+this.edges[curr.id][v.id] ) {
                        v.cost = curr.cost+this.edges[curr.id][v.id];
                        v.previous = curr;
                        Q.enqueue(v.cost, v.id);
                    }
                }
                curr = this.vertices[Q.dequeue()['id']];
            }
            
            while (curr) {
                moves.unshift(curr)
                curr = curr.previous
            }
            return moves
        }

        Astar(start, target, isGridGraph, length, width) {
            if (!isGridGraph) { //this implementation makes the assumption that the user generated a grid-based graph; this flag exists with the express purpose of ensuring a user acknowledges the intent and pre-reqs of this algorithm
                return false
            }

            var curr = this.vertices[start];
            var moves = [];
            var Q = require('./priorityqueue.js')('min');
            var movement = 10

            var t = {
                w: Math.floor(target/length),
                l: target%length
            }
            for (var v in this.vertices) {
                this.vertices[v].heuristic = Math.abs(t.w-Math.floor(this.vertices[v].id/length))+Math.abs(t.l-this.vertices[v].id%length)
                this.vertices[v].visited = false //substitute for closed list
                this.vertices[v].cost = Infinity
            }

            curr.cost = 0
            while (curr.heuristic !== 0) {
                if (curr.visited) { continue; }
                for (var child in this.edges[curr.id]) {
                    var v = this.vertices[child];
                    
                    if (v.visited) { continue; }
                    
                    if (curr.cost + movement < v.cost) {
                        v.cost = curr.cost + movement
                        v.previous = curr
                        var f = v.cost + v.heuristic

                        Q.enqueue(f, v.id);//heap sorted by lowest fcost
                    }
                }
                curr.visited = true
                curr = this.vertices[Q.dequeue()['id']];
            }
            while (curr) {
                moves.push(curr)
                curr = curr.previous
            }
            return moves
        }

        BFS(start, target) {
            var arr = [];
            var Q = new Queue

            //RESET
            for( var v in this.vertices ) {
                this.vertices[v].cost = Infinity;
                this.vertices[v].visited = false;
            }

            start = this.vertices[start];
            target = this.vertices[target];
            start.cost = 0;

            var curr = start;

            while(curr !== target) {
                for( var child in this.edges[curr.id] ) {
                    var v = this.vertices[child];
                    if( v.cost === Infinity ) {
                        Q.enqueue(v.id);
                        v.cost = curr.cost + 1;
                    }
                }
                curr = this.vertices[Q.dequeue()];
            }

            while( curr !== start ) {
                arr.push(curr);
                for( var child in this.edges[curr.id] ) {
                    var v = this.vertices[child];
                    if( v.cost === curr.cost - 1 ) {
                        curr = v;
                        break;
                    }
                }
            }

            arr.push(curr);
            return arr.reverse();
        }

        DFS(start, target) {
            start = this.vertices[start];
            target = this.vertices[target];

            //RESET
            for( var v in this.vertices ) {
                this.vertices[v].cost = Infinity;
                this.vertices[v].visited = false;
            }

            var stack = [];
            var curr = start;
            curr.cost = 0;

            var _cheapestPath = function(c) {
                var cheapest;
                var es = this.edges[c.id];
                for( var e in es ) {
                    if( (!cheapest || es[e] < this.edges[c.id][cheapest.id]) && !this.vertices[e].visited) {
                        cheapest = this.vertices[e];
                    }
                }
                return cheapest;
            }.bind(this);

            while( curr !== target ) {
                curr.visited = true;
                var next = _cheapestPath(curr);
                if( next ) {
                    next.cost = curr.cost + this.edges[curr.id][next.id];
                    stack.push(curr);
                    curr = next;
                } else {
                    curr = stack.pop();
                }
            }
            stack.push(target);

            return stack;
        }

        Prim(start) {
            start = start || 0;
            var curr
            var visited = 0;
            var Q = require('./priorityqueue.js')('min');
            Q.enqueue(0, this.vertices[start].id)
            var stack = []

            //RESET
            for (var v in this.vertices) {
                this.vertices[v].previous = null
                this.vertices[v].visited = false
            }

            while (visited < Object.keys(this.vertices).length) {
                curr = Q.dequeue()
                if (Q.data.length > 0 && this.vertices[curr.id].visited) {
                    continue
                }
                this.vertices[curr.id].visited = true
                visited++;
                console.log('Current:',curr)

                for (var e in this.edges[curr.id]) {
//                    console.log(curr,e,Q.data)
                    if ((!this.vertices[curr.id].previous || e != this.vertices[curr.id].previous.id) && !this.vertices[e].previous) {
                        this.vertices[e].previous = curr
                        Q.enqueue(this.edges[curr.id][e], this.vertices[e].id)
                    //console.log('A', Q.data)
                    } else if (!this.vertices[curr.id].previous || e != this.vertices[curr.id].previous.id && this.edges[curr.id][e] < this.edges[this.vertices[e].previous.id][e]) {//if vertex A has previous, compare B->A and C->A
                        this.vertices[e].previous = curr
                        Q.enqueue(this.edges[curr.id][e], this.vertices[e].id)
                    //console.log('B')
                    }
                }
            }

            while (curr) {
                stack.push(this.vertices[curr.id])
                curr = this.vertices[curr.id].previous
            }

            return stack
        }
    }

    module.exports = new Graph()
/*
    var G = new Graph();
    G.add().add().add().add().add().add().add().add().add().add().add().add().add()
        .connect(0, 1, 2)
        .connect(1, 2, 5)
        .connect(1, 3, 13)
        .connect(2, 4, 2)
        .connect(3, 4, 4)
        .connect(3, 7, 4)
        .connect(4, 5, 5)
        .connect(4, 8, 2)
        .connect(6, 7, 9)
        .connect(5, 9, 8)
        .connect(6, 10, 1)
        .connect(7, 8, 5)
        .connect(7, 11, 3)
        .connect(11, 12, 6);

/*
    console.log(G.BFS(3, 0));
    console.log('********')
    console.log(G.Dijkstra(3, 0));
    console.log(G.DFS(3,1))
*/
/*
   var a = G.Prim()
    for (var i in a) {
    //    console.log(a[i].id,'omar')
    }
    */
})();
