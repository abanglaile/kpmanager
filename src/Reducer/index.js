import Immutable from 'immutable';

const breakdown = [{sn: 1, presn: 0, kpid: -1, kpname: '', kp_tag_id: null,kp_tag_name: '', sn_rating: 500, checked: false, content:''}];

var blankAnswer = [{value: ''}];
var choiceAnswer = [
            {value: '', correct: false}, 
            {value: '', correct: false},
            {value: '', correct: false},
            {value: '', correct: false}
        ];
// var choiceImgAnswer = [
//             {url: '', correct: false},
//             {url: '', correct: false},
//             {url: '', correct: false},
//             {url: '', correct: false},
//         ];
var sample_list = [{sample : {}, 
                     exercise_id : 0,
                     exercise_type : 1,
                     sample_index : 0, 
                     answer : choiceAnswer, 
                     title_img_url : '', 
                     title_audio_url : ''}];

const defaultlState = Immutable.fromJS({
        exercise : {
            exercise_id : 0,
            exercise_type : 1,
            title : '',
            title_img_url : '',
            title_audio_url : '',
            answer : choiceAnswer,
            answer_assist_url : '',
            exercise_rating: 500,
            breakdown: breakdown, 
        },

		isLoading: false,
        menu_state: '1',
        course: [],
        course_id : null,
        sample_list: [],
        sample_key: {},
        sample_select: 0,
        kp_tag : [],
	});

const defaultlImageState = Immutable.fromJS({
        test_url: "http://localhost/kpmanager/img/test.png",
        wavUrl: '',
        save_url: '',
        save_wav_url: '',
        media_list: [],
        tab_state: '1',
        radio_state: null,
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
                var {answer,course_id} = action.json;
                const answerJson = eval(answer);
                console.log('answerJson',  answerJson);
                
                return state.set('exercise',Immutable.fromJS(action.json))
                            .set('course_id', course_id)
                            .setIn(['exercise','answer'],Immutable.fromJS(answerJson));
            }else{
                console.log("没有该exercise_id！");
                return state.set("exercise_id", action.json.exercise_id);
            }
        case 'GET_KP_TAG_SUCESS':
            return state.set('kp_tag', Immutable.fromJS(action.json));
        case 'GET_SAMPLE_LIST_SUCCESS':
            return state.set('sample_list', Immutable.fromJS(action.json));
        case 'GET_SAMPLE_KEY':
            return state.set('sample_key', Immutable.fromJS(action.totalkey_json));
        case 'SAMPLE_SELECT':
            return state.set('sample_select', action.sample_select);
        case 'ADD_IN_SAMPLE_LIST':
            return state.update('sample_list', list =>list.push(Immutable.fromJS(action.exercise_sample)));
        case 'GET_COURSE_SUCCESS':
            return state.set('course', Immutable.fromJS(action.json));
        case 'COURSE_SELECT':
            return state.set('course_id', action.course_id);
    	case 'TITLE_CHANGE':
    		return state.setIn(['exercise','title'], action.title);
        case 'CHANGE_TITLE_IMG':
            return state.setIn(['exercise','title_img_url'], action.url);
        case 'CHANGE_TITLE_AUDIO':
            return state.setIn(['exercise','title_audio_url'], action.url);
        case 'CHANGE_CHOICE_IMG':
            return state.setIn(['exercise','answer', action.i, 'value'], action.value);
    	case 'CHANGE_EXERCISE_TYPE':
            if(action.exercise_type == 0 || action.exercise_type == 3 || action.exercise_type == 4){
                return state.setIn(['exercise','exercise_type'], action.exercise_type)
                            .setIn(['exercise','answer'],Immutable.fromJS(blankAnswer));
            }else{
                return state.setIn(['exercise','exercise_type'], action.exercise_type)
                            .setIn(['exercise','answer'],Immutable.fromJS(choiceAnswer));
            }
    	case 'CHANGE_ANSWER_INPUT':
    		return state.setIn(['exercise','answer', action.i, 'value'], action.value);
        case 'CHANGE_SAMPLE_IMG':
            return state.setIn(['sample_list', action.sample_select, 'title_img_url'], action.value);
        case 'CHANGE_SAMPLE_AUDIO':
            return state.setIn(['sample_list', action.sample_select, 'title_audio_url'], action.value); 
        case 'CHANGE_SAMPLE_ANSWER':
            return state.setIn(['sample_list', action.sample_select, 'answer', action.i, 'value'], action.value);
    	case 'CHANGE_CHOICE_SELECT':
    		return state.updateIn(['exercise','answer', action.i, 'correct'], correct => !correct);
    	case 'CHANGE_CHOICE_SAMPLE_SELECT':
            return state.updateIn(['sample_list',action.sample_select, 'answer', action.i, 'correct'], correct => !correct);
    	case 'CHANGE_SAMPLE_INPUT':
            // console.log("sample_list.sample :",state.getIn(['sample_list',action.sample_select,'sample',action.key]));
            return state.setIn(['sample_list',action.sample_select, 'sample', action.key], action.value);
        case 'ADD_ANSWER':
    		//选择题(文字、图片)
    		if(action.exercise_type == 1 || action.exercise_type == 2){
    			return state.updateIn(['exercise','answer'], list =>list.push(Immutable.fromJS({value: '', correct: false})));
    		}else{
    			//填空题、解答题、音频题
    			return state.updateIn(['exercise','answer'], list => list.push(Immutable.fromJS({value: ''})));
    		}
        case 'ADD_SAMPLE_ANSWER':
            //选择题
            if(action.exercise_type == 1 || action.exercise_type == 2){
                return state.updateIn(['sample_list',action.sample_select, 'answer'], list =>list.push(Immutable.fromJS({value: '', correct: false})));
            }else if(action.exercise_type == 0){
                //填空题
                return state.updateIn(['sample_list',action.sample_select, 'answer'], list => list.push(Immutable.fromJS({value: ''})));
            }
    	case 'DEL_ANSWER':
    		return state.updateIn(['exercise','answer'], list => list.pop());
        case 'DEL_SAMPLE_ANSWER':
            return state.updateIn(['sample_list',action.sample_select, 'answer'], list => list.pop());
        case 'CHANGE_ASSIST_IMG':
            return state.setIn(['exercise','answer_assist_url'], action.content);
    	case 'CHANGE_INPUT_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'content'], action.content);
    	case 'CHANGE_CHECK_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'checked'], action.checked);
    	case 'CHANGE_PRESN_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'presn'], action.presn);
    	case 'SELECT_KP_BREAKDOWN':
    		return state.setIn(['exercise','breakdown', action.i, 'kpid'], action.kpid)
            .setIn(['exercise','breakdown', action.i, 'kpname'], action.kpname);
        case 'SELECT_BREAKDOWN_KP_TAG':
            return state.setIn(['exercise','breakdown', action.i, 'kp_tag_id'], action.kp_tag_id)
            .setIn(['exercise','breakdown', action.i, 'kp_tag_name'], action.kp_tag_name);
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
        case 'MODAL_CANCEL':
            return state.set('modalVisible', false);
        case 'MODAL_OPEN':
            return state.set('modalVisible', true); 
        default:
            return state;
    }
}

export const imageData = (state = defaultlImageState, action = {}) => {
    switch(action.type){
        case 'CODE_CHANGE':
            return state.set('test_code', action.code);
        case 'CODE_RENDER':
            return state.set('test_url', action.url)
                .set('wav_url', action.wavUrl)
                .set('render_log', action.log);
        case 'SAVE_URL_CHANGE':
            return state.set('save_url', action.save_url);
        case 'SAVE_WAV_URL_CHANGE':
            return state.set('save_wav_url', action.save_wav_url);
        case 'SAVE_TEST_MEDIA':
            return state.set('save_url', action.media_res.url)
                .set('test_code', action.media_res.code)
                .set('save_wav_url', action.media_res.wav_url);
        case 'GET_MEDIA_LIST_SUCCESS':
            return state.set('media_list', Immutable.fromJS(action.json));
        case 'SEARCH_MEDIA_SUCCESS':
            console.log(action.media_res);
            if(action.media_res.wav_url){
                return state.set('test_url', action.media_res.url + "?t=" + new Date().getTime())
                        .set('wav_url', action.media_res.wav_url + "?t=" + new Date().getTime())
                        .set('save_wav_url',action.media_res.wav_url)
                        .set('test_code', action.media_res.code);
            }else{
                return state.set('test_url', action.media_res.url + "?t=" + new Date().getTime()).set('test_code', action.media_res.code);
            }
        case 'SAVE_MODAL_OPEN':
            return state.set('modal_open', true).set('save_url', action.save_url)
                    .set('save_wav_url', action.save_wav_url);
        case 'SAVE_MODAL_CANCEL':
            return state.set('modal_open', false);
        case 'GET_QINIU_TOKEN':
            return state.set('uptoken', action.uptoken);
        case 'SAVE_UPLOAD_URL':
            console.log("action.json:",JSON.stringify(action.json));
            return state.set('upload_url', action.upload_url)
                .update('media_list',list => Immutable.fromJS([Immutable.fromJS(action.json),...list]));
        case 'UPDATE_TAB':
            return state.set('tab_state', action.tab_state);
        case 'UPDATE_RADIO':
            return state.set('radio_state', action.radio_state);
        default:
            return state;
    }

}
