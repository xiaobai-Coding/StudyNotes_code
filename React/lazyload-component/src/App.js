import React from 'react';
import img1 from './imgs/1.jpg';
import img2 from './imgs/2.jpg';
import img3 from './imgs/3.jpg';
import './App.css';
import Lazyload from './Lazyload';

const LazyXiaobai = React.lazy(()=>import('./Xiaobai'))
function App() {
  return (
    <div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <div>1111111111</div>
        <img src={img1}></img>
      <Lazyload placeholder={<div>加载中...</div>} onContentVisible={()=>{
        console.log('img2 visible...')
      }}>
       <img src={img2} ></img>
      </Lazyload>
      <Lazyload placeholder={<div>加载中...</div>} onContentVisible={()=>{
        console.log('img3 visible...')
      }}>
       <img src={img3}></img>
      </Lazyload>
      <Lazyload placeholder={<div>加载中...</div>} onContentVisible={()=>{
        console.log('LazyXiaobai visible...')
      }}>
       <LazyXiaobai />
      </Lazyload>
    </div>
  );
}

export default App;
