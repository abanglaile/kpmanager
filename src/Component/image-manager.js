import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Modal, Input} from 'antd';
const { TextArea, Search } = Input;

import *as action from '../Action/';
import {connect} from 'react-redux';

import FileUpload from './upload-qiniu.js';
const { Header, Footer, Sider, Content, } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;

const server_url = "http://127.0.0.1:3000";

class ImageManager extends React.Component {

    componentDidMount(){
      console.log(this.props.params.exercise_id);
      this.props.getMediaList();
    }

    renderMediaList(){
      const {media_list} = this.props;
      return media_list.map((item) => {
          return (
          <Row style={{marginTop: '18px'}}>
            <Col span={12}>
              <div>
                <Input value={item.url} />
                <img src={item.url} />
              </div>
            </Col>
            <Col span={12}>
              <TextArea value={item.code} autosize={{ minRows: 8, maxRows: 12 }}/> 
            </Col>
          </Row>
          )
      })
    }

    saveModalOnOk(){
      this.props.saveTestMedia(this.props.save_url);
      this.props.saveModalCancel();
    }

    saveModalOnCancel(){
      this.props.saveUrlChange("");
      this.props.saveModalCancel();
    }

    render(){
      console.log(this.props.save_url);
      return(
      		<div>
  	    		<Row style={{marginTop: '18px'}}>
  	    			<Col span={12}>
                <div>
                  <TextArea value={this.props.test_code} autosize={{ minRows: 8, maxRows: 12 }} onChange={(e)=>this.props.codeChange(e.target.value)}/>
                  <Button onClick={() => this.props.codeRender(this.props.test_code)}>生成图片</Button>
                </div>
                <Search
                  placeholder="input search text"
                  onSearch={(url) => this.props.searchMedia(url)}
                  enterButton
                  value={this.props.save_url}
                  onChange={e => this.props.saveUrlChange(e.target.value)}
                />
                <div>
                  <Button onClick={() => this.props.saveTestMedia(this.props.save_url)}>保存</Button>
                  <Button onClick={this.props.saveModalOpen}>另存为</Button>
                </div>  
  	    			</Col>
    					<Col span={12}>
                <img src={this.props.test_url} />
    					</Col>
    				</Row>
    				
            {this.renderMediaList()}
            <Modal
              title="Save media as this url?"
              visible={this.props.modal_open}
              onOk={() => this.saveModalOnOk()}
              onCancel={() => this.saveModalOnCancel()}
            >
              <Input value={this.props.save_url} onChange={e => this.props.saveUrlChange(e.target.value)} />
            </Modal>
      		</div>
      	);
    }
}

export default connect(state => {
  var newState = state.imageData.toJS();
  return {
    test_url : newState.test_url,
    test_code: newState.test_code,
    save_url: newState.save_url,
    media_list: newState.media_list,
    modal_open: newState.modal_open,
    isLoading: newState.isLoading,
  }
}, action)(ImageManager);


