import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input ,Cascader, Checkbox, Tooltip} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
import QueueAnim from 'rc-queue-anim';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;

const server_url = "http://127.0.0.1:3000";

class ExerciseTitle extends React.Component {
	constructor(props) {
        super(props);
        this.state = { title_body: props.titleProp }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.titleProp !== this.state.title_body){
        	this.setState({ title_body: nextProps.titleProp });
        }
    }
    handleBodyChange(e){
    	this.setState({title_body: e.target.value});
    	this.props.onChange(this.state.title_body);
    }
    render(){
    	var { title_body } = this.state;
		title_body = title_body?title_body:'';

    	return(
    		<div>
	    		<Row className="choice_row" gutter={16} type="flex" justify="space-between">
	    			<Col span={12}>
    					<Input value={title_body} type="textarea" onChange={(e)=>this.handleBodyChange(e)} rows={12} />
	    			</Col>
					<Col span={12}>
                        <div style = {{ height: '225px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
    					   <Tex content={title_body} />
                        </div>
					</Col>
				</Row>
    		</div>
    	);
    }
}

ExerciseTitle.propTypes = {
  titleProp: React.PropTypes.string,
  onChange: React.PropTypes.func
};

class ExerciseChoice extends React.Component {
	constructor(props) {
        super(props);
        this.state = { choiceArray: props.choiceArray };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.choiceArray !== this.state.choiceArray){
        	this.setState({ choiceArray: nextProps.choiceArray });
        }
    }
    onSelect(e, i){
        var { choiceArray } = this.state;
        choiceArray[i].correct = !choiceArray[i].correct;
    	this.setState({choiceArray});
    	this.props.onChange(this.state.choiceArray);
    }
    handleChange(e, i){
        var { choiceArray } = this.state;
        choiceArray[i].value = e.target.value;
        this.setState({choiceArray});
        this.props.onChange(this.state.choiceArray);
    }
    render(){
    	const { choiceArray } = this.state;
		const choice = choiceArray?choiceArray:[
		{value: '', correct: false}, 
		{value: '', correct: false},
		{value: '', correct: false},
		{value: '', correct: false}];//默认四个选项

        const choiceRow = choice.map((item, i) => {
            return(
                <Row className="choice_row" gutter={16} type="flex" justify="space-between">
                    <Col span={12}>
                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.onSelect(e, i)} />
                        <Input className="edit_choice_input" defaultValue={item.value} onChange={(e)=>this.handleChange(e, i)} rows={1} />
                    </Col>
                    <Col span={12}>
                        <Checkbox className="edit_choice_select" checked={item.correct} />
                        <Tex content={item.value} />
                    </Col>
                </Row>
                );
        });
    	return(
    		<div>
	    		{choiceRow}
    		</div>
    	);
    }
}

ExerciseChoice.propTypes = {
  choiceArray: React.PropTypes.array,
  onChange: React.PropTypes.func
};

class ExerciseEditBreakdown extends React.Component {
	constructor(props) {
        super(props);
        this.state={ breakdown: this.props.breakdown, kp_options:[] };
    }
    componentDidMount(){
    	this.loadKpOptions();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.breakdown !== this.state.breakdown){
        	this.setState({ breakdown: nextProps.breakdown });
        }
    }

    loadKpData(selectedOptions){
    	var url = server_url + "/klmanager/getChapterKp";
    	const targetOption = selectedOptions[selectedOptions.length - 1];
    	targetOption.loading = true;
		// load options lazily
		NetUtil.get(url, {chapter_id: targetOption.value}, (results) => {
			for(var i = 0; i < results.length; i++){
				results[i].value = results[i].kpid;
				results[i].label = results[i].kpname;
			}
			targetOption.loading = false;
			targetOption.children = results;
			this.setState({kp_options: [...this.state.kp_options]})
		});
  	}

    loadKpOptions(){
    	var url = "http://127.0.0.1:3000/klmanager/getBookChapter";    	
		NetUtil.get(url, {course_id: 1}, (results) => {
			for(var i = 0; i < results.length; i++){
				results[i].value = results[i].bookid;
				results[i].label = results[i].bookname;
				results[i].children = [];
				var chapters = results[i].chapters;
				for(var j = 0; j < chapters.length; j++){
					results[i].children.push({value: chapters[j].chapterid, label: chapters[j].chaptername, isLeaf: false});
				}
			}
			this.setState({kp_options: results})
		});
    }

    onAdd(){
    	const {breakdown} = this.state;
		const newData = {value:'', sn: breakdown.length + 1, presn:(breakdown.length).toString()};
		this.setState({breakdown: [...breakdown, newData]});
	}

	onDel(){
		const {breakdown} = this.state;
		breakdown.splice(breakdown.length-1,1);
		this.setState({breakdown});
		console.log(breakdown);
		this.props.onChange(this.state.breakdown);
	}
    
	onKpSelect(value, selectedOptions, i){
		const targetOption = selectedOptions[selectedOptions.length - 1];
		const {breakdown} = this.state;
		breakdown[i].kpid = targetOption.value;
		breakdown[i].kpname = targetOption.label;
		this.setState({breakdown});
		this.props.onChange(this.state.breakdown);
	}
	onInputChange(e,i){
		const value = e.target.value;
		const {breakdown} = this.state;
		breakdown[i].content = value;
		this.setState({breakdown});
		this.props.onChange(this.state.breakdown);
	}
	onCheckChange(e,i){
		const value = e.target.checked;
		const {breakdown} = this.state;
		breakdown[i].checked = value;
		this.setState({breakdown});
		this.props.onChange(this.state.breakdown);
	}
	handlePresnChange(value,i){
		const {breakdown} = this.state;
		breakdown[i].presn = value;
		this.setState({breakdown});
		this.props.onChange(this.state.breakdown);
	}
	displayRender(label){
		return label[label.length - 1];
	}
	//TODO:解决breakdown初始化问题
    render() {
    	var {breakdown, kp_options} = this.state;
    	breakdown = breakdown?breakdown:[{sn: 0, presn: 0, checked: false, content:''}];
    	
    	var preoptions = [];
        for(var j = 0; j < breakdown.length; j++) {
            preoptions.push(<Option key={j*breakdown.length+j} value={breakdown[j].presn}>{breakdown[j].presn}</Option>);
        }
        kp_options = kp_options?kp_options:[];

    	var editunit = breakdown.map((item,i) => {
    		return(
    			<div key={i}>
    				<Row type="flex" gutter={16} justify="space-between">
    					<Col span={12}>
    						<h3 className="step_input">{i+1}</h3>
    					</Col>
    					<Col span={12}></Col>
    				</Row>
    				<Row type="flex" gutter={16} justify="space-between">
		    			<Col span={12}>
		    				<Input 
					        	type="textarea" 
					        	onChange={(e)=>this.onInputChange(e,i)} 
					        	rows={5}
								value={item.content}
					    	/>
					    	<div className="chose_kp">
								<Cascader 
									options={kp_options} 
									expandTrigger="hover" 
									onChange={(value, selectedOptions)=>this.onKpSelect(value, selectedOptions,i)} 
									displayRender={(label)=>this.displayRender(label)} 
									placeholder="选择知识点" 
									loadData={(e) => this.loadKpData(e)}
								/>
							</div>
							<Tooltip placement="topRight" title="请选择此题是否挂在此知识点">
								<div className="check_kp">
									<Checkbox checked = { item.checked ? item.checked : false} onChange={(e)=>this.onCheckChange(e,i)}>主测点</Checkbox>
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
						<Col span={12}>
							<div style = {{ height: '100px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								<Tex content={item.content} />
							</div>
							<div style = {{ width: '250px', marginTop: '5px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								{item.kpname}
							</div>
						</Col>
	    			</Row>
				</div>
			);
		});

		return (
			<div>
				<div style={{marginTop: '10px'}}>
					<Button  
						icon="plus" 
						onClick={()=>this.onAdd()}
					>添加</Button>
					<Button 
						icon="minus"  
						onClick={()=>this.onDel()}
					>删除</Button>
				</div>
				<QueueAnim component="ul" type={['right', 'left']} leaveReverse>
	            	{editunit}
	            </QueueAnim>
			</div>	
        );
    }
}

ExerciseChoice.propTypes = {
  breakdown: React.PropTypes.array,
  onChange: React.PropTypes.func
};

var title = "题目：@c = \\pm\\sqrt{a^2 + b^2}@，请问答案是多少？";
var choice_answer = [
      { correct: 0, value: '@0 < m < 4@' },
      { correct: 1, value: '@0 \\leq m \\leq 4@' },
      { correct: 0, value: '@m \\geq 4@' },
      { correct: 0, value: '@0 < m \\leq 4@'}
    ];
var blank_answer = "@x + 4/3@";
var breakdown = [
      { sn: 0, presn: 0, checked: false, content: 'f(x)定义域为R,则@mx^2 + mx + 1 \\geq 0@恒成立'},
      { sn: 1, presn: 1, checked: true, content: '当@m \\neq 0@, @y = mx^2 + mx + 1@为二次函数，函数图像开口向上，与x轴最多只有一个交点。即@\\Delta = m^2 -4m \\leq 0@, m > 0'},
      { sn: 2, presn: 2, checked: false, content: '解得：@0 < m \\leq 4@'},
      { sn: 3, presn: 3, checked: false, content: '当m = 0，f(x) = 1，符合题意。综上所述@0 \\leq m \\leq 4@'},
    ];

var problems = { title: title, answers: choice_answer, type: 1, breakdown: breakdown };

class ExerciseEditView extends React.Component {
	constructor(props) {
        super(props);
        const url_request = this.getRequest();
        this.state = { course_id: url_request['course_id'], exercise_id: url_request['exercise_id']};//title: title, choice_answer: choice_answer, blank_answer: blank_answer, type: 1, breakdown: breakdown };
    }
    componentDidMount(){
    	if(this.state.exercise_id){
    		//加载已有题目信息
    		var url = server_url + '/klmanager/getExercise';
    		NetUtil.get(url, {exercise_id: this.state.exercise_id}, (exercise) => {
    			if(exercise.type){
    				//选择题
    				this.setState({title: exercise.title, type: exercise.type, choice_answer: eval(exercise.answer), breakdown: exercise.breakdown});
    			}else{
    				//填空题
    				this.setState({title: exercise.title, type: exercise.type, blank_answer: eval(exercise.answer), breakdown: exercise.breakdown});
    			}
    		});
    	}
    }

    //获取url上的参数
    getRequest(){ 
		var url = window.location.search; //获取url中"?"符后的字串 
		var urlRequest = []; 
		if (url.indexOf("?") != -1) { 
			var str = url.substr(1); 
			var strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) { 
				urlRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
			} 
		} 
		return urlRequest; 
	}
	handleTitleChange(title){
		this.state.title = title;
	}
	handleBreakdownChange(breakdown){
		this.state.breakdown = breakdown;
		// this.setState({breakdown:currentData});
	}
	handleChoiceChange(choice){
		this.state.choice_answer = choice;
		// this.setState({choice_answer:currentInput});
	}
	onBlankChange(e){
    	this.setState({blank_answer: e.target.value});
    }
	onSelectChange(value){
		var type = 0;
		if(value == "1"){
			type = 1;
		}
		this.setState({type: type});
	}

	uploadExercise(e){
		var {exercise_id, title, type, blank_answer, choice_answer, breakdown} = this.state;
		var answer;
		if(type){
			//选择题
			var rt = false;
			if(choice_answer){
				for(var i = 0; i < choice_answer.length; i++){
					if(!choice_answer[i].value){
						alert("选项未正确填写");
						return;
					}
					if(choice_answer[i].correct)
						rt = true;
				}
				if(!rt)return;
				answer = choice_answer;
			}
		}else{
			//填空题
			if(blank_answer){
				answer = blank_answer;	
			}
		}
		//检查题目必要信息有效(暂时允许不填写主测点)
		if(title && answer && breakdown){
			for(var i = 0; i < breakdown.length; i++){
				if(!breakdown[i].kpid || !breakdown[i].content){
					alert("未正确填写知识点分解");
					return;
				}
			}
		}

		if(exercise_id){
			//修改题目
			var url = server_url + "/klmanager/updateExercise";
			var exercise = {exercise_id: exercise_id, title: title, answer: answer, type: type, breakdown};
			NetUtil.post(url, {exercise: exercise}, null, (results) => {
				alert(results);
			});
		}else{
			//新增题目
			var url = server_url + "/klmanager/addExercise";
			var exercise = {title: title, answer: answer, type: type, breakdown};
			NetUtil.post(url, {exercise: exercise}, null, (results) => {
				alert(results);
			});
		}
	}

	returnAnswer(){
    	const {choice_answer, blank_answer, type} = this.state;
    	// console.log(choice_answer);
    	if(type){
    		//选择题
			return <ExerciseChoice choiceArray = {choice_answer} onChange={e => this.handleChoiceChange(e)}/>;
    	}
    	else{
    		//填空题
    		return (
    			<Row type="flex" gutter={16} justify="space-between">
	    			<Col span={12}>
    					<p className="edit_fillblank_body">填空答案</p>
    					<Input type="textarea" onChange={(e)=>this.onBlankChange(e)} rows={2} />
					</Col>
					<Col span={12}>
						<p className="edit_fillblank_body">填空答案</p>
    					<Tex content={blank_answer} />
	    			</Col>
	    		</Row>
	    	);
    	}
    }
    render(){
    	//const {title} = this.state;
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
       					<div style={{paddingTop: '10px', paddingBottom: '10px'}}>
       						<Select defaultValue="1" style={{ width: 120 }} onChange={e => this.onSelectChange(e)}>
      							<Option value="1">选择题</Option>
      							<Option value="0">填空题</Option>
    						</Select>
							<span style={{paddingLeft: '10px'}}>
								<Button onClick={e => this.uploadExercise(e)}>保存提交</Button> 
							</span>
						</div>
						<div>
							<hr/>
							<ExerciseTitle titleProp={this.state.title} onChange={e => this.handleTitleChange(e)}/>
    						{this.returnAnswer()}

							
							<br/>
							<p>知识点分解</p>
							<hr/>
							<ExerciseEditBreakdown 
							breakdown={this.state.breakdown}
							onChange={(currentData)=>this.handleBreakdownChange(currentData)}
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
