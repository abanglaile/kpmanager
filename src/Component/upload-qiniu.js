import React, { Component } from 'react';
import { message, Spin, Tooltip, Upload, Button, Icon } from 'antd';
import NetUtil from '../utils/NetUtil';
import Config from '../utils/Config';

import 'whatwg-fetch';
import 'es6-promise';

var server_url = Config.server_pic_url;
var pic_domain = "http://opgtvzbwx.bkt.clouddn.com/";
export default class ExerciseImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, fileList: this.props.fileList};
  }
  
  componentDidMount(){
    	this.getToken();
  }

  getToken(){
  	var url = server_url + "/klmanager/qiniu/getToken";
  	NetUtil.get(url, [], json => {
  		this.state.token = json.uptoken;
      //this.state.key = json.savekey;
  	}, errors => console.log(errors));
  }

  onRemove(file){
    if(file.error){
      this.props.onRemove();
      return true;
    }
    this.setState({loading: true});
    var {fileList} = this.state;
    var url = server_url + "/klmanager/qiniu/delPic";
    return new Promise((resolve, reject) => {
      fetch(url, {
          method: 'POST',
          headers:{
                'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({key: file.name}), 
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            this.props.onRemove();
            resolve(response.json());
        }else{
            const error = new Error(response.statusText);
            throw error;
        }
      }).then((responseData) => {
            this.setState({loading: false, fileList: []}); 
            message.error(`${file.name} file deleted successfully.`);
      }).catch((err) => {
            console.log('err:',url, err);//网络请求失败返回的数据        
            this.setState({loading: false});
            message.error(`${file.name} file deleted failed.`);
            reject(err);
      });
    });
  }

  handleChange(info){

    //let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-2);

    // 2. read from response and show file link
    // fileList = fileList.map((file) => {
    //   if (file.response) {
    //     if(file.response.error){
    //       console.log(file.response.error);
    //     }else{
    //       file.name = this.props.name;
    //       // Component will show file.url as link
    //       file.url = pic_domain + file.response.key;
    //       this.props.onChange(file);
    //     }
    //   }
    //   return file;
    // });
    //
    let file = info.file; 
    if (file.status !== 'uploading') {
      //console.log(info.file, info.fileList);
    }
    if (file.status === 'done') {
      file.name = file.response.key;
      // Component will show file.url as link
      file.url = pic_domain + file.response.key;
      this.props.onChange(file);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({ fileList: [file]});
  }

  render() {
    var {fileList, loading} = this.state;
    const props = {
      action: 'http://up-z2.qiniu.com',
      onChange: (info) => this.handleChange(info),
      onRemove: (file) => this.onRemove(file),
      data: (file)=>{//支持自定义保存文件名、扩展名支持
          let token = this.state.token; 
          let key = new Date().getTime().toString();
          return {token, key}
        },
    };
    
    return ( 
      <Spin spinning = {loading} >
          <Upload {...props} fileList={this.state.fileList}>
            <Button>
              <Icon type="upload" /> {this.props.button}
            </Button>
          </Upload>
      </Spin>
    );
  }
}