import Immutable from 'immutable';

const breakdown = [{sn: 1, presn: 0, kpid: -1, kpname: '', sn_rating: 500, checked: false, content:''}];
//sample格式 [{sample:{a:xx,b:xx},sample_index:0},{sample:{a:xx,b:xx},sample_index:1}]

const defaultlState = Immutable.fromJS({
		title: '',
		blankAnswer: [{value: ''}],
		choiceAnswer: [
			{value: '', correct: false}, 
			{value: '', correct: false},
			{value: '', correct: false},
			{value: '', correct: false}
		],
        choiceImgAnswer: [
            {url: '', correct: false},
            {url: '', correct: false},
            {url: '', correct: false},
            {url: '', correct: false},
        ],
		exercise_rating: 500,
		exercise_type: 1,
		breakdown: breakdown, 
		isLoading: false,
        menu_state: '1',
        course: [],
        sample_list: {},
        sample_key: {},
	});

//手动获取数据
function checkparams(sample){
    let keys = [];

    for(var item in JSON.parse(sample)){
        keys.push(item);
    }
    return keys;
}


export const exerciseData = (state = defaultlState, action = {}) => {
    switch(action.type){
    	case 'GET_DATA_START':
    		return state.set('isLoading', true);
    	case 'GET_EXERCISE_SUCCESS': 
            if(action.json.title){
                var {exercise_type, answer, sample} = action.json;
                // var newState = Immutable.fromJS();
                if(sample[0]){
                    var sample_key = checkparams(sample[0].sample);
                    console.log("sample_key  :"+ sample_key);
                }
                const answerJson = eval(answer);
                const mergeState = state.mergeDeep(action.json);
                if(exercise_type == 0){
                    return mergeState.set('blankAnswer', Immutable.fromJS(answerJson))
                                    .set('sample_key',sample_key);
                }else if(exercise_type == 1){
                    return mergeState.set('choiceAnswer', Immutable.fromJS(answerJson))
                                    .set('sample_key',sample_key);
                }else if(exercise_type == 2){
                    return mergeState.set('choiceImgAnswer', Immutable.fromJS(answerJson))
                                    .set('sample_key',sample_key);
                }
            }else{
                console.log("没有该exercise_id！");
                return state.set("exercise_id", action.json.exercise_id);
            }
        case 'GET_COURSE_SUCCESS':
            return state.set('course', Immutable.fromJS(action.json));
        case 'COURSE_SELECT':
            return state.set('course_id', action.course_id);
    	case 'TITLE_CHANGE':
    		return state.setIn(['title'], action.title);
        case 'CHANGE_TITLE_IMG':
            return state.set('title_img_url', action.url);
        case 'REMOVE_TITLE_IMG':
            return state.set('title_img_url', '');
        case 'CHANGE_TITLE_AUDIO':
            return state.set('title_audio_url', action.url);
        case 'REMOVE_TITLE_AUDIO':
            return state.set('title_audio_url', '');
        case 'CHANGE_CHOICE_IMG':
            return state.setIn(['choiceImgAnswer', action.i, 'url'], action.url);
        case 'CHANGE_CHOICE_IMG_SELECT':
            return state.updateIn(['choiceImgAnswer', action.i, 'correct'], correct => !correct);
        case 'REMOVE_CHOICE_IMG':
            return state.setIn(['choiceImgAnswer', action.i, 'url'], '');
    	case 'CHANGE_EXERCISE_TYPE':
    		return state.setIn(['exercise_type'], action.exercise_type);
    	case 'CHANGE_CHOICE_INPUT':
    		return state.setIn(['choiceAnswer', action.i, 'value'], action.value);
    	case 'CHANGE_CHOICE_SELECT':
    		return state.updateIn(['choiceAnswer', action.i, 'correct'], correct => !correct);
    	case 'CHANGE_BLANK_INPUT':
    	 	return state.setIn(['blankAnswer', action.i, 'value'], action.value);
    	case 'ADD_ANSWER':
    		//选择题
    		if(action.exercise_type == 1){
    			return state.updateIn(['choiceAnswer'], list =>	list.push({value: '', correct: false}));
    		}else if(action.exercise_type == 0){
    			//填空题
    			return state.updateIn(['blankAnswer'], list => list.push({value: ''}));
    		}
    	case 'DEL_ANSWER':
    		if(action.exercise_type){
    			return state.updateIn(['choiceAnswer'], list => list.pop());
    		}else{
    			//填空题
    			return state.updateIn(['blankAnswer'], list => list.pop());	
    		}
    		
    	case 'CHANGE_INPUT_BREAKDOWN':
    		return state.setIn(['breakdown', action.i, 'content'], action.content);
    	case 'CHANGE_CHECK_BREAKDOWN':
    		return state.setIn(['breakdown', action.i, 'checked'], action.checked);
    	case 'CHANGE_PRESN_BREAKDOWN':
    		return state.setIn(['breakdown', action.i, 'presn'], action.presn);
    	case 'SELECT_KP_BREAKDOWN':
    		return state.setIn(['breakdown', action.i, 'kpid'], action.kpid)
            .setIn(['breakdown', action.i, 'kpname'], action.kpname);
    	case 'ADD_BREAKDOWN':
    		return state.updateIn(['breakdown'], list => list.push(Immutable.fromJS(action.newData)));
    	case 'DEL_BREAKDOWN':
    		return state.updateIn(['breakdown'], list => list.pop());
    	case 'CHANGE_RATING_BREAKDOWN':
    		return state.setIn(['breakdown', action.i, 'sn_rating'], action.rating);
    	case 'CHANGE_RATING_EXERCISE':
    		return state.setIn(['exercise_rating'], action.rating);
    	case 'UPLOAD_EXERCISE_START':
    		return state.setIn(['isLoading'], true);
    	case 'UPLOAD_EXERCISE_SUCCESS':
    		return state.set('exercise_id', action.exercise_id);
        case 'UPDATE_MENU':
            return state.setIn(['menu_state'], action.menu_state);
        default:
            return state;
    }
}
