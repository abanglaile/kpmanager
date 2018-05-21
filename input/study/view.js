import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Row, Col, Menu, Select, Popconfirm, Input } from 'antd';
import { PolicysPage } from './FormInput.js';
import Styles from './view.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class EditableCell extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        value: this.props.value,
        editable: false,
    };    
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  check() {
    this.setState({ editable: false });
    if (this.props.onChange) {
      console.log(this.props.onChange());
      this.props.onChange(this.state.value);
    }
  }
  edit() {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (<div className="editable-cell">
      {
        editable ?
        <div className="editable-cell-input-wrapper">
          <Input
            value={value}
            onChange={(e) => this.handleChange(e)}
            onPressEnter={() => this.check()}
          />
          <Icon
            type="check"
            className="editable-cell-icon-check"
            onClick={() => this.check()}
          />
        </div>
        :
        <div className="editable-cell-text-wrapper">
          {value || ' '}
          <Icon
            type="edit"
            className="editable-cell-icon"
            onClick={() => this.edit()}
          />
        </div>
      }
    </div>);
  }
}

const ivr_policy = {
    "1": {
        "descrition": "核心网紧急告警ivr呼叫规则",
        "firstMan": "13802881394",
        "secondMan": "13802881394",
        "callTimes": "3",
        "callInterval": "30",
        "mergeInterval": 120 
    }
};


const data = [{
  key: '1',
  id: 'firstMan',
  value: '13820881394',
  descrition: 'New York No. 1 Lake Park',
}, {
  key: '2',
  id: 'secondMan',
  value: '13802881394',
  descrition: 'London No. 1 Lake Park',
}, {
  key: '3',
  id: 'MergeInterval',
  value: 120,
  descrition: 'Sidney No. 1 Lake Park',
}];

class View extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        bordered: false,
        loading: false,
        pagination: false,
        size: 'default',
    };
    this.columns = [{
  title: 'Id',
  dataIndex: 'id',
  key: 'id',
  render: text => <a href="#">{text}</a>,
}, {
      title: 'Value',
      dataIndex: 'value',
      width: '30%',
      key: 'value',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={(index, key) => this.onCellChange(index, 'value')}
        />
      ),
    }, {
  title: 'Descrition',
  dataIndex: 'descrition',
  key: 'descrition',
}];
  }

  onCellChange(index, key) {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }

  handleChange(value) {
    var data = [{
    key: '1',
    id: 'firstMan',
    value: '13820881394',
    descrition: 'New York No. 1 Lake Park',
    }, {
    key: '2',
    id: 'secondMan',
    value: '13802881394',
    descrition: 'London No. 1 Lake Park',
    }, {
    key: '3',
    id: 'MergeInterval',
    value: 120,
    descrition: 'Sidney No. 1 Lake Park',
    }];
    this.setState({policyid: ivr_policy[key]});
  }
  render() {
      var options = [];

      for(var key in ivr_policy){
        options.push(<Option value="key">{ivr_policy[key].descrition}</Option>);    
      }
        return (
        <div>
        <Row>
          <Col lg={4} md={6} sm={24} xs={24}>
            <Menu onClick={this.handleClick}
        style={{ width: 240 }}
        mode="inline"
      >
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
          <MenuItemGroup title="Item 1">
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
    
      </Menu>
          </Col>
          <Col lg={20} md={18} sm={24} xs={24} style={{padding: '50px'}} className="main-container">
            <div style= {{marginBottom: '20px'}}>
              
              <Select
              showSearch
              style={{ width: '220px', float: 'left', marginRight: '20px'}}
              placeholder="Select a policy"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {options}
              </Select>

              <PolicysPage style={{float: 'left'}} />
            </div>
            <div>
              <Table {...this.state} columns={this.columns} dataSource={data} />
            </div>
          </Col>
        </Row>
        </div>
      );
  }
}

ReactDOM.render(<View sytle={Styles}/>, document.getElementById('content'));