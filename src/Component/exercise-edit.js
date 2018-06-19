import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input ,Cascader, Checkbox, Tooltip} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';

import { Link } from 'react-router';

import *as action from '../Action/';
import {connect} from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import ExerciseImgUpload from './upload-qiniu.js';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;


class ExerciseEditView extends React.Component {

    componentDidMount(){
    	console.log(this.props.params.exercise_id);
    	if(this.props.params.exercise_id > 0){
    		//加载已有题目信息
    		this.props.getExercise(this.props.params.exercise_id);
        this.props.getSampleList(this.props.params.exercise_id);
    	}
    }

	
    render(){
    	const link1 = "/kpmanager/main/" + this.props.params.exercise_id;
    	const link2 = "/kpmanager/breakdown/" + this.props.params.exercise_id;
      const link3 = "/kpmanager/sample/" + this.props.params.exercise_id;
      const link4 = "/kpmanager/exerciseViewByKp";
      const link5 = "/kpmanager/image_manager";
      const {exercise_id, menu_state} = this.props;
    	var selectKeys = [menu_state];
      console.log(selectKeys);
      return(
    		<Layout>
    			<Sider width={200} style={{ background: '#fff' }}>
			        <Menu
			          mode="inline"
			          defaultSelectedKeys={['1']}
                selectedKeys={selectKeys}
			          style={{ height: '100%' }}
			        >
			            
			            <Menu.Item key="1">
			            	<Link to={ link1 } >
            				<Icon type="mail" />
            					题干与答案
            				</Link>
          				</Menu.Item>
          				<Menu.Item key="2">
          					<Link to={ link2 } >
            				<Icon type="mail" />
            					知识点分解
            				</Link>
          				</Menu.Item>
          				<Menu.Item key="3">
                    <Link to={ link3 } >
            				<Icon type="mail" />
            					参数输入
                    </Link>
          				</Menu.Item>
                  <Menu.Item key="4">
                    <Link to={ link4 } >
                    <Icon type="mail" />
                      录题情况
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to={ link5 } >
                    <Icon type="mail" />
                      图片管理
                    </Link>
                  </Menu.Item>
       				</Menu>
      			</Sider>
      			<Content style={{ padding: '0 24px', minHeight: 600}}>
      				{this.props.children}
      			</Content>
    		</Layout>
    	);
    }

}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
    exercise_id: newState.exercise.exercise_id, 
    isLoading: newState.isLoading, 
    menu_state: newState.menu_state,
  }
}, action)(ExerciseEditView);
