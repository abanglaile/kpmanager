import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input ,Cascader, Checkbox, Tooltip} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
import QueueAnim from 'rc-queue-anim';

import *as action from '../Action/';
import {connect} from 'react-redux';

import FileUpload from './upload-qiniu.js';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;

const server_url = "http://127.0.0.1:3000";

class ExerciseTitle extends React.Component {

    render(){
    	var { title, title_img_url, title_audio_url, exercise_id } = this.props;
  		title = title ? title :'';
      return(
      		<div>
  	    		<Row className="choice_row" gutter={16} type="flex" justify="space-between">
  	    			<Col span={12}>
      					<Input 
                    style={{font: "14px/1.4 proxima-nova, Helvetica Neue, Arial, Helvetica, sans-serif" }}
                    value={title} type="textarea" onChange={(e)=>this.props.titleChange(e.target.value)} rows={12} />
  	    			</Col>
    					<Col span={12} style={{ background: '#fff', border: '1px solid #d9d9d9'}}>
                <div style = {{ padding: '5px' }}>
        					   <Tex content={title} />
                </div>
    					</Col>
    				</Row>
    				<Row gutter={16}>
    					<Col span={12}>
    						<FileUpload button='Title_Img' onChange={file => this.props.titleImgChange(file.url)} onRemove={() => this.props.titleImgRemove()} />
    					</Col>
    					<Col span={12}>
    				    <img src={title_img_url} height="100px"/>
                </Col>
    				</Row>
            <Row gutter={16}>
              <Col span={12}>
                <FileUpload button='Title_Audio' onChange={file => this.props.titleAudioChange(file.url)} onRemove={() => this.props.titleAudioRemove()} />
              </Col>
              <Col span={12}>
                <audio src={title_audio_url} controls="controls">
                    Your browser does not support the audio element.
                </audio>
              </Col>
            </Row>
      		</div>
      	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
  	title: newState.title,
  	title_img_url: newState.title_img_url,
    title_audio_url: newState.title_audio_url,
    exercise_id: newState.exercise_id, 
    isLoading: newState.isLoading,
  }
}, action)(ExerciseTitle);


