import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Content, Header } = Layout;

export default function HomePage() {
  const navigate = useNavigate();
  const handleOpenForm = () => navigate("/create");
  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Header>
        <Button type="primary" onClick={handleOpenForm}>
          Создать новую карточку ИД
        </Button>
      </Header>
      <Content style={{ padding: "32px", height: "100%" }}>
        <h1>Главная</h1>
      </Content>
    </Layout>
  );
}
