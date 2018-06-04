import Immutable from 'immutable';

const breakdown = [{sn: 1, presn: 0, kpid: -1, kpname: '', sn_rating: 500, checked: false, content:''}];
//sample格式 [{sample:{a:xx,b:xx},sample_index:0},{sample:{a:xx,b:xx},sample_index:1}]
const sample_list = [{sample : {a:1,b:2}, 
                     sample_index : 1, 
                     answer : [{value:1,correct:true}], 
                     title_img_url : '', 
                     title_audio_url : ''}];
var blankAnswer = [{value: ''}];
var choiceAnswer = [
            {value: '', correct: false}, 
            {value: '', correct: false},
            {value: '', correct: false},
            {value: '', correct: false}
        ];
var choiceImgAnswer = [
            {url: '', correct: false},
            {url: '', correct: false},
            {url: '', correct: false},
            {url: '', correct: false},
        ];
const defaultlState = Immutable.fromJS({
        exercise : {
            exercise_id : 0,
            exercise_type : 1,
            title : '',
            title_img_url : '',
            title_audio_url : '',
            answer : [],
            exercise_rating: 500,
            breakdown: [], 
        },
		isLoading: false,
        menu_state: '1',
        course: [],
        sample_list: [],
        sample_key: {},
        sample_select: 0,
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
                var {answer} = action.json;
                const answerJson = eval(answer);
                return state.set('exercise',Immutable.fromJS(action.json))
                            .setIn(['exercise','answer'],Immutable.fromJS(answerJson));
            }else{
                console.log("没有该exercise_id！");
                return state.set("exercise_id", action.json.exercise_id);
            }
        case 'GET_SAMPLE_LIST_SUCCESS':
            return state.set('sample_list', Immutable.fromJS(action.json));
        case 'GET_SAMPLE_KEY':
            return state.set('sample_key', Immutable.fromJS(action.totalkey_json));
        case 'SAMPLE_SELECT':
            return state.set('sample_select', action.sample_select);
        case 'GET_COURSE_SUCCESS':
            return state.set('course', Immutable.fromJS(action.json));
        case 'COURSE_SELECT':
            return state.set('course_id', action.course_id);
    	case 'TITLE_CHANGE':
    		return state.setIn(['exercise','title'], action.title);
        case 'CHANGE_TITLE_IMG':
            return state.setIn(['exercise','title_img_url'], action.url);
        case 'REMOVE_TITLE_IMG':
            return state.setIn(['exercise','title_img_url'], '');
        case 'CHANGE_TITLE_AUDIO':
            return state.setIn(['exercise','title_audio_url'], action.url);
        case 'REMOVE_TITLE_AUDIO':
            return state.setIn(['exercise','title_audio_url'], '');
        case 'CHANGE_CHOICE_IMG':
            return state.setIn(['exercise','answer', action.i, 'url'], action.url);
        case 'CHANGE_CHOICE_IMG_SELECT':
            return state.updateIn(['exercise','answer', action.i, 'correct'], correct => !correct);
        case 'REMOVE_CHOICE_IMG':
            return state.setIn(['exercise','answer', action.i, 'url'], '');
    	case 'CHANGE_EXERCISE_TYPE':
            if(action.exercise_type == 0){
                return state.setIn(['exercise','exercise_type'], action.exercise_type)
                            .setIn(['exercise','answer'],Immutable.fromJS(blankAnswer));
            }else if(action.exercise_type == 1){
                return state.setIn(['exercise','exercise_type'], action.exercise_type)
                            .setIn(['exercise','answer'],Immutable.fromJS(choiceAnswer));
            }else if(action.exercise_type == 2){
                return state.setIn(['exercise','exercise_type'], action.exercise_type)
                            .setIn(['exercise','answer'],Immutable.fromJS(choiceImgAnswer));
            }
    	case 'CHANGE_CHOICE_INPUT':
    		return state.setIn(['exercise','answer', action.i, 'value'], action.value);
    	case 'CHANGE_CHOICE_SELECT':
    		return state.updateIn(['exercise','answer', action.i, 'correct'], correct => !correct);
    	case 'CHANGE_BLANK_INPUT':
    	 	return state.setIn(['exercise','answer', action.i, 'value'], action.value);
    	case 'ADD_ANSWER':
    		//选择题
    		if(action.exercise_type == 1){
    			return state.updateIn(['exercise','answer'], list =>list.push({value: '', correct: false}));
    		}else if(action.exercise_type == 0){
    			//填空题
    			return state.updateIn(['exercise','answer'], list => list.push({value: ''}));
    		}
    	case 'DEL_ANSWER':
    			return state.updateIn(['exercise','answer'], list => list.pop());	
    	case 'CHANGE_INPUT_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'content'], action.content);
    	case 'CHANGE_CHECK_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'checked'], action.checked);
    	case 'CHANGE_PRESN_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'presn'], action.presn);
    	case 'SELECT_KP_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'kpid'], action.kpid)
            .setIn(['exercise','breakdown', action.i, 'kpname'], action.kpname);
    	case 'ADD_BREAKDOWN':
    		return state.updateIn(['exercise','breakdown'], list => list.push(Immutable.fromJS(action.newData)));
    	case 'DEL_BREAKDOWN':
    		return state.updateIn(['exercise','breakdown'], list => list.pop());
    	case 'CHANGE_RATING_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'sn_rating'], action.rating);
    	case 'CHANGE_RATING_EXERCISE':
    		return state.setIn(['exercise','exercise_rating'], action.rating);
    	case 'UPLOAD_EXERCISE_START':
    		return state.setIn(['isLoading'], true);
    	case 'UPLOAD_EXERCISE_SUCCESS':
    		return state.setIn(['exercise','exercise_id'], action.exercise_id);
        case 'UPDATE_MENU':
            return state.setIn(['menu_state'], action.menu_state);
        default:
            return state;
    }
}
