import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon,Table, Menu, Select, Button,Breadcrumb, Popconfirm ,Checkbox,TreeSelect,Modal} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './testCenter.css';
import QueueAnim from 'rc-queue-anim';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

var urlip = 'http://127.0.0.1/klmanager/';

var data_init = [{
  key: '1',
  testid: 'Test01',
  testname: '20170428小测',
  teststate: 1,
  time: '2pm',
}, {
  key: '2',
  testid: 'Test02',
  testname: '20170428中测',
  teststate: 1,
  time: '3pm',
}, {
  key: '3',
  testid: 'Test03',
  testname: '20170428大测',
  teststate: 0,
  time: '4pm',
}]; 

var treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0',
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1',
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2',
  }],
}];

class TestCenter extends React.Component{
    constructor(props) {
        super(props);
        this.state={data: data_init ,current: '512',visible:false,teacher_id : 1,tree_value:[],treeData:[]};
        this.columns = [{
            title: '测试ID',
            dataIndex: 'testid',
            width: '20%',
        }, {
            title: '测试名称',
            dataIndex: 'testname',
            width: '25%',
        }, {
            title: '状态',
            dataIndex: 'teststate',
            width: '15%',
            render: (text, record) => {
              return(
                <span >
                  <font color={record.teststate? "red" : "#00a854"}>{record.teststate? "未发布" : "已发布"}</font>
                </span>
              );
            },
        }, {
            title: '测试时间',
            dataIndex: 'time',
            width: '20%',
        }, {
            title: '操作',
            dataIndex: 'action',
            render: (text, record,index) => {
              return(
                <span>
                  <a onClick={()=>this.onTest()}>测试</a>
                  <span className="ant-divider" />
                  < Popconfirm title = "确定删除?" onConfirm = {() => this.onDelete(index)} >
                      < a href = "#" > 删除 < /a> 
                  </Popconfirm >
                  <span className="ant-divider" />
                  <a onClick={()=>this.onCopy(index)}>复制</a>
                </span>
              );
            },
        }];
    }
    
    onTest(){
      const {treeData,tree_value} = this.state; 
      this.setState({visible : true},()=>{
            var data = []; 
            var url = urlip+'getStudentGroup';
            NetUtil.get(url, {teacher_id : this.state.teacher_id}, (results) => {
                data = results;
                this.setState({ treeData : data}); 
            })                         
      });
    }
    
    onCopy(index){
      const {data} = this.state;

    }

    onChange(value){
      // console.log("value:"+value);
      this.setState({ tree_value : value });
      // console.log("tree_value:"+value);
    }

    onDelete(index){
      const { data } = this.state;
      // var url = urlip+'delete';                                                                                                                                                                                                                           
      // var kpid = { kpid: data[index].kpid };
      // // console.log('delete kpid:' + JSON.stringify(kpid));
      // NetUtil.post(url, kpid, '', (results) => { console.log(results); })
      data.splice(index, 1);
      this.setState({ data });
    }

    handleOk(){
      this.setState({
          visible: false,
      });
    }

    handleCancel(){
      this.setState({
        visible: false,
      });
    }

    handleAddTest(){

    }

    render(){
      const {data,tree_value,visible,treeData} = this.state;
      const tProps = {
        treeData : treeData,
        value: tree_value,
        onChange: (value)=>this.onChange(value),
        multiple: true,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: '请选择测试组',
        style: {
          width: 300,
        },
      };
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
                    <Menu.Item key="2">option5</Menu.Item>
                    <Menu.Item key="3">option6</Menu.Item>
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
                <Button className="add_btn" onClick={()=>handleAddTest()} type="primary">添加测试</Button>
                <Modal title="试题分发" visible={visible} width={500} onOk={()=>this.handleOk()} onCancel={()=>this.handleCancel()} okText="确定">
                    <TreeSelect {...tProps}/>
                </Modal>
                < Table columns = { this.columns } dataSource = { data }/> 
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
ReactDOM.render( < TestCenter sytle = { Styles }/>, document.getElementById('content'));