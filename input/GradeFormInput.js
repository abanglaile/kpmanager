import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Select, Modal, Form, Input, Radio , Icon} from 'antd';
import NetUtil from './utils/NetUtil';
const FormItem = Form.Item;
const Option = Select.Option;


class ModifyForm extends React.Component {}
ModifyForm = Form.create({})(
  (props) => {
    const { visible, onCancel, onCreate, form , grade ,eval_desc} = props;
    const { getFieldDecorator } = form;
    // console.log('grade:'+{grade});
    return (
      <Modal
        visible={visible}
        title="修改评级"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form vertical>
          <FormItem label="评级">
            {getFieldDecorator('grade', {
              rules: [{ required: true, message: 'Please input the grade of kp!' }],
              // initialValue : grade,
            })(
              <Select initialValue={grade} style={{ width: 50 }}>
                <Option value='-1'>  </Option>
                <Option value='A'>A</Option>
                <Option value='B'>B</Option>
                <Option value='C'>C</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="备注" >
            {getFieldDecorator('eval_desc', {
              rules: [{ required: true, message: 'Please input the description of kp!' }],
              initialValue : eval_desc,
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export const ModifyGradePage = React.createClass({
  getInitialState() {
    return { visible: false ,
             grade : -1,
             eval_desc : ''
           };
  },
  showModal() {
    this.setState({visible: true, grade:this.props.property.grade, eval_desc:this.props.property.eval_desc});
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
      var dataline = {kpid:this.props.property.key,userid:1,grade:values.grade,eval_desc:values.eval_desc};
      console.log('dataline:'+JSON.stringify(dataline));
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
      
      this.props.onSave(dataline);
    });      
  },
  saveFormRef(form) {
    this.form = form;
  },
  render() {
    return (
      <div>
        <Icon className="modify_icon" type="edit" onClick={this.showModal}/>
        <ModifyForm
          grade={this.state.grade}
          eval_desc={this.state.eval_desc}
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  },
});