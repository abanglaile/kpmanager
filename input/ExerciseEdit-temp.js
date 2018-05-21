import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input ,Cascader  } from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './exerciseEdit.css';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;


var options = [{
		  value: 'zhejiang',
		  label: 'Zhejiang',
		  children: [{
		    value: 'hangzhou',
		    label: 'Hangzhou',
		    children: [{
		      value: 'xihu',
		      label: 'West Lake',
		    }],
		  }],
		}, {
		  value: 'jiangsu',
		  label: 'Jiangsu',
		  children: [{
		    value: 'nanjing',
		    label: 'Nanjing',
		    children: [{
		      value: 'zhonghuamen',
		      label: 'Zhong Hua Men',
		    }],
		  }],
		}];

class KpStepEdit extends React.Component {
	constructor(props) {
        super(props);
        this.state={ data:this.props.value };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.data){
        	this.setState({ data: nextProps.value });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value.length !== this.state.data.length;
    }
	onSelChange(value, selectedOptions,i){
		const {data} = this.state;
		data[i].select_value = value;
		this.setState({data});
		console.log('data:' + JSON.stringify(data));
		this.props.onValueBack(this.state.data);
	}
	onInpChange(e,i){
		const value = e.target.value;
		const {data} = this.state;
		data[i].input_value = value;
		this.setState({data});
		console.log('data after:' + JSON.stringify(this.state.data));
		this.props.onValueBack(this.state.data);
	}
	displayRender(label){
		return label[label.length - 1];
	}
    render() {
    	const {data} = this.state;

    	var editunit = data.map((item,i,input) => {
    		return(
    			<div key={i}>
		        	<Input 
			        	type="textarea" 
			        	onChange={(e)=>this.onInpChange(e,i)} 
			        	rows={5}
			    	/>
					<Cascader 
						options={options} 
						expandTrigger="hover" 
						onChange={(value, selectedOptions)=>this.onSelChange(value, selectedOptions,i)} 
						displayRender={(label)=>this.displayRender(label)} 
						placeholder="Please select" 
						showSearch
					/>
				</div>
			);
		});
		return (
			<div>
				{editunit}
			</div>	
        );
    }
}


class ExerciseEditView extends React.Component {
	constructor(props) {
        super(props);
        this.state = {data:[{input_value:'',select_value:''}]};
    }
    handleAdd(){
    	const {data} = this.state;
		const newData = {input_value:'',select_value:''};
		console.log('whole data before:' + JSON.stringify(this.state.data));
		this.setState({data: [...data, newData]});
		console.log('whole data after:' + JSON.stringify(this.state.data));
	}
	handleBack(currentData){
		this.setState({data:currentData});
		console.log('currentData:' + JSON.stringify(this.state.data));
	}
    render(){
    	return(
    		<Layout>
      			<Sider width={200} style={{ background: '#fff' }}>
			        <Menu
			          mode="inline"
			          defaultSelectedKeys={['1']}
			          defaultOpenKeys={['sub1']}
			          style={{ height: '100%' }}
			        >
			          <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
			            <Menu.Item key="1">option1</Menu.Item>
			            <Menu.Item key="2">option2</Menu.Item>
			            <Menu.Item key="3">option3</Menu.Item>
			            <Menu.Item key="4">option4</Menu.Item>
			          </SubMenu>
			          <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
			            <Menu.Item key="5">option5</Menu.Item>
			            <Menu.Item key="6">option6</Menu.Item>
			            <Menu.Item key="7">option7</Menu.Item>
			            <Menu.Item key="8">option8</Menu.Item>
			          </SubMenu>
			          <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
			            <Menu.Item key="9">option9</Menu.Item>
			            <Menu.Item key="10">option10</Menu.Item>
			            <Menu.Item key="11">option11</Menu.Item>
			            <Menu.Item key="12">option12</Menu.Item>
			          </SubMenu>
       				</Menu>
      			</Sider>
      			<Layout>
       				<Header style={{ background: '#fff', padding: 0 }} />
       				<Content style={{ margin: '0 16px' }}>
       					<div>
       						<Row type="flex" justify="space-around">
      							<Col span={10}>
      								<p>题目编辑</p>
      								<Input type="textarea" rows={15} />
      								<p>答案编辑</p>
      								<Input type="textarea" rows={8} />
      								<br/>
      								<p>知识点分解</p>
      								<Button 
      								className="kpstepedit-add-btn" 
      								type="dashed" 
      								onClick={()=>this.handleAdd()}
      								>+ 添加</Button>
      								<KpStepEdit 
      								value={this.state.data}
      								onValueBack={(currentData)=>this.handleBack(currentData)}
      								/>
      							</Col>
      							<Col span={10}>col-10</Col>
    						</Row>
       					</div>
       				</Content>
        			<Footer style={{ textAlign: 'center' }}>
            			题目编辑&知识点分解
          			</Footer>
      			</Layout>
    		</Layout>

    	);
    }

}

ReactDOM.render( < ExerciseEditView />, document.getElementById('content'));

<FillinblankEdit visiable = {!this.state.p_type} />

@c = \pm\sqrt{a^2 + b^2}@