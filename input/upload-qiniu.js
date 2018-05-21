import React, { Component } from 'react';
import { Spin, Upload, Button, Icon } from 'antd';
import NetUtil from './utils/NetUtil';

var server_url = "http://127.0.0.1:3000";
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
  	NetUtil.get(url, []).then(json => {
  		this.state.token = json.uptoken;
      this.state.key = json.savekey;
  	});
  }

  onRemove(file){
    this.setState({loading: true});
    var url = server_url + "/klmanager/qiniu/delPic";
    NetUtil.post(url, {key: file.name}, null).then(json => {
      var {fileList} = this.state;
      for(var i = 0; i < fileList.length; i++){
        if(fileList[i].uid == file.uid){
          fileList.splice(i, 1);
          break;
        }
      }
      this.setState({loading: false, fileList: fileList});
      //回调删除
      this.props.onChange(file);
    }, err => {
      alert(err);
      this.setState({loading: false});
    });
    return false;
  }

  handleChange(info){
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = pic_domain + file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  }

  render() {
    var {fileList, loading} = this.state;
    const props = {
      action: 'http://up-z2.qiniu.com',
      onChange: (info) => this.handleChange(info),
      onRemove: (file) => this.onRemove(file),
      data: (file)=>{//支持自定义保存文件名、扩展名支持
          let token = this.state.token, key = this.state.key;
          return {token, key}
        },
    };
    
    return ( 
      <Spin spinning = {loading} >
          <Upload {...props} fileList = {this.state.fileList}>
            <Button>
              <Icon type="upload" /> upload
            </Button>
          </Upload>
      </Spin>
    );
  }
}