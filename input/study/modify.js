import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Modal, Form } from 'antd';
const FormItem = Form.Item;
import HorizontalLoginForm from './FormInput.js'

export default class Modify extends React.Component {
    constructor(props) {
    	super(props);
      this.state = {firstMan: '13802881394', secondMan: '13802881394'};
  	}
    showModal() {
      this.setState({
        visible: true,
      });
    }
    handleOk() {
      this.setState({
        ModalText: 'Add a policy',
        confirmLoading: true,
    });
    setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
      }, 2000);
    }
    handleCancel() {
      console.log('Clicked cancel button');
      this.setState({
        visible: false,
      });
    }
    render() {
      var items = [];
      for(var key in this.policy){
        items.push(<div style = {{margin: '5px', padding: '5px'}}><h3 style={{margin: '5px'}}>{key}</h3><Input style={{width: '300px'}} /></div>);
      }
    	return (
        <div>
        <Button type="primary" onClick={() => this.showModal()}>增加</Button>
        <Modal title="Title of the modal dialog"
          visible={this.state.visible}
          onOk={() => this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={() => this.handleCancel()}
        >
          <HorizontalLoginForm />
        </Modal>
        </div>
      );
    }
}
ReactDOM.render(<Modify />, document.getElementById('content'));