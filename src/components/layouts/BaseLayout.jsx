/**
 * @Author: liu.yang
 * @Date: 2018-05-17 09:42:35
 */
import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';

import TopHeader from '../header/TopHeader';
import BaseMenu from '../menu/BaseMenu';
import styles from './BaseLayout.less';
import menuData from '../../models/menuData';

const { Content } = Layout;

class BaseLayout extends Component {
  state = {
    collapsed: false
  };
  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    const { pathname } = location;
    let activeMenu = menuData.find(item => item.path === pathname);
    // 此处应该有个默认首页、先暂时这样处理
    if (!activeMenu) {
      activeMenu = menuData[0];
    }
    return (
      <Layout className={styles.root}>
        <BaseMenu
          collapsed={collapsed}
          menuData={menuData}
          activeMenu={activeMenu}
        />
        <Layout>
          <TopHeader collapsed={collapsed} onCollapse={this.onCollapse} />
          <Content className={styles.content}>
            <Breadcrumb style={{ margin: '0 16px 16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BaseLayout;
