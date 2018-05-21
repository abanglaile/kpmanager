import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Checkbox, Row, Col, Input } from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';

var choices = [
      { correct: 0, value: '@0 < m < 4@' },
      { correct: 1, value: '@0 \\leq m \\leq 4@' },
      { correct: 0, value: '@m \\geq 4@' },
      { correct: 0, value: '@0 < m \\leq 4@'}
    ];

class ExerciseChoice extends React.Component {
	constructor(props) {
        super(props);
        this.state={ choiceArray: choices };
    }
    onSelect(e, i){
        var { choiceArray } = this.state;
        choiceArray[i].correct = !choiceArray[i].correct;
    	this.setState({title_body: e.target.value});
    	//this.props.onChoiceInputBack(this.state.choice_body);
    }
    handleChange(e, i){
        var { choiceArray } = this.state;
        choiceArray[i].value = e.target.value;
        this.setState({choiceArray});
        //this.props.onChoiceInputBack(this.state.choice_body);
    }
    render(){
    	const { choiceArray } = this.state;
		const choice = choiceArray?choiceArray:[];

        const choiceRow = choice.map((item, i) => {
            return(
                <Row className="choice_row" type="flex" justify="space-between">
                    <Col span={10}>
                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.onSelect(e, i)} />
                        <Input className="edit_choice_input" defaultValue={item.value} onChange={(e)=>this.handleChange(e, i)} rows={1} />
                    </Col>
                    <Col span={12}>
                        <Checkbox className="edit_choice_select" checked={item.correct} /><Tex content={item.value} />
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
export default ExerciseChoice;
//ReactDOM.render( <ExerciseTitle />, document.getElementById('content'));
