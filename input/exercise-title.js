import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';

class ExerciseTitle extends React.Component {
	constructor(props) {
        super(props);
        this.state={ title_body: this.props.titleProp }
    }
    handleBodyChange(e){
    	this.setState({title_body: e.target.value});
    	//this.props.onChoiceInputBack(this.state.choice_body);
    }
    render(){
    	const { title_body } = this.state;
		const body = title_body?title_body:'';

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
    					<Tex content={body} />
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
export default ExerciseTitle;
ReactDOM.render( <ExerciseTitle />, document.getElementById('content'));
