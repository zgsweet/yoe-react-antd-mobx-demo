/**
 * @Author: liu.yang
 * @Date: 2018-05-23 17:27:06
 */
import React from 'react';
import { Table, Spin } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import styles from './Table.less';
import TableModel from '../../models/TableModel';

/**
 * 基础Table组件，基于Antd Table
 * list 列表数据
 * pageNum 页码
 * pageSize 页现实数据条数
 * totalCount 数据总条数
 * query 查询条件
 * hasFetch 是否显示loading动画
 * trimList 处理数据集（需要在这里指定数据集的key）
 */
@observer
class TableTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.tableModel = new TableModel({
      api: this.props.api,
      pageSize: props.pageSize || 10,
      query: this.props.query
    });
  }
  componentDidMount() {
    this.tableModel.getList();
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.query) !== JSON.stringify(this.props.query)) {
      this.tableModel.changeQuery(nextProps.query);
    }
  }
  componentWillUnmount() {
    this.tableModel.clear();
  }
  render() {
    const {
      columns,
      searchRender,
      loading,
      pagination = true,
      trimList = list => list,
      defaultExpandAllRows = false
    } = this.props;
    const {
      list,
      pageNum,
      pageSize,
      totalCount,
      changePageNum,
      changePageSize,
      hasFetch
    } = this.tableModel;
    const listData = trimList(toJS(list));

    const paginationData = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize,
      total: totalCount,
      onChange: changePageNum,
      onShowSizeChange: (current, pageSize) => changePageSize(pageSize)
    };
    let expandedRowKeys = [];
    if (defaultExpandAllRows) {
      listData.forEach(item => item.children && expandedRowKeys.push(item.key));
    }
    return (
      <div className={styles.root}>
        <Spin spinning={loading ? hasFetch : false}>
          <div className={styles.search}>{searchRender}</div>
          <div className={styles.content}>
            <Table
              columns={columns}
              dataSource={listData}
              pagination={pagination ? paginationData : false}
              expandedRowKeys={expandedRowKeys}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default TableTemplate;
