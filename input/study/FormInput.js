import React, { Component } from 'react';
import ReactDOM from 'react-dom';color
import 'whatwg-fetch';
import 'es6-promise';
import { Button, Modal, Form, Input, Radio } from 'antd';
const FormItem = Form.Item;

class PolicyCreateForm extends React.Component {}
PolicyCreateForm = Form.create({})(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new policy"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form vertical>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input the description of policy!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="FirstMan">
            {getFieldDecorator('firstMan', {
              rules: [{ required: true, message: 'Please input the firstMan of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="SecondMan">
            {getFieldDecorator('secondMan', {
              rules: [{ required: true, message: 'Please input the secondMan of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="CallTimes">
            {getFieldDecorator('callTimes', {
              rules: [{ required: true, message: 'Please input the callTimes of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="CallInterval">
            {getFieldDecorator('callInterval', {
              rules: [{ required: true, message: 'Please input the callInterval of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="MergeInterval">
            {getFieldDecorator('mergeInterval', {
              rules: [{ required: true, message: 'Please input the mergeInterval of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export const PolicysPage = React.createClass({
  getInitialState() {
    return { visible: false };
  },
  showModal() {
    this.setState({ visible: true });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  handleCreate() {
    const form = this.form;
    
    //console.log(reqdata);
    
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var reqdata = JSON.stringify(values);
      console.log(reqdata);
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });

      fetch('http://127.0.0.1:3000/post/', {
            method: 'post',
            mode: "cors",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json', //记得加上这行，不然bodyParser.json() 会识别不了
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json()) //把response转为json
            .then((responseData) => { // 上面的转好的json
                    alert(responseData.status);
                 //console.log(responseData);
            })
            .catch((error)=> {
                alert(error);
            })

    });      
  },
  saveFormRef(form) {
    this.form = form;
  },
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New Policy</Button>
        <PolicyCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  },
});