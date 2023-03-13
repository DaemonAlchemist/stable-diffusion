import { FilesPanel } from '@/components/FilesPanel';
import { Text2Image } from '@/components/Text2Image';
import { Col, ConfigProvider, Layout, Row, Switch, theme } from 'antd';
import { useState } from 'react';
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [dark, setDark] = useState(true);
  const toggleDarkMode = () => setDark(d => !d);

  return <ConfigProvider
    theme={{
      algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }}
  >
    <Layout className={styles.app}>
      <Layout.Header>
        <b>Stable Diffusion Web GUI</b>
        <div className={styles.modeSwitch}>
          <Switch checkedChildren="Dark" unCheckedChildren="Light" checked={dark} onChange={toggleDarkMode} />
        </div>
        </Layout.Header>
      <Layout>
        <Layout.Content className={styles.content}>
          <Row>
            <Col xs={20}>
              <Text2Image />
            </Col>
            <Col xs={4}>
              <FilesPanel />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
      <Layout.Footer>
        Footer goes here
      </Layout.Footer>
    </Layout>
  </ConfigProvider>
}
