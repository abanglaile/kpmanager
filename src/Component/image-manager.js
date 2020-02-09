import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Modal, Input, Tabs ,Radio, Checkbox} from 'antd';
const { TextArea, Search } = Input;

import *as action from '../Action/';
import {connect} from 'react-redux';
import ExerciseImgUpload from './upload-qiniu.js';
import QueueAnim from 'rc-queue-anim';
import MidiPlayer from 'midi-player-js';
// var MidiPlayer = require('midi-player-js');

const { Header, Footer, Sider, Content, } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

var Player = new MidiPlayer.Player(function(event) {
  console.log(event);
});

class ImageManager extends React.Component {
    constructor(props) {
      super(props);
      this.state={delnum:0, delfile:[], visible:false, check_list : []};
    }

    componentDidMount(){
      // console.log(this.props.params.exercise_id);
      const {tab_state, radio_state} = this.props;
      if(tab_state == '1'){
        this.props.getMediaList('2');
      }else{
        if(radio_state){
          this.props.getMediaList(radio_state);
        }
      }
      this.props.updateMenu('5');
    }

    onTabChange(activeKey){
      const {radio_state} = this.props;
      console.log("activeKey:",activeKey);
      this.props.updateTabKey(activeKey);
      if(activeKey == '1'){
        this.props.getMediaList('2');
      }else{
        if(radio_state){
          this.props.getMediaList(radio_state);
        }
      }
    }

    renderMediaList(){
      const {media_list} = this.props;
      return media_list.map((item) => {
          return (
          <Row style={{marginTop: '18px'}}>
            <Col span={12}>
              <div style={{border:'dashed', borderWidth:'1px', borderColor:'#bfbfbf'}}>
                <div>
                  <Input value={item.url} />
                  <img style={{marginBottom:'3px',marginTop:'3px'}} src={item.url+'?t='+new Date().getTime()} />
                </div>
                {item.wav_url?
                  <div>
                    <div><Input  value={item.wav_url} /></div>
                    <div style={{marginTop:'3px'}}>
                      <audio ref="audio" src={item.wav_url+'?t='+new Date().getTime()} preload="metadata" controls />
                    </div>
                  </div>
                  :''
                }
              </div>
            </Col>
            <Col span={12}>
              <TextArea value={item.code} autosize={{ minRows: 8, maxRows: 12 }}/> 
            </Col>
          </Row>
          )
      })
    }

    delModalOnOk(){
      const {delfile} = this.state;
      const {radio_state} = this.props;
      console.log("delfile:",delfile);
      this.props.delSelectedFile(delfile, radio_state);
      this.setState({
        visible: false,
        delnum: 0,
        delfile:[],
        check_list:[],
      });
    }

    delModalOnCancel(){
      this.setState({
        visible: false,
      });
    }

    showDelModal(){
      this.setState({
        visible: true,
      });
    }

    renderDeleteView(){
      const {delnum} = this.state;//delnum待删除文件数，checked是否有选中
      return(
        delnum ? 
        <div style={{fontSize : '1rem',marginTop:'1rem'}}>
          <span style={{marginRight : '2rem',color:'#bfbfbf'}}>{delnum}个文件</span>
          <span><a style={{color:'red'}} onClick={()=>this.showDelModal()}><Icon  type="delete" /> 删除</a></span>
        </div>
        :
        null
      );
    }

    onOneBoxChange(e,i){
      var {check_list} = this.state;
      check_list[i]=e.target.checked;
      this.setState({
        check_list : check_list,
      });
      // console.log("check_list",this.state.check_list);

      var file = this.state.delfile;
      // console.log("delfile before",this.state.delnum);
      if(e.target.checked){
        file.push(e.target.value);
        this.setState({
          delfile : file,
          delnum : this.state.delnum + 1,
        });
        // console.log("push after",this.state.delnum);
      }else{
        file.remove(e.target.value);
        this.setState({
          delfile : file,
          delnum : this.state.delnum - 1,
        });
        // console.log("del after",this.state.delnum);
      }
      // console.log("e.target.value:",e.target.value);
      // console.log("delfile after",this.state.delfile);
    }

    renderUploadList(){
      const {radio_state} = this.props;
      return (
        radio_state ?
        <QueueAnim type={['right', 'left']} leaveReverse>
          {this.renderList()}
        </QueueAnim>
        :
        null
      );
    }

    renderList(){
      const {media_list} = this.props;
      const {check_list} = this.state;
      // console.log("check_list:",check_list);
      return media_list.map((item, i) => {
        return (
          <Row style={{marginTop: '18px'}}>
            <Col span={1}>
              <Checkbox checked={check_list[i]} value={item.url} onChange={(e) => this.onOneBoxChange(e, i)}></Checkbox>
            </Col>
            <Col span={9}>
              <div>
                <Input value={item.url} />
              </div>
            </Col>
            <Col span={1}>
            </Col>
            <Col span={10}>
              <img src={item.url} />
            </Col>
          </Row>
        )
     });
    }

    saveModalOnOk(){
      this.props.saveTestMedia(this.props.save_url,this.props.save_wav_url);
      this.props.saveModalCancel();
    }

    saveModalOnCancel(){
      this.props.saveUrlChange("");
      this.props.saveWavUrlChange("");
      this.props.saveModalCancel();
    }

    saveMedia(){
      const { save_url, wav_url, save_wav_url} = this.props;
      //save_url 为input框内的url，war_url为服务器保存的临时音频url，save_wav_url为上传到七牛服务器的音频url
      if(wav_url){
        if(save_wav_url){
          this.props.saveTestMedia(save_url, save_wav_url);
         //将图片和音频都替换，原图片url和音频url都不变
        }else{
          let now_wav_url = "http://cdn.zhiqiu.pro/" + new Date().getTime().toString() + "midi.wav";
          this.props.saveWavUrlChange(now_wav_url);
          this.props.saveTestMedia(save_url, now_wav_url);
          //新增音频url
        }
      }else{
        this.props.saveTestMedia(save_url, wav_url);
        //仅将图片替换
      }
    }

    //upload本地上传
    onRadioChange = (e) => {
      this.props.getMediaList(e.target.value);
      this.props.updateRadioKey(e.target.value);
      console.log('radio checked', e.target.value);
    }
    

    render(){
      console.log('save_url:',this.props.save_url);
      const {upload_url, tab_state, radio_state, wav_url, save_wav_url, test_url} = this.props;
      console.log("test_url:",test_url);
      // console.log("upload_url",upload_url);
      return(
        <Tabs type="card" defaultActiveKey={tab_state} onChange={(key)=>this.onTabChange(key)}>
          <TabPane tab="音乐" key="1">
            <div>
              <Row style={{marginTop: '18px'}}>
                <Col span={12}>
                  <div>
                    <TextArea value={this.props.test_code} autosize={{ minRows: 8, maxRows: 12 }} onChange={(e)=>this.props.codeChange(e.target.value)}/>
                    <Button style={{marginTop:'5px',marginBottom:'5px'}} onClick={() => this.props.codeRender(this.props.test_code)}>生成图片</Button>
                  </div>
                  <Search
                    placeholder="请输入要查找的url"
                    onSearch={(url) => this.props.searchMedia(url)}
                    enterButton
                    value={this.props.save_url}
                    onChange={e => this.props.saveUrlChange(e.target.value)}
                  />
                  <div style={{marginTop:'5px'}}>
                    <Button onClick={() => this.saveMedia()}>保存</Button>
                    <Button style={{marginLeft:'5px'}} onClick={() => this.props.saveModalOpen(wav_url)}>另存为</Button>
                  </div>  
                </Col>
                <Col span={12}>
                  <div><img src={this.props.test_url} /></div>
                  {/* <img src="http://119.23.41.237/kpmanager/img/test.png" /> */}
                  {wav_url ?
                    <div>
                      <audio ref="audio" src={this.props.wav_url} preload="metadata" controls />
                    </div>
                    :''
                  }
                </Col>
              </Row>
              {this.renderMediaList()}
              <Modal
                title="按以下url保存文件?"
                visible={this.props.modal_open}
                onOk={() => this.saveModalOnOk()}
                onCancel={() => this.saveModalOnCancel()}
              >
                <div><Input  addonBefore='图片' value={this.props.save_url} onChange={e => this.props.saveUrlChange(e.target.value)} /></div>
                {save_wav_url ?
                  <div style={{marginTop:'1rem'}}><Input addonBefore='音频' value={this.props.save_wav_url} onChange={e => this.props.saveWavUrlChange(e.target.value)} /></div>
                  :''
                }
              </Modal>
            </div>
          </TabPane>
          <TabPane tab="上传图片" key="2 ">
            <RadioGroup style={{marginBottom:'15px'}} onChange={(e) => this.onRadioChange(e)} value={radio_state}>
              <Radio  value={1}>数学</Radio>
              <Radio  value={2}>音乐</Radio>
              <Radio  value={3}>英语</Radio>
              <Radio  value={4}>物理</Radio>
              <Radio  value={5}>化学</Radio>
              <Radio  value={6}>地理</Radio>
              <Radio  value={7}>语文</Radio>
              <Radio  value={8}>政治</Radio>
              <Radio  value={9}>历史</Radio>
              <Radio  value={10}>生物</Radio>
            </RadioGroup>
            <Row style={{marginTop: '18px'}}>
              <Col span={10}>
                <ExerciseImgUpload courseid	={radio_state}/>
              </Col>
              <Col span={10}></Col>
            </Row>
            {this.renderDeleteView()}
            <Modal
                title="删除文件"
                visible={this.state.visible}
                onOk={() => this.delModalOnOk()}
                onCancel={() => this.delModalOnCancel()}
            >
              确认删除文件吗？
            </Modal>
            {this.renderUploadList()}
          </TabPane>
        </Tabs>
      	);
    }
}

export default connect(state => {
  var newState = state.imageData.toJS();
  // console.log("media_list:",JSON.stringify(newState.media_list));
  console.log('wav_url:', newState.wav_url);
  return {
    test_url : newState.test_url,
    test_code: newState.test_code,
    wav_url: newState.wav_url,
    save_url: newState.save_url,
    save_wav_url: newState.save_wav_url,
    upload_url: newState.upload_url,
    media_list: newState.media_list,
    modal_open: newState.modal_open,
    isLoading: newState.isLoading,
    tab_state: newState.tab_state,
    radio_state: newState.radio_state,
  }
}, action)(ImageManager);


