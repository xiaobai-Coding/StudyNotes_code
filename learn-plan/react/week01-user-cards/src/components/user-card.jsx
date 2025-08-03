import "./user-card.css";
export default function UserCard() {
  const userData = [
    {
      name: "王伟",
      gender: "男",
      age: 32,
      address: "上海市浦东新区张江镇创新路100号"
    },
    {
      name: "李娜",
      gender: "女",
      age: 28,
      address: "北京市海淀区中关村南大街50号"
    },
    {
      name: "张明",
      gender: "男",
      age: 45,
      address: "广州市天河区珠江新城花城大道8号"
    },
    {
      name: "陈红",
      gender: "女",
      age: 25,
      address: "深圳市南山区科技园深南大道1000号"
    },
    {
      name: "刘洋",
      gender: "男",
      age: 38,
      address: "杭州市西湖区文三路99号"
    }
  ];
  const userItem = userData.map((item) => (
    <div className="card-item">
      <div>姓名：{item.name}</div>
      <div>性别：{item.gender}</div>
      <div>年龄：{item.age}</div>
      <div>家庭住址：{item.address}</div>
    </div>
  ));
  return (
    <>
      <h1>用户信息</h1>
      {userItem}
    </>
  );
}
