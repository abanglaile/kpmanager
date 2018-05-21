import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select,Table,Button,Input,Dropdown,Popconfirm,Checkbox,Tabs,Progress,Popover,Tooltip} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './TestResult.css';
import Tex from './renderer.js';
const { Header, Footer, Sider, Content } = Layout;

var urlip = 'http://127.0.0.1/klmanager/';

const TabPane = Tabs.TabPane;
// var data = [{
//   key: '1',
//   studentname: '张三',
//   completion: '已完成',
//   score: 80,
//   time:10,
// }, {
//   key: '2',
//   studentname: '李四',
//   completion: '已完成',
//   score: 66,
//   time:11,
// }, {
//   key: '3',
//   studentname: '王二',
//   completion: '已完成',
//   score: 70,
//   time:9,
// }, {
//   key: '4',
//   studentname: '奇哥',
//   completion: '未完成',
//   score:null,
//   time:null,
// }];

// var kpmistake = [{
//   key: '1',
//   kpname: 'kp1',
//   count: 20,
// }, {
//   key: '2',
//   kpname: 'kp2',
//   count: 16,
// }, {
//   key: '3',
//   kpname: 'kp3',
//   count: 6,
// }, {
//   key: '4',
//   kpname: 'kp4',
//   count: 12,
// }, {
//   key: '5',
//   kpname: 'kp5',
//   count: 0,
// }];

// var studentmis = [{
//   student_id: '111',
//   student_name:'张三',
//   stu_mistake: [{kpname:"kp1",count:5},{kpname:"kp2",count:5},{kpname:"kp3",count:2},{kpname:"kp4",count:4},{kpname:"kp5",count:0}],
// }, {
//   student_id: '112',
//   student_name:'李四',
//   stu_mistake: [{kpname:"kp1",count:5},{kpname:"kp2",count:3},{kpname:"kp3",count:2},{kpname:"kp4",count:4},{kpname:"kp5",count:0}],
// }, {
//   student_id: '113',
//   student_name:'王二',
//   stu_mistake: [{kpname:"kp1",count:10},{kpname:"kp2",count:8},{kpname:"kp3",count:2},{kpname:"kp4",count:4},{kpname:"kp5",count:0}],
// }];

var title = "题目：@c = \\pm\\sqrt{a^2 + b^2}@，请问答案是多少？";
var answer = [
      { correct: 0, value: '@0 < m < 4@' },
      { correct: 1, value: '@0 \\leq m \\leq 4@' },
      { correct: 0, value: '@m \\geq 4@' },
      { correct: 0, value: '@0 < m \\leq 4@'}
    ];
var correct_rate = 85;
var kp_rate = [
		{kpid: '' ,kpname:'代数式',rate:100},{kpid: '' ,kpname:'整式',rate:60},{kpid: '' ,kpname:'分式',rate:40},{kpid: '' ,kpname:'二次根式',rate:18},
	];
var breakdown = [
      { sn: 0, content: 'f(x)定义域为R,则@mx^2 + mx + 1 \\geq 0@恒成立', kpid: '' ,kpname:'代数式'},
      { sn: 1, content: '当@m \\neq 0@, @y = mx^2 + mx + 1@为二次函数，函数图像开口向上，与x轴最多只有一个交点。即@\\Delta = m^2 -4m \\leq 0@, m > 0', kpid: '',kpname:'整式' },
      { sn: 2, content: '解得：@0 < m \\leq 4@', kpid: '',kpname:'分式' },
      { sn: 3, content: '当m = 0，f(x) = 1，符合题意。综上所述@0 \\leq m \\leq 4@', kpid: '',kpname:'二次根式'},
    ];

var problems = { title: title, answer: answer, type: true, breakdown: breakdown ,correct_rate:correct_rate, kp_rate:kp_rate};

class ExerciseDetail extends React.Component{
	constructor(props) {
		super(props);
		this.state={ test_data : [] };
	}
	componentDidMount(){
		var data = []; 
        var url = urlip+'getTestDetail';
        NetUtil.get(url, {test_id : 1}, (results) => {
            data = results;
            this.setState({test_data : data});
        })
	}
	render(){
		const {test_data} = this.state;
		var tests = [];
		for(var j = 0; j < test_data.length; j++) {
        	tests.push(
        		<div key={j}>
        			<OneExerciseView exercise={test_data[j]} />
        		</div>
        	);
    	}
    	return(
    		<div>
			    {tests}
		  	</div>
    	);
	}
}

class OneExerciseView extends React.Component {
	constructor(props) {
		super(props);
		this.state={};
	}
	render(){
		if(this.props.exercise){
			const {title ,type, answer, breakdown,correct_rate,kp_rate,stu_false} = this.props.exercise;
			// console.log(JSON.stringify(this.props.exercise));
			var steps = [];
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            		<div key={j} className="step_frame">
            			<p className="step_index">（{(j+1).toString()}）&nbsp;</p><Tex className="step_content" content={breakdown[j].content}/>
            			<div className="step_kpname"><a>{breakdown[j].kpname}</a></div>
            		</div>
            	);
        	}
        	var choice = eval(answer);
        	var answerDom = (
				type ?
				choice.map((item, i) => {
    				return(
        				<Row className="row_loc" type="flex" justify="start">
        					<Col span={5}>
								<p><Checkbox checked={item.correct} disabled className="choice_loc"></Checkbox></p><Tex className="choice_content_loc" content={item.value} />
							</Col>
        				</Row>
        			);
				})
				: 
				<div className="step_answer">
					<p className="step_index">答案：&nbsp;</p><Tex className="step_content" content={eval(answer)} />
				</div>
			);
			var kprateDom = (
				kp_rate.map((item, i) => {
					return(
						<div key={i}>
						    <Row type="flex" justify="start">
		    					<Col span={1}>
		    						<p>（{(i+1).toString()}）</p>
								</Col>
								<Col span={12}>
									<Progress 
									    percent={item.rate} 
									    format={(percent) => `${percent}%`} 
								    />
								</Col>
		    				</Row>
						</div>
        			);
				})
			);
			console.log("stu_false:"+ JSON.stringify(stu_false));
			var false_content = (
				stu_false.map((item,i) => {
					return(
						<p>{item.student_name}</p>
					);
				})
			);
			var stufalseDom = (
				stu_false.length > 0 ? 
				<Popover placement="rightTop" content={false_content} trigger="click">
			      <Progress type="circle" percent={correct_rate} format={(percent) => `${percent}%`}  width={85} />
			    </Popover>
				:
				<Progress type="circle" percent={correct_rate} format={(percent) => `${percent}%`}  width={85} />
			);
        	return(
				<div className="exercise_frame">
					<div className="exercise_body_frame">
						<Tex content={title} />
						{answerDom}
					</div>
					<div className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="pro_result">
						<div className="result_cir">
							{stufalseDom}
						</div>
						<Tooltip placement="topLeft" title="知识点完成率" arrowPointAtCenter>
							<div className="result_progress">
								{kprateDom}
							</div>
						</Tooltip>
					</div>
				</div>
			);
		}
	}
}

class KpResult extends React.Component {
	constructor(props) {
		super(props);
		this.state={kp_data : []};
        this.columns = [{
            title: '学生',
            dataIndex: 'student_name',
            width: '50%',
        }, {
            title: '错误次数',
            dataIndex: 'stu_count',
            width: '50%',
        }];
		 
    }
    componentDidMount(){
    	var data = []; 
        var url = urlip+'getTestKpResult';
        NetUtil.get(url, {test_id : 1}, (results) => {
            data = results;
            this.setState({kp_data : data});
        })
    }
    render(){
    	const {kp_data} = this.state;
    	var maxCount = kp_data[0] ? kp_data[0].kp_count : 0;
    	var progressDom = (
			kp_data.map((item, i) => {
				var content = [];
				var data = [];
		    	data = item.stu_mistake;
		    	content.push(
	    			<div>
					    < Table columns = {this.columns} dataSource = {data} bordered size='small' /> 
					</div>
	    		)
				return(
    				<Row className="kp_progress" key={item.kpid} type="flex" justify="start">
    					<Col span={4}>
    						<span>{item.kpname}</span>
						</Col>
						<Col span={18}>
							<Popover placement="right" content={item.kp_count==0? null : content} trigger="hover">
	    						<Progress 
	    							status={item.kp_count===maxCount? "exception":null} 
	    							percent={(item.kp_count/maxCount)*100} 
	    							format={() => item.kp_count} 
	    						/>
    						</Popover>
						</Col>
    				</Row>
    			);
			})
		)
    	return(
    		<div>
			    {progressDom}
		  	</div>
    	);
    }
}

class StudentRes extends React.Component {
	constructor(props) {
        super(props);
        this.state={filterDropdownVisible: false, test_data:[], searchText: '', filtered: false};
    }

	componentDidMount(){
		var data = []; 
        var url = urlip+'getTestResult';
        NetUtil.get(url, {test_id : 1}, (results) => {
            data = results;
            this.setState({test_data:data});
        }) 
	}

    onInputChange(e){
    	this.setState({ searchText: e.target.value });
  	}

    onSearch(){
	    const { searchText } = this.state;
	    const reg = new RegExp(searchText, 'gi');
	    this.setState({
	      filterDropdownVisible: false,
	      filtered: !!searchText,
	      test_data: test_data.map((record) => {
	        const match = record.studentname.match(reg);
	        if (!match) {
	          return null;
	        }
	        return {
	          ...record,
	          studentname: (
	            <span>
	              {record.studentname.split(reg).map((text, i) => (
	                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
	              ))}
	            </span>
	          ),
	        };
	      }).filter(record => !!record),
	    });
	}

	render(){
		this.columns = [{
            title: '学生姓名',
            dataIndex: 'studentname',
            width: '20%',
            key:'student_id',
            filterDropdown: (
		        <div className="custom-filter-dropdown">
			          <Input
			            ref={ele => this.searchInput = ele}
			            placeholder="输入学生姓名"
			            value={this.state.searchText}
			            onChange={(e)=>this.onInputChange(e)}
			            onPressEnter={()=>this.onSearch()}
			          />
		          <Button type="primary" onClick={()=>this.onSearch()}>查找</Button>
		        </div>
	      	),
	      	filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
	      	filterDropdownVisible: this.state.filterDropdownVisible,
	      	onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }, () => this.searchInput.focus()),
	    }, {
            title: '完成情况',
            dataIndex: 'completion',
            width: '25%',
            key:'completion',
            render: (text, record) => {
              return(
                <span >
                  <font color={record.completion? "#00a854" : "red"}>{record.completion? "已完成" : "未完成"}</font>
                </span>
              );
            },
            filters: [{
	        	text: '已完成',
	       	 	value: '已完成',
	      	}, {
		        text: '未完成',
		        value: '未完成',
	      	}],
            onFilter: (value, record) => record.completion.indexOf(value) === 0,
        }, {
            title: '分数',
            dataIndex: 'score',
            width: '15%',
            key:'score',
            sorter: (a, b) => a.score - b.score,
        }, {
            title: '完成时间',
            dataIndex: 'end_time',
            width: '20%',
            key:'end_time',
            sorter: (a, b) => a.end_time - b.end_time,
        },];
		const {test_data} = this.state;
		return(
			<Table columns={this.columns} dataSource={test_data} />
		);
	}
}

class TestResult extends React.Component {
	constructor(props){
		super(props);
		this.state = { activeKey : '1'};
	}
	
	onTabChange(key){
		this.setState({activeKey : key});
	}

	render(){
		const{activeKey} = this.state;
		return(
			<Layout className="layout">
			    <Header>
			      <div className="logo" />
			      <Menu
			        theme="dark"
			        mode="horizontal"
			        defaultSelectedKeys={['2']}
			        style={{ lineHeight: '64px' }}
			      >
			        <Menu.Item key="1">nav 1</Menu.Item>
			        <Menu.Item key="2">nav 2</Menu.Item>
			        <Menu.Item key="3">nav 3</Menu.Item>
			      </Menu>
			    </Header>
			    <Content style={{ padding: '0 150px' }}>
			      <p style={{ margin: '12px 0' }}>2017年4月28日数学试卷</p>
			      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
					<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
					    <TabPane tab="测试结果" key="1"><StudentRes/></TabPane>
					    <TabPane tab="知识点" key="2">
					    	<div>
					    		<h2 className="tab2_title">知识点错误次数</h2>
					    		<KpResult/>
					    	</div>
					    </TabPane>
					    <TabPane tab="试题详情" key="3"><ExerciseDetail/></TabPane>
				    </Tabs>
			      </div>
			    </Content>
			    <Footer style={{ textAlign: 'center' }}>
			      Ant Design ©2017 Created by Bourne
			    </Footer>
			 </Layout>
		);
	}
}

ReactDOM.render( < TestResult/>, document.getElementById('content'));



