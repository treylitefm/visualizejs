(function() {
    "use strict"

    class Node {                                                                                                                  
        constructor(val, id) {
            this.val = val;
            this.id = id
        }          
    } 

    class Heap {
        constructor(parity) {
            this.data = []
            this.parity = parity || 'min'
            this.enqueue = this.insert
            this.dequeue = this.pop
        }

        _swap(i,j) {
            [this.data[i],this.data[j]] = [this.data[j],this.data[i]]
        }

        insert(val, id) {
			var _compare = function(m,n) {
			 //reads like, "if max-heap, return m is greater than n, else return m is less than n"
				if (this.parity == 'max') {
					return m > n
				} else {
					return m < n
				}
			}.bind(this);

            val = Number(val)
            if (isNaN(val)) { return false; }

            this.data.push(new Node(val, id))

            if (this.data.length == 1) { return true; }

            var i = this.data.length-1
            var p = Math.floor((i-1)/2)

            while (this.data[i] && this.data[p] && _compare(this.data[i].val,this.data[p].val)) {
                this._swap(i,p)
                i = p
                p = Math.floor((i-1)/2)
            }
        }

        peek() {
            return this.data[this.data.length-1]
        }

        pop() {
			var _compareChildren = function(i) {
				if (i === false) {
					return false
				}
				//reads like, "if max-heap, return value at i is greater than its max-child, else return value at i is less than its min-child"
				if (this.parity == 'max') {
					var maxChild = !this.data[i*2+2] ? this.data[i*2+1].val : Math.max(this.data[i*2+1].val,this.data[i*2+2].val)
					return this.data[i].val < maxChild
				} else {
					var minChild = !this.data[i*2+2] ? this.data[i*2+1].val : Math.min(this.data[i*2+1].val,this.data[i*2+2].val)
					return this.data[i].val > minChild
				}
			}.bind(this);
			var _getChildIndex = function(i) {
				if (!this.data[i*2+1] && !this.data[i*2+2]) {
					return false
				}
				if (this.parity == 'max') {
					if (this.data[i*2+1] && !this.data[i*2+2]) {
						return i*2+1
					} else {
						return this.data[i*2+1].val > this.data[i*2+2].val ? i*2+1 : i*2+2
					}

				} else {
					if (this.data[i*2+1] && !this.data[i*2+2]) {
						return i*2+1
					} else {
						return this.data[i*2+1].val < this.data[i*2+2].val ? i*2+1 : i*2+2
					}
				}
			}.bind(this);

            this._swap(0,this.data.length-1)
            var tmp = this.data[this.data.length-1]
            this.data.length -= 1
            
            var i = 0
            var c = _getChildIndex(i)
            while (c && _compareChildren(i)) {
                this._swap(i,c)
                i = c
                c = _getChildIndex(i)
            }

            return tmp
        }
    }

    class PriorityQueue {
        insert() {}
        pop() {}
        peek() {}
    }
/*
    var heap = new Heap('max')
    var arr = [4,21,35,214,2,51,32,33,2,6,6322,41,90,78,979,786546,345,32]
//    for (var n in arr) { 
    for (var i = 0; i < 15; i++) {
        var n = Math.floor(Math.random()*1000)
//        heap.insert(arr[n])
        heap.insert(n)
    console.log(heap.data)
    }

//    console.log(heap.data)


    while (heap.data.length) {
        console.log(heap.pop())
    }

*/
    module.exports = function(parity) { 
        return new Heap(parity)
    }
})()
