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
const { TextArea } = Input;
const Option = Select.Option;

// const server_url = "http://127.0.0.1:3000";

class ExerciseTitle extends React.Component {

    constructor(props) { 
      super(props);
      this.state = {
        title_img_width: "auto",
        title_img_height: "3rem",
      };
    }

    titleImageLoaded(){
      console.log(this.title_img.width, window.innerWidth);
      if(this.title_img.width > window.innerWidth){
        this.setState({title_img_width: "90%", title_img_height: "auto"})
      }
    }


    render(){
    	var { exercise } = this.props;
      var { title, title_img_url, title_audio_url, exercise_id } = exercise;
      const {title_img_width, title_img_height} = this.state;
  		title = title ? title :'';
      return(
      		<div>
  	    		<Row className="choice_row" gutter={16} type="flex" justify="space-between">
  	    			<Col span={12}>
      					<TextArea
                    autosize={{ minRows: 12}} 
                    style={{font: "14px/1.4 proxima-nova, Helvetica Neue, Arial, Helvetica, sans-serif" }}
                    value={title} type="textarea" onChange={(e)=>this.props.titleChange(e.target.value)} />
  	    			</Col>
    					<Col span={12} style={{ background: '#fff', border: '1px solid #d9d9d9'}}>
                <div style = {{ padding: '5px' }}>
        					   <Tex content={title} />
                </div>
    					</Col>
    				</Row>
    				<Row gutter={16} style={{marginTop:"30px",marginBottom:"15px"}}>
    					<Col span={12}>
    					  <Input 
                  addonBefore="Title_Img"
                  value={title_img_url}
                  onChange={(e) => this.props.titleImgChange( e.target.value )}
                />  
              </Col>
    					<Col span={12}>
    				    <img src={title_img_url} height="100px"
                  ref={element => {this.title_img = element;}}
                  onLoad = {() => this.titleImageLoaded()} 
                  style={{width: title_img_width, height: title_img_height}}
                />
              </Col>
    				</Row>
            <Row gutter={16} style={{marginTop:"30px",marginBottom:"15px"}}>
              <Col span={12}>
                <Input 
                  addonBefore="Title_Audio"
                  value={title_audio_url} 
                  onChange={(e) => this.props.titleAudioChange( e.target.value )}
                />               
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
    exercise : newState.exercise,
    isLoading: newState.isLoading,
  }
}, action)(ExerciseTitle);


