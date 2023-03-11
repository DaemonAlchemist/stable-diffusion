import { FilesPanel } from '@/components/FilesPanel'
import { Text2Image } from '@/components/Text2Image';
import {ConfigProvider, theme, Layout} from 'antd';
import styles from "../styles/Home.module.scss";

export default function Home() {
  return <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <Layout className={styles.app}>
      <Layout.Header><b>Stable Diffusion Web GUI</b></Layout.Header>
      <Layout>
        <Layout.Content className={styles.content}>
          <Text2Image />
        </Layout.Content>
        <Layout.Sider className={styles.rightSider} width={384}>
          <FilesPanel />
        </Layout.Sider>
      </Layout>
      <Layout.Footer>
        Footer goes here
      </Layout.Footer>
    </Layout>
  </ConfigProvider>
}
