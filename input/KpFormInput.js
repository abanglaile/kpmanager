import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, Input, Radio } from 'antd';
const FormItem = Form.Item;
import NetUtil from './utils/NetUtil';

class AddCreateForm extends React.Component {}
AddCreateForm = Form.create({})(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new kp"
        okText=" 创建"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form vertical>
          <FormItem label="序号">
            {getFieldDecorator('kpindex', {
              rules: [{ required: true, message: 'Please input the kpindex of kp!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="知识点名称">
            {getFieldDecorator('kpname', {
              rules: [{ required: true, message: 'Please input the kpname of kp!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input the description of kp!' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export const AddKpPage = React.createClass({
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
    
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var reqdata = JSON.stringify(values);
      var dataline = {chapterid:512,form:values};
      console.log('dataline:'+JSON.stringify(dataline));
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
      
      this.props.onCreate(dataline);
    });      
  },
  saveFormRef(form) {
    this.form = form;
  },
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New Kp</Button>
        <AddCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  },
});