import React, { Component } from 'react';
import { message, Spin, Tooltip, Upload, Button, Icon } from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
import Config from '../utils/Config';

let target = Config.server_url;

// import 'whatwg-fetch';
import 'es6-promise';

// var server_url = Config.server_pic_url;
var pic_domain = "http://cdn.zhiqiu.pro/";
class ExerciseImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, fileList: this.props.fileList, token: null};
  }
  
  componentDidMount(){
    	this.props.getQiniuToken();
  }

  onRemove(file){
    if(file.error){
      this.props.onRemove();
      return true;
    }
    this.setState({loading: true});
    var {fileList} = this.state;
    let url = target + "/delQiniuPic";
    return dispatch => {
      return axios.post(url, {key: file.name})
      .then(function (response) {
        this.setState({loading: false, fileList: []}); 
        message.error(`${file.name} file deleted successfully.`);
      })
      .catch(function (error) {
        console.log('err:',url, err);//网络请求失败返回的数据        
        this.setState({loading: false});
        message.error(`${file.name} file deleted failed.`);
      });
    }     
  }

  handleChange(info){
    const {courseid} = this.props;
    let file = info.file; 
    if (file.status !== 'uploading') {
      //console.log(info.file, info.fileList);
    }
    if (file.status === 'done') {
      file.name = file.response.key;
      // Component will show file.url as link
      file.url = pic_domain + file.response.key;
      this.props.saveUploadUrl(file.url,courseid);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({ fileList: [file]});
  }

  render() {
    var {fileList, loading} = this.state;
    const {courseid} = this.props;
    console.log("courseid:",courseid);
    // const {token} = this.props;
    // console.log(token);
    const props = {
      action: 'http://upload-z2.qiniup.com',
      onChange: (info) => this.handleChange(info),
      onRemove: (file) => this.onRemove(file),
      data: (file)=>{//支持自定义保存文件名、扩展名支持
          let token = this.props.token; 
          let key = new Date().getTime().toString();
          return {token, key}
        },
    };
    
    return ( 
      <Spin spinning = {loading} >
          <Upload {...props} fileList={this.state.fileList}>
            <Button disabled={courseid ? false : true}>
              <Icon type="upload" />上传图片
            </Button>
          </Upload>
      </Spin>
    );
  }
}

export default connect(state => {
  var newState = state.imageData.toJS();
  return {
    token : newState.uptoken,
  }
}, action)(ExerciseImgUpload);