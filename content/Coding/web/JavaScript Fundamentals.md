## Course: [[javascript]]

## Subject: #js #frontend #backend

## Date: 14-05-2025

## Topic: #js #coding #programming

---

## printing results to the console by using

```javascript
 console.log("hello, world")
 console.error("error")
 console.warn("warning")
```

## collecting input

- its done by the back-end so we need to install things

```javascript
npm init -y  // in the console or the terminal
mpm install prompt-sync  // this is also in the terminal
```

- to use the installed 'prompt-sync'

```javascript
const prompt = required("prompt-sync")()
const value = prompt("type somethong; ")
console.log(value)
```

## data types

```javascript
primitive data types
=> String: anything that's surrounded by ' ', " " or ``
=> boolean: true or false value
=> number: any number a decimal or a whole number
=> undefined: is a type and also the only valid type in that type in other words its a condition where an expression doesn't have a correct value, although its syntactically correct
=> null: is used when you explicitly set something as nothing
=> BiInt: represents integer values larger than the range supported by the number data type
=> symbol: 
```

## variable

```javascript
var hello = "hello" // function scoped 

let hello = "world" /* a key word that allows you to declare a variable that can  be change lator on */

const hello = "world" // const- declare a variable that can't be changes lator on

```

- 'let' and 'const ' are block-scoped means they can only access the variable in the block that its defined in or can'r be accessed out side an if statement if it was declared in there
- 'var' in the other hand it's function scoped means can be accessed anywhere in the function as well as in the program

## Arithmetic operators

```javascript
+
-
*
/
%
**
--
++
+=
-=
*=
/=

```

operations

```javascript
const x = 6
const t = '5'

console.log(x+t)/* 65 not an error js just changes the int into str to add them up it's known as 'type cohersion' it's done on data types that are not the same and we try to do arithmetic operations on them */

const e = 6 
const w = true

console.log(e+w) // 7 cuz true = 1

const x = '123'
const t = 2

console.log(x*t) // 246 its only weired with addition the other operation works fine

```

## type conversion

```javascript
const x = "2345"
const y = "2345px"
const z = 2345

console.log(Number(x)) // 2345
//it just turns the string into a number

console.log(parseInt(y)) // 2345
/*parse function convertd its first argument into a string,parse that string then returns an integer or NaN */

// parseFloat(y)

console.log(String(z)) // "2345"

/* or you can just add it to a string it will change it into a string */

console.log(z.toString())

```

## comparison operators

` == ` loose equality operator
` === ` strict equality operator
` != `  not equal to operator
`!==`  not equal to strict equality operator

### loose equality operator

changes the values into the same type and then compare

```javascript
console.log(1 == "1")  // true
console.log(1 == true)  //true
console.log(null == undefined)  //true
console.log(null == false) //false
console.log(0 == "") //true
```

### strict equality operator

compares both the value and the type

```javascript
console.log(undefined === null) // false
console.log(1 === "1") //false
console.log(1 !== "1") //true
```

## logical operators

```javascript
&&
||
!
```

## conditional operators

### if else statements

```javascript
const condition = 2 < 3 ? "i told you " | "really nigga"
```

### switch statements

```javascript
const value = 3

switch(value){
 case 3:
  console.log("3 is cool) // the indentation doesnot matter
  break
 case 4:
  console.log("4 is cool)
  break
 case 5:
  console.log("5 is cool)
  break
 default:
  console.log("no one is cool)
  break
}
```

## arrays

```javascript
const arr = [1, 2, 3, "hello", true]
const arr2 = Array.from("hello")
console.log(arr2) // ['h','e','l','l','o']
```

## while loops

```javascript
do{
 console.log('do something')
 break
}while(true)


while(true){
 console.log('do something')
 break
}

```

## for loops

```javascript
 for(let i = 0; i < 5; i++){
 console.log(i) // 1 2 3 4 5 in row format
}

const arr = [4,5,6]

for(let value of arr){
 console.log(value) // 4 5 6 in row format
}

const arr2 = ['h', 'e', 'l', 'l']

for (let [i, values] of arr2.entries()){
 console.log(i, values)
 /*
 0 h
 1 e
 2 l
 3 l
 */
}



```

## objects

JSON = javascript object notation

- objects have properties associated with values

```javascript
const obj ={
 name: "alice",
 age: 23,
 // we can also have functions inside of a function
 sayHello: function(){
  return "hello!"
 }
 // we can also have objects inside of objects
 carrier: {
  firstJob: "tech girl"
  secondJob: "jobless"
 }
 
}

// accessing the object
obj.age = 27
obj.newProp = [1,2]

obj["name"]

console.log(Objects.keys(obj)) // all the keys like name, age, ...

for(let key in obj){
 console.log(key) // name age sayHello carrier
}

const obj2 {
 hairColor: black,
 eyeColor: brown
}

const obj3 = {...obj, ...obj2} 
// grab all the properties and values from both the objects and give it to obj3



```

## sets

```javascript
const mySet = new Set()
myset.add(1)
mySet.deleter(1)
mySet.has(1)
mySet.size

for (let value of mySet){
 console.log(value) // prints out all the values of the set
}

mySet.clear() // clears the whole set

// you can change set in to an array
const arr = Array.from(mySet) //or
const arr = [...mySet]

```

## maps

```javascript
const myMap = new Map()
const numberMap = new Map([[1,'one'],[2,'two']])

myMap.set(4, 'four')
myMap.delete(4)
myMap.has(1)

for (let [key, values] of myMap){
 
}

myMap.clear()
// map to arrray conversion

const arr = Array.from(myMap)

```

## Error handling

# errors

```javascript
try{
 riskyFunction()
}catch(error){
 console.error("an error occured:", error.message )
}finally{
 console.log('clean up code can go here') // always runs
}
throw new Error('this is not good')


```

## functions

```javascript
function greet (name){
 return name
}

const greet = function (name){
 return name
}

const greet = (name) => {
 return name
}

// Rest parameters ; allows a function to accept an indefinite number of arguments as an array

function addNums (...numbers){
 return numbers + numbers
}



```

### map, filter, reduce

```javascript

const numbers = [1,2,3,4]
const doubledNumbers = numbers,map((num) => num*2 )
console.log(doubledNumbers) //[1,4,6,8]

const users = [
 {name:"alice", age: 25},
 {name:"david, age: 24}
]
const userNames = users.map((users) => users.name)
console.log(userNames) // alice, david


const number = [1,2,3,4]
const sum = number.reduce((acc, num) => acc + num ,0)
console.log(sum) //10

const numberss = [1,2,3,4,5]
const evenNumbers = numbers.filter(num => num % 2 === 0)
console.log(evenNumbers) // [2,4]

```

## 'this' keyword

- if using the arrow function inside of an object there is gonna be an error

```javascript
const person{
 name: "alice",
 greet(){
  console.log('hello, my name is $(this.name)')
 },
}

person.greet() // hello, my name is alice


const person{
 name: "alice",
 greet: () => {
  console.log('hello, my name is $(this.name)')
 },
}

person.greet() // hello, my name is undefined



```

## promises

- promise is an object that represents the eventual completion or failure of an asynchronous operation
1:09:36
