import React from 'react';
import { Menu, Icon, Layout } from 'antd';
import styles from './BaseMenu.less';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const BaseMenu = ({ collapsed, menuData, activeMenu }) => {
  const { id } = activeMenu;
  return (
    <Sider collapsed={collapsed}>
      <div className={styles.root}>
        <div className={styles.logo}>
          <div className={styles.img} />
        </div>
        <Menu defaultSelectedKeys={[id]} mode="inline" theme="dark">
          {menuData.map(item => (
            <Menu.Item key={item.id}>
              <Link to={item.path}>
                <Icon type={item.icon} />
                <span>{item.text}</span>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </Sider>
  );
};

export default BaseMenu;
