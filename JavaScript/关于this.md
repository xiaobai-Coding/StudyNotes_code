在JavaScript中，this是一个关键字，它在不同的上下文中引用不同的对象，其this的绑定是动态的，这主要取决于函数的调用方式。this的绑定是函数运行时才确定的而不是编写是就绑定。在我看来this就像魔法一样让人难以理解掌握，工作这么久以来我从来没有认真的静下心来学习关于this的知识，所以还需要花大量的时间去学习与练习this的使用。

## 对于this的误解

在正式学习this之前需要避开两个对于this的误解，这也是在我看了《你不知道的JavaScript上卷》这本书之后所学到的知识，他们分别是：1. this指向函数自身 2. this指向函数的作用域。

先来看第一个误区：this指向函数自身

```
// 记录nums的累加值
function foo(num){
    console.log('foo:'+num)
    this.nums ++;
}
foo.nums = 0;
for(var i = 0; i<10; i++){
    if(i>5){
        foo(i)
    }
}
nums // 0
这是为什么？因为this.nums没有绑定到foo函数上去
function foo1(){
   console.log(this) // window全局对象
}
// 也有解决方法滴，不使用this而是使用词法作用域
function foo1(num){
   console.log('foo:'+num)
    nums ++;
}
var nums = 0;
for(var i = 0; i<10; i++){
    if(i>5){
        foo(i)
    }
}
nums // 4
```

再来看第二个：this指向函数作用域

```
function foo2(){
  var a = 2;
  this.bar()
}
function bar(){
   console.log( this.a)
}

```

像这样bar试图通过作用域的方式去访问foo2函数中的变量,这样是访问不到的。

所以this并不会指向函数自身或者函数的作用域。this实际上是在函数调用时候才绑定的，它指向什么完全取决去函数的调用方式。

## this的绑定规则

##### 1.默认绑定

默认绑定在非严格模式下是绑定到全局对象上的，在严格模式下会绑定到undefined

```
var a = 2;
functin foo(){
    this.a // 2
}
foo()
function foo1(){
    "use strict"
    this.a // undefined
}
foo1()
```

##### 2.隐式绑定

隐式绑定指的是函数的调用位置是否处于上下文对象，或者说是否被对象所包裹或拥有,一般来说将foo函数作为obj对象的引用属性添加到obj的上下文中，obj就拥有了foo函数，foo的this就绑定到了obj身上。

```
function foo(){
    this.a // 2
}
var obj = {
    a: 2,
    foo: foo
}
obj.foo // 2
```

##### 3.显式绑定

可以通过call()、apply() 方法进行显式的绑定this

```
function foo() {
    this.a // 2
}
var obj = {
    a: 2
}
foo.call(obj) // 这句代码的意思是将foo的this绑定到obj上面
apply同理这里不再赘述
```

##### 4.new绑定

通过构造一个构造函数的方式来绑定this

```
function foo(a){
    this.a = a
}
var bar = new foo(2)
bar.a // 2
这几句代码发生了什么？
1.创建一个新对象
2.这个新对象会被执行[[prototype]]连接
3.这个新对象的this会绑定到构造函数
```

## 优先级

试着想一下如果一个函数在调用时存在多个绑定规则，这时该怎么选？答案就是利用优先级规则。在这里我直接说结果吧，优先级从高到低依次是：

1.使用了new调用函数，这时this就指向了新创建的对象。

2.如果使用call或者apply直接硬性的绑定this,那么此时this就指向了指定的对象。

3.如果函数处于某个对象上下文中调用的话，那么this就指向了这个对象。

4.如果以上都不满足，则会使用默认绑定，在非严格模式下this指向全局对象，在严格模式下this指向undefined

## =>箭头函数

箭头函数并不使用以上四条this的绑定规则，而是根据当前所在词法作用域(函数或者全局)来决定this的绑定，具体来说箭头函数会继承外层函数函数调用this的绑定。

```
function foo(){
    return (a)=>{
        console.log(a)
    }
}
var obj1 = {
    a: 2
}
foo.call(obj1)
obj1.a // 2
```

## 例外

凡事总有例外，有些时候你以为的绑定规则其实他是使用了默认绑定规则。如果你想更安全的忽略this绑定，你可以使用一个DMZ对象，或者说是一个安全区，这样就不会担心对全局对象产生影响。可以使用 var 0 = Object.create(null)创建一个空对象，他比{}更空不会创建prototype这个委托。

## 总结

以上就是关于JavaScript中关于this的知识总结。

- 关于对this的两个误会：1.this指向其函数自身 2. this指定函数内部作用域。我们一定要纠正这两个误会。

- 函数中this的绑定只有在这个函数运行时才确定，如果要知道这个函数中this绑定到了什么地方，那就要找到这个函数的实际调用位置，而并不是函数的声明位置。找到了函数的调用位置那么久可以依照以下的this绑定规则来确定this到底绑定到了那个对象上面。

1. 如果是由new调用就绑定到新创建的对象上面。
2. 如果是通过call或apply进行绑定，那么就会绑定到指定的对象上面。
3. 如果是由一个对象上下文或者说在一个对象内部，就绑定到这个对象。
4. 除了以上三条规则那就是默认绑定，在非严格模式下绑定到全局对象上，在严格模式下绑定到undefined上。

- 如果一个一个函数调用中存在多个规则的情况下，this的绑定也是有优先级的，其优先级从高到低依次为：

- new绑定>显示绑定>隐式绑定>默认绑定。

- 箭头函数的this绑定，是由他自己所在外部函数上下文决定的。

