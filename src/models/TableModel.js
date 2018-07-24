import { observable, action, reaction } from 'mobx';
import { get, post } from '../common/request';

class TableModel {
  api;
  callBack;
  @observable list;
  @observable pageNum;
  @observable pageSize;
  @observable totalCount;
  @observable query;
  @observable hasFetch;

  constructor({ api, pageNum, pageSize, query }) {
    if (typeof api === 'string') {
      this.api = data => get(api, data);
    } else if (typeof api === 'object') {
      const { path, method = 'get' } = api;
      if (method === 'get') {
        this.api = data => get(path, data);
      } else if (method === 'post') {
        this.api = data => post(path, data);
      }
    } else if (typeof api === 'function') {
      this.api = api;
    }
    this.list = [];
    this.pageNum = pageNum || 1;
    this.pageSize = pageSize || 10;
    this.totalCount = 0;
    this.query = query || {};
    this.hasFetch = false;

    if (!this.reaction) {
      // 监听页面页码、页面数据总条数，发生变化后更新list
      this.reaction = reaction(
        () => `${this.pageNum}${this.pageSize}${JSON.stringify(this.query)}`,
        () => this.getList()
      ); // 监听页面，发生变化后更新list
    }
  }

  @action
  clear = () => {
    if (this.reaction && typeof this.reaction === 'function') {
      this.reaction();
    }
    this.list = [];
    this.pageNum = 1;
    this.totalCount = 0;
    this.query = {};
    this.hasFetch = false;
  };

  // 获取API list
  getList = () => {
    this.changeHasFetch(true);
    this.api({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      ...this.query
    }).then(({ errCode, totalCount, data = [] }) => {
      this.changeHasFetch(false);
      if (errCode === '0') {
        this.saveList(data || [], totalCount);
      }
      // this.saveList(api, apiTotalCount)
      // if (typeof this.callBack === 'function') {
      //   callBack(data);
      // }
    });
  };

  @action
  saveList = (newApiList, totalCount) => {
    this.list = newApiList;
    this.totalCount = totalCount;
  };
  @action
  changePageNum = pageNum => {
    this.pageNum = pageNum;
  };
  @action
  changePageSize = pageSize => {
    this.pageSize = pageSize;
    this.pageNum = 1; // 当页数据总条数发生变化，默认回到第一页
  };
  @action
  changeQuery = query => {
    this.query = query;
    this.pageNum = 1; // 当页查询条件改变的时候，默认回到第一页
  };
  @action
  changeHasFetch = has => {
    this.hasFetch = has;
  };
}

export default TableModel;
