import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input ,Cascader, Switch ,Checkbox,Tooltip} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
import QueueAnim from 'rc-queue-anim';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;


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
	onCheckChange(e,i){
		const value = e.target.checked;
		const {data} = this.state;
		data[i].checked = value;
		this.setState({data});
		console.log('data after:' + JSON.stringify(data));
		this.props.onValueBack(this.state.data);
	}
	handlePrekpChange(value,i){
		const {data} = this.state;
		data[i].preKp = value;
		this.setState({data});
		console.log('data after:' + JSON.stringify(this.state.data));
		this.props.onValueBack(this.state.data);
	}
	displayRender(label){
		return label[label.length - 1];
	}
    render() {
    	const {data} = this.state;
    	var preoptions = [];
        for(var j = 0; j < data.length; j++) {
            preoptions.push(<Option key={j*data.length+j} value={j.toString()}>{j}</Option>);
        }
    	console.log('render data 步骤渲染:'+JSON.stringify(data));
    	var editunit = data.map((item,i,input) => {
    		// console.log('i item:' +i+' '+JSON.stringify(item));
    		return(
    			<div key={i}>
    				<Row type="flex" justify="space-between">
    					<Col span={10}>
    						<h3 className="step_input">{i+1}</h3>
    					</Col>
    					<Col span={10}></Col>
    				</Row>
    				<Row type="flex" justify="space-between">
		    			<Col span={10}>
		    				<Input 
					        	type="textarea" 
					        	onChange={(e)=>this.onInpChange(e,i)} 
					        	rows={5}
					    	/>
					    	<div className="chose_kp">
								<Cascader 
									options={options} 
									expandTrigger="hover" 
									onChange={(value, selectedOptions)=>this.onSelChange(value, selectedOptions,i)} 
									displayRender={(label)=>this.displayRender(label)} 
									placeholder="选择绑定知识点(Kp)" 
									showSearch
								/>
							</div>
							<Tooltip placement="topRight" title="请选择此题是否挂在此知识点">
								<div className="check_kp">
									<Checkbox onChange={(e)=>this.onCheckChange(e,i)}>主测点</Checkbox>
								</div>
							</Tooltip>
							<Tooltip placement="topRight" title="请选择前置知识点">
								<div className="select_prekp">
							      <Select  defaultValue={i.toString()} className="select_kp"  style={{ width: 40 }} onChange={(value)=>this.handlePrekpChange(value,i)}>
								  	{preoptions}
								  </Select>
								</div> 
						    </Tooltip>
		    			</Col>
						<Col span={10}>
							<Tex content={item.input_value} />
						</Col>
	    			</Row>
				</div>
			);
		});

		return (
			<div>
				<QueueAnim component="ul" type={['right', 'left']} leaveReverse>
	            	{editunit}
	            </QueueAnim>
			</div>	
        );
    }
}

class ChoiceEdit extends React.Component {
	constructor(props) {
        super(props);
        // console.log('this.props.visiable:' + JSON.stringify(this.props.visiable));
        this.state={visiable:this.props.visiable};
        if(this.props.visiable){
        	this.state={ choice_body:this.props.choice_body , choice_ans:this.props.choice_ans,display:'none' }
        }
        else{
        	this.state={ choice_body:this.props.choice_body , choice_ans:this.props.choice_ans,display:'block' }
        }
        // console.log(' ChoiceEdit this.state.display' + JSON.stringify(this.state.display));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visiable !== this.state.visiable){
        	if(nextProps.visiable){
        		this.setState({ display:'none' })
	        }
	        else{
	        	this.setState({ display:'block' })
	        }
        }
    }
    handleBodyChange(e){
    	const {choice_body} = this.state;
    	const value = e.target.value;
    	choice_body.body = value;
    	this.setState({choice_body});
    	this.props.onChoiceInputBack(this.state.choice_body);
    	// console.log('p_value:' + JSON.stringify(this.state.p_value));
    }
    handleAChange(e){
    	const {choice_body} = this.state;
    	const value = e.target.value;
    	choice_body.A = value;
    	this.setState({choice_body});
    	this.props.onChoiceInputBack(this.state.choice_body);
    }
    handleBChange(e){
    	const {choice_body} = this.state;
    	const value = e.target.value;
    	choice_body.B = value;
    	this.setState({choice_body});
    	this.props.onChoiceInputBack(this.state.choice_body);
    }
    handleCChange(e){
    	const {choice_body} = this.state;
    	const value = e.target.value;
    	choice_body.C = value;
    	this.setState({choice_body});
    	this.props.onChoiceInputBack(this.state.choice_body);
    }
    handleDChange(e){
    	const {choice_body} = this.state;
    	const value = e.target.value;
    	choice_body.D = value;
    	this.setState({choice_body});
    	this.props.onChoiceInputBack(this.state.choice_body);
    }
    handleAnsChange(value){
		this.setState({choice_ans:value});
		this.props.onChoiceAnsBack(this.state.choice_ans);
    }
    render(){
    	const {choice_body , choice_ans , display} = this.state;
    	return(
    		<div style={{display:display}}>
	    		<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
	    				<p className="edit_choice_body">选择题题干</p>
    					<Input type="textarea" onChange={(e)=>this.handleBodyChange(e)} rows={12} />
	    			</Col>
					<Col span={10}>
						<p className="edit_choice_body">选择题题干</p>
    					<Tex content={choice_body.body} />
					</Col>
				</Row>
				<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_choice_select">A:</p><Input className="edit_choice_input" type="textarea" onChange={(e)=>this.handleAChange(e)} rows={1} />
	    			</Col>
					<Col span={10}>
    					<p className="edit_choice_render">A: </p><Tex className="edit_choice_input" content={choice_body.A} />
					</Col>
				</Row>
				<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_choice_select">B:</p><Input className="edit_choice_input" type="textarea" onChange={(e)=>this.handleBChange(e)} rows={1} />
	    			</Col>
					<Col span={10}>
    					<p className="edit_choice_render">B: </p><Tex className="edit_choice_input" content={choice_body.B} />
					</Col>
				</Row>
				<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_choice_select">C:</p><Input className="edit_choice_input" type="textarea" onChange={(e)=>this.handleCChange(e)} rows={1} />
	    			</Col>
					<Col span={10}>
    					<p className="edit_choice_render">C: </p><Tex className="edit_choice_input" content={choice_body.C} />
					</Col>
				</Row>
				<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_choice_select">D:</p><Input className="edit_choice_input" type="textarea" onChange={(e)=>this.handleDChange(e)} rows={1} />
	    			</Col>
					<Col span={10}>
    					<p className="edit_choice_render">D: </p><Tex className="edit_choice_input" content={choice_body.D} />
					</Col>
				</Row>
				<Row className="choice_row" type="flex" justify="space-between">
	    			<Col span={10}>
    					<p>答案编辑</p>
    					<div>
						    <Select className="ans_row" style={{ width: 120 }} onChange={(value)=>this.handleAnsChange(value)}>
						      <Option value="A">A</Option>
						      <Option value="B">B</Option>
						      <Option value="C">C</Option>
						      <Option value="D">D</Option>
						    </Select>
    					</div>
	    			</Col>
					<Col span={10}>
    					<p>答案</p><div className="ans_row">{this.state.choice_ans}</div>
					</Col>
				</Row>
    		</div>
    	);
    }
}

class FillinblankEdit extends React.Component {
	constructor(props) {
        super(props);
        this.state={visiable:this.props.visiable};
        if(this.props.visiable){
        	this.state={ fillblank_body:this.props.fillblank_body, fillblank_ans:this.props.fillblank_ans, display:'none' }
        }
        else{
        	this.state={ fillblank_body:this.props.fillblank_body, fillblank_ans:this.props.fillblank_ans, display:'block' }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visiable !== this.state.visiable){
        	if(nextProps.visiable){
        		this.setState({ display:'none' })
	        }
	        else{
	        	this.setState({ display:'block' })
	        }
        }
    }
    handleBodyChange(e){
    	const value = e.target.value;
    	this.setState({fillblank_body:value});
    	this.props.onBlankInputBack(this.state.fillblank_body);
    }
    handleAnsChange(e){
    	const value = e.target.value;
    	this.setState({fillblank_ans:value});
    	this.props.onBlankAnsBack(this.state.fillblank_ans);
    }
    render(){
    	const {fillblank_body , fillblank_ans ,display} = this.state;
    	// console.log('render fillblank_body 题目编辑:'+JSON.stringify(fillblank_body));
    	// console.log('render fillblank display:'+JSON.stringify(display));
    	return(
    		<div style={{display:display}}>
	    		<Row type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_fillblank_body">填空题干</p>
    					<Input type="textarea" onChange={(e)=>this.handleBodyChange(e)} rows={12} />
					</Col>
					<Col span={10}>
						<p className="edit_fillblank_body">填空题干</p>
    					<Tex content={fillblank_body} />
	    			</Col>
	    		</Row>
	    		<Row type="flex" justify="space-between">
	    			<Col span={10}>
    					<p className="edit_fillblank_body">填空答案</p>
    					<Input type="textarea" onChange={(e)=>this.handleAnsChange(e)} rows={2} />
					</Col>
					<Col span={10}>
						<p className="edit_fillblank_body">填空答案</p>
    					<Tex content={fillblank_ans} />
	    			</Col>
	    		</Row>
    		</div>
    	);
    }
}


class ExerciseEditView extends React.Component {
	constructor(props) {
        super(props);
        this.state = {data:[{input_value:'',select_value:'', checked:false, preKp:'0'}],p_type:false,choice_body:{body:'',A:'',B:'',C:'',D:''},choice_ans:'',fillblank_body:'',fillblank_ans:''};
    }
    handleAdd(){
    	const {data} = this.state;
		const newData = {input_value:'',select_value:'', checked:false, preKp:(data.length).toString()};
		this.setState({data: [...data, newData]});
	}
	handleDel(){
		const {data} = this.state;
		data.splice(data.length-1,1);
		this.setState({data});
	}
	handleStepsBack(currentData){
		this.state.data = currentData;
		// this.setState({data:currentData});
	}
	handleChoiceInputBack(currentInput){
		this.state.choice_body = currentInput;
		// this.setState({p_edit_input:currentInput});
	}
	handleChoiceAnsBack(currentInput){
		this.state.choice_ans = currentInput;
		// this.setState({p_edit_input:currentInput});
	}
	handleBlankInputBack(currentInput){
		this.state.fillblank_body = currentInput;
		// this.setState({p_edit_input:currentInput});
	}
	handleBlankAnsBack(currentInput){
		this.state.fillblank_ans = currentInput;
		// this.setState({p_edit_input:currentInput});
	}
	switchChange(checked){
		this.setState({p_type:checked});
		// console.log('p_type after:' + JSON.stringify(this.state.p_type));
	}
    render(){
    	const {p_edit_input} = this.state;
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
       						<Switch 
							checkedChildren={'填空'} 
							unCheckedChildren={'选择'}
							onChange = {(checked)=>this.switchChange(checked)}
							/>
							<ChoiceEdit visiable = {this.state.p_type} 
							choice_body = {this.state.choice_body} 
							choice_ans = {this.state.choice_ans}
							onChoiceInputBack={(currentInput)=>this.handleChoiceInputBack(currentInput)}
							onChoiceAnsBack={(currentInput)=>this.handleChoiceAnsBack(currentInput)}
							/>

							<FillinblankEdit visiable = {!this.state.p_type} 
							fillblank_body = {this.state.fillblank_body}
							fillblank_ans = {this.state.fillblank_ans}
							onBlankInputBack={(currentInput)=>this.handleBlankInputBack(currentInput)}
							onBlankAnsBack={(currentInput)=>this.handleBlankAnsBack(currentInput)}
							/>
							<br/>
							<p>知识点分解</p>
							<Row type="flex" justify="space-between">
				    			<Col span={10}>
				    				<Row type="flex" justify="space-between">
				    					<Col span={10}>
				    						<Button 
												className="kpstepedit-add-btn" 
												type="dashed" 
												onClick={()=>this.handleAdd()}
												><Icon type="plus" /> 添加
											</Button>
				    					</Col>
										<Col span={10}>
											<Button 
												className="kpstepedit-del-btn" 
												type="dashed" 
												onClick={()=>this.handleDel()}
												><Icon type="minus" /> 删除
											</Button>
										</Col>
						    		</Row>
						    	</Col>
								<Col span={10}></Col>
				    		</Row>
							<KpStepEdit 
							value={this.state.data}
							onValueBack={(currentData)=>this.handleStepsBack(currentData)}
							/>
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
