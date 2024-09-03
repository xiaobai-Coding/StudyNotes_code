import './App.css';
import Space from './Space';
import { ConfigProvider } from './Space/ConfigProvider'
function App() {
  return (
    <div>
    <ConfigProvider space={{size: 100}}>
      <Space direction='horizontal' align='end'>
        <div>111</div>
        <div>222</div>
        <div>333</div>
      </Space>
    </ConfigProvider>
    
    <Space direction='horizontal' align='end' size={100} split={<span>*</span>} >
      <div>111</div>
      <div>222</div>
      <div>333</div>
    </Space>

    </div>
  );
}

export default App;
