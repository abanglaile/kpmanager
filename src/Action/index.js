import NetUtil from '../utils/NetUtil'
import Config from '../utils/Config'
import {push} from 'react-router-redux'

let target = Config.server_url;

//获取Course成功
const getCourseSuccess = (json) => {
  return {
    type: 'GET_COURSE_SUCCESS',
    json,
  }
}

//获取course
export const getCourse = () => {
    let url = target + '/klmanager/getCourse';
    return dispatch => {
        dispatch(getDataStart());
        //加载course信息
        return NetUtil.get(url, {}, json => {
            console.log('course');
            console.log(json);
            dispatch(getCourseSuccess(json));
        }, errors => {
            console.log('course error');
            console.log(errors);
        });
    }
}

//开始题目数据
const getDataStart = () => {
  return {
    type: 'GET_DATA_START',
  }
}

//获取题目成功
const getExerciseSuccess = (json) => {
  return {
        type: 'GET_EXERCISE_SUCCESS',
        json
    }
}

//选取course
export const courseSelect = (course_id) => {
    return {
        type: "COURSE_SELECT",
        course_id: parseInt(course_id),
    }
}

//获取exercise
export const getExercise = (exercise_id) => {
    let url = target + '/klmanager/getExercise';
    return dispatch => {
        dispatch(getDataStart());
        //加载已有题目信息
        return NetUtil.get(url, {exercise_id}, json => {
            dispatch(getExerciseSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

//改变题目类型
export const exerciseTypeChange = (exercise_type) => {
    return {
        type: 'CHANGE_EXERCISE_TYPE',
        exercise_type: parseInt(exercise_type),
    }
}

//更新题目选择输入
export const choiceInputChange = (value, i) => {
    return {
        type: 'CHANGE_CHOICE_INPUT',
        value,
        i,
    }
}

//更新题目选项答案
export const choiceSelectChange = (i) => {
    return {
        type: 'CHANGE_CHOICE_SELECT',
        i,
    }
}

//更新填空答案
export const blankInputChange = (value, i) => {
    return {
        type: 'CHANGE_BLANK_INPUT',
        value,
        i,
    }
}

//增加答案
export const addAnswer = (exercise_type) => {
    return {
        type: 'ADD_ANSWER',
        exercise_type: exercise_type,
    }
}

//删除答案
export const delAnswer = (exercise_type) => {
    return {
        type: 'DEL_ANSWER',
        exercise_type: exercise_type,
    }
}

//更新答案图片url
export const answerImgChange = (i, url) => {
    console.log(url);
    return {
        type: 'CHANGE_CHOICE_IMG',
        i,
        url,
    }
}

export const choiceImgSelectChange = (i) => {
    return {
        type: 'CHANGE_CHOICE_IMG_SELECT',
        i,
    }
}

export const choiceImgRemove = (i) => {
    return {
        type: 'REMOVE_CHOICE_IMG',
        i,
    }
}

//更新题目标题
export const titleChange = (title) => {
    return {
        type: 'TITLE_CHANGE',
        title,
    }
}

//更新题目图片url
export const titleImgChange = (url) => {
    return {
        type: 'CHANGE_TITLE_IMG',
        url,
    }
}

//删除题目图片url
export const titleImgRemove = () => {
    return {
        type: 'REMOVE_TITLE_IMG',
    }
}

//更新题目audio url
export const titleAudioChange = (url) => {
    return {
        type: 'CHANGE_TITLE_AUDIO',
        url,
    }
}

//删除题目音频url
export const titleAudioRemove = () => {
    return {
        type: 'REMOVE_TITLE_AUDIO',
    }
}

//更新breakdown_input
export const inputChangeBreakdown = (content, i) => {
    return {
        type: 'CHANGE_INPUT_BREAKDOWN',
        i,
        content,
    }
}

//更新breakdown_presn
export const presnChangeBreakdown = (presn, i) => {
    return {
        type: 'CHANGE_PRESN_BREAKDOWN',
        i,
        content,
    }
}

//更新breakdown_check
export const checkChangeBreakdown = (checked, i) => {
    return {
        type: 'CHANGE_CHECK_BREAKDOWN',
        i,
        checked,
    }
}

export const addBreakdown = (newData) => {
    return {
        type: 'ADD_BREAKDOWN',
        newData,
    }
}

export const delBreakdown = () => {
    return {
        type: 'DEL_BREAKDOWN',
    }
}

//更新breakdown_kp
export const selectKpBreakdown = (selectOption, i) => {
    return {
        type: 'SELECT_KP_BREAKDOWN',
        kpid: selectOption[2].kpid,
        kpname: selectOption[2].kpname,
        i,
    }
}

//更新breakdown难度
export const changeRatingBreakdown = (rating, i) => {
    return {
        type: 'CHANGE_RATING_BREAKDOWN',
        rating,
        i,
    }
}

//更新题目breakdown
export const updateBreakdown = (breakdown) => {
    return {
    	type: 'UPDATE_BREAKDOWN',
    	breakdown,
    }
}

export const changeRatingExercise = (rating) => {
    return {
        type: 'CHANGE_RATING_EXERCISE',
        rating,
    }
}

//开始题目数据
const uploadExerciseStart = () => {
  return {
    type: 'UPLOAD_EXERCISE_START',
  }
}

//获取题目成功
const uploadExerciseSuccess = (exercise_id) => {
  return {
        type: 'UPLOAD_EXERCISE_SUCCESS',
        exercise_id,
    }
}

//upload Breakdown
export const uploadBreakdown = (exercise_id, breakdown) => {
    return (dispatch) => {
        var mask = 0;
        if(exercise_id == 0){
            mask = 1;
        }
        if(!mask && breakdown){
            for(var i = 0; i < breakdown.length; i++){
                const b = breakdown[i];
                if(!b.content || !b.kpid ){
                    mask = 3;
                    break;
                }
            }
        }
        if(!mask){
            var url = target + "/klmanager/updateBreakdown";
            return NetUtil.post(url, {exercise_id: exercise_id, breakdown: breakdown}, result => {
                alert("更新题目成功！");
                //dispatch(uploadExerciseSuccess());
            }, errors => {
                console.log(errors);
            });
        }else{
            if(mask == 1)
                alert("请先保存题目！");
            else alert("知识分解未填写完整");
        }
    }
}

export const updateMenu = (menu_state) => {
    return{
        type: 'UPDATE_MENU',
        menu_state
    }
}

//upload Exercise
export const uploadExercise = () => {
    return (dispatch, getState) => {
        var {course_id, exercise_id, title, title_img_url, title_audio_url, exercise_rating, exercise_type, blankAnswer, choiceAnswer, choiceImgAnswer, breakdown} = getState().exerciseData.toJS();
        var mask = 0;
        var answer;
        if(!title || !exercise_rating){
            mask = 1;
        }
        console.log(mask);
        switch(exercise_type){
            case 0:
                if(!mask && blankAnswer){
                    for(var i = 0; i < blankAnswer.length; i++){
                        if(!blankAnswer[i].value){
                            mask = 2;
                            break;
                        }
                    }
                    answer = blankAnswer;
                }
                break;
            case 1:
                if(!mask && choiceAnswer){
                    for(var i = 0; i < choiceAnswer.length; i++){
                        if(!choiceAnswer[i].value){
                            mask = 2;
                            break;
                        }
                    }
                    answer = choiceAnswer;
                }
                break;
            case 2:
                if(!mask && choiceImgAnswer){
                    for(var i = 0; i < choiceImgAnswer.length; i++){
                        if(!choiceImgAnswer[i].url){
                            mask = 2;
                            break;
                        }
                    }
                    console.log("choiceImgAnswer");
                    answer = choiceImgAnswer;
                }
                break;
            default: 
                break;
        }

        if(!mask && breakdown){
            for(var i = 0; i < breakdown.length; i++){
                const b = breakdown[i];
                if(!b.content || !b.kpid){
                    mask = 3;
                    break;
                }
            }
        }
        if(!mask){
            dispatch(uploadExerciseStart());
            if(exercise_id > 0){
                //修改题目
                var url = target + "/klmanager/updateExercise";
                var exercise = {exercise_id: exercise_id, title: title, title_img_url: title_img_url, title_audio_url: title_audio_url, answer: answer, exercise_type: exercise_type, exercise_rating: exercise_rating, breakdown: breakdown};
                return NetUtil.post(url, {exercise: exercise}, result => {
                    dispatch(uploadExerciseSuccess(result.exercise_id));
                    alert("更新题目成功！");
                }, errors => {
                    console.log(errors);
                });
            }else{
                //新增题目
                var url = target + "/klmanager/addExercise";
                var exercise = {title: title, title_img_url: title_img_url, title_audio_url: title_audio_url, answer: answer, exercise_type: exercise_type, exercise_rating: exercise_rating, breakdown: breakdown};
                return NetUtil.post(url, {exercise: exercise, course_id: course_id}, result => {
                    dispatch(uploadExerciseSuccess(result.exercise_id));
                    alert("上传题目成功，题目id为" + result.exercise_id);
                }, errors => {
                    console.log(errors);
                });
            }
        }
        else{
            switch(mask){
                case 1: 
                    alert("题干信息未填写完整");
                    break;
                case 2:
                    alert("答案信息未填写完整");
                    break;
                case 3:
                    alert("知识分解未填写完整");
                    break;
            }
        }
    }
}

