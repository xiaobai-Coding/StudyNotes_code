<a name="uNz0K"></a>
#### 组件
> React官方文档对组件的描述：React 应用程序是由 **组件** 组成的。一个组件是 UI（用户界面）的一部分，它拥有自己的逻辑和外观。组件可以小到一个按钮，也可以大到整个页面。
> 官方文档地址：[https://zh-hans.react.dev/](https://zh-hans.react.dev/)

如何创建一个组件：通过`JavaScript`函数返回标签来创建
```typescript
function Button1() {
  return (
    <button>Button</button>
  )
}
```
创建嵌套的组件
```typescript
function Button() {
  return (
    <div>
      <button>Button</button>
    </div>
  )
}
function App() {
  return (
    <>
      <h1>Hello React</h1>
      <Button />
    </>
  )
}
export default App
```
以上的这种(通过`JavaScript`函数返回标签)语法是JSX，大多数 React 项目会使用 JSX，组件的首字母必须以大写开头，HTML标签全是小写字母，这样也便于区分是React组件还是HTML标签。你的组件不能返回多个JSX标签，可以使用一个共享的父级`<div>...<div>或者空的<>...</>`将它们包裹起来即可
<a name="h15DD"></a>
#### 为组件添加样式
通过className为组件指定一个样式，与HTML的class工作方式相同
```typescript
function Button() {
  return (
    <div>
      <button className="button1">Button</button>
    </div>
  )
}
// 样式
.button1 {
  background-color: #646cff;
  color: #fff;
}
```
<a name="o3GkO"></a>
#### 为组件添加事件onClick
通过onClick为组件添加一个事件处理函数
```typescript
function handleClick() {
    alert('hello react')
  }
function Button({count, onClick}) {
  return (
    <div>
      <button className="button1" onClick={handleClick}>Button</button>
    </div>
  )
}
// 样式
.button1 {
  background-color: #646cff;
  color: #fff;
}
```
<a name="MnfDM"></a>
#### 在组件中访问JavaScript变量
在组件中你可以访问JavaScript变量，通过大括号{}来访问变量例如`obj.name`
```typescript
const obj = {
  name: '按钮',
  size: '100px'
}
function Button({count, onClick}) {
  return (
    <div>
      <button className="button1" style={{ width: obj.size }}>{obj.name}</button>
    </div>
  )
}
```
<a name="GxloU"></a>
#### 条件渲染
就像编写普通`JavaScript`代码`if`语句一样来对组件进行条件渲染
```typescript
function Button() {
  return (
    <div>
      <button className="button">Button</button>
    </div>
  )
}
function Button1() {
  return (
    <div>
      <button className="button1">Button1</button>
    </div>
  )
}
const content = false
function App() {
  return (
    <>
      <h1>Hello React</h1>
      {
        content ? (<Button />) : (<Button1 />)
      }
    </>
  )
}
```
<a name="pZZBQ"></a>
#### useState状态
有时候我们可能需要组件记住某个状态，比如一个按钮被点击的次数，想做到这一点可以在你的组件使用`useState`。<br />先从React中引入`useState`并在组件中声明一个state变量，`count`为当前的值，`setCount`用来操作count的函数。`count`初始值为0，当点击按钮后调用`setCount`将count的值加1，这个count的值随着按钮的点击会不断的增加
```typescript
import { useState } from 'react'
const obj = {
  name: '按钮',
  size: '100px'
}
function Button1() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return (
    <button className="button2" onClick={handleClick} style={{ width: obj.size }}>{obj.name}2</button>
  )
}
```
<a name="csqTG"></a>
#### 组件间共享数据 状态提升
有没有可能两个组件共享一个状态呢？比如有两个按钮点击其中一个按钮另一个的值也会实时更新。这就需要用到状态提升，其实就是类似于vue中父子组件之间传值，在React中这种传递信息的方式叫做`prop`，由父组件将`state`的值和事件处理函数`handleClick`传递给子组件，再由子组件去执行事件并更新`state`的值
```typescript
function Button({count, onClick}) {
  return (
    <div>
      <button className="button1" onClick={onClick} style={{ width: obj.size }}>{obj.name}: {count}</button>
    </div>
  )
}
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return (
    <>
      <h1>Hello World</h1>
      <div className='card'>
        <button onClick={handleClick}>count is {count}</button>
      </div>
      {
        content ? (<Button count={count} onClick={handleClick}  />) : (<Button1 />)
      }
      <Button onclick={handleClick} count={count}  />
    </>
  )
}
```
