import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon,Table, Menu, Select, Button,Breadcrumb, Popconfirm ,Checkbox,Collapse} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './stu_manager.css';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Panel = Collapse.Panel;

var urlip = 'http://127.0.0.1/klmanager/';

var data_init = [{
  key: '1',
  student_id: '001',
  student_name: '小明',
  stu_phone: '13802882111',
}, {
  key: '2',
  student_id: '002',
  student_name: '奇哥',
  stu_phone: '13802882112',
}, {
  key: '3',
  student_id: '003',
  student_name: '张三',
  stu_phone: '13802882114',
}]; 

class StuManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={data: data_init,teacher_id : 1};
        this.columns = [{
            title: '学生姓名',
            dataIndex: 'student_name',
            width: '30%',
        }, {
            title: '学号',
            dataIndex: 'student_id',
            width: '30%',
        }, {
            title: '手机号',
            dataIndex: 'stu_phone',
            width: '40%',
        }];
    }

    render(){
      const {data} = this.state;
      
      return(
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 120px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%' }}
                >
                  <SubMenu key="sub1" title={<span><Icon type="user" />动态</span>}>
                    <Menu.Item key="1">option1</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" title={<span><Icon type="laptop" />学生管理</span>}>
                  </SubMenu>
                  <SubMenu key="sub3" title={<span><Icon type="notification" />测试中心</span>}>
                    <Menu.Item key="4">option9</Menu.Item>
                    <Menu.Item key="5">option10</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub4" title={<span><Icon type="notification" />我的收藏</span>}>
                    <Menu.Item key="6">option9</Menu.Item>
                    <Menu.Item key="7">option10</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <p className="p_class">班级分组</p>
                <Collapse accordion>
                  <Panel header={'三年二班'} key="1">
                    < Table columns = { this.columns } size="middle" dataSource = { data }/> 
                  </Panel>
                  <Panel header={'三年三班'} key="2">
                    < Table columns = { this.columns } size="middle" dataSource = { data }/> 
                  </Panel>
                  <Panel header={'三年四班'} key="3">
                    < Table columns = { this.columns } size="middle" dataSource = { data }/> 
                  </Panel>
                </Collapse>
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2017 Created by Bourne
          </Footer>
        </Layout> 
      );
    }
}
ReactDOM.render( < StuManager sytle = { Styles }/>, document.getElementById('content'));