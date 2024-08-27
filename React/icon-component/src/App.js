import './App.css';
import { IconAdd } from "./icon/icons/iconAdd"
import { createIconFont } from './icon/createIconFont';

const IconFont = createIconFont('//at.alicdn.com/t/c/font_4665784_k0ba8hpcp2b.js')
function App() {
  return (
    <div className="App">
     <IconAdd  style={{fontSize: '50px'}} />
     <IconAdd size="20px" />
     <IconAdd spin />
     <IconAdd />
     <IconFont type="icon-juzhong" />
     <IconFont type="icon-qiyeguanli" />
     <IconFont type="icon-bianmachaxun" />
     <IconFont type="icon-tianjia" />
    </div>
  );
}

export default App;
