/**
 * Created by mimi on 09.01.2016.
 */

var array = new Array(3);
for (var i = 0; i < 3; i++) {
    array[i] = [' ', ' ', ' '];
}

array[0][2] = 'x';
array[1][1] = 'x';
array[2][0] = 'x';

console.log(array[2]);
