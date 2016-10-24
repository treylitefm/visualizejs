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

        BFS(start, target) {
            return this._BFS(start, target, new Queue)
        }

        Djikstra(start, target) {
            var pQ = require('./priorityqueue.js')('min')
            return this._Djikstra(start, target, pQ)
        }

        _Djikstra(start, target, Q) {
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
                console.log('Pre-queue:',curr, Q.data)
                for( var child in this.edges[curr.id] ) {
                    var v = this.vertices[child];
                    if( v.cost > curr.cost+this.edges[curr.id][v.id] ) {
                        v.cost = curr.cost+this.edges[curr.id][v.id];
                        //console.log('Pushing:',v)
                        Q.enqueue(v.cost, v.id);
                    }
                }
               // console.log('Post-queue:',curr, Q.data)
                curr = this.vertices[Q.dequeue()['id']];
            }
                console.log(curr)
            
            return true
        }

        _BFS(start, target, Q) {
            var arr = [];

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
    }

    var G = new Graph();
    G.add().add().add().add().add().add().add().add().add().add().add().add().add().connect(0, 1, 2).connect(1, 2, 5).connect(1, 3, 13).connect(2, 4, 2).connect(3, 4, 4).connect(3, 7, 4).connect(4, 5, 5).connect(4, 8, 2).connect(6, 7, 9).connect(5, 9, 8).connect(6, 10, 1).connect(7, 8, 5).connect(7, 11, 3).connect(11, 12, 6);

    console.log(G.BFS(3, 0));
    console.log('********')
    console.log(G.Djikstra(3, 0));
//    console.log(G.DFS(3,1))

})();
