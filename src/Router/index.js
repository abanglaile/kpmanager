import React from 'react';
import ExerciseEditBreakdown from '../Component/exercise-breakdown.js';
import ExerciseEditSample from '../Component/exercise-sample.js';
import ExerciseMain from '../Component/exercise-main.js';
import ExerciseEditView from '../Component/exercise-edit.js';
import ExercisesView from '../Component/exercisesView.js';
import ImageManager from '../Component/image-manager.js';
import { Route, IndexRoute } from 'react-router';

export default (

 	<Route path="/">
		<Route path="kpmanager" component={ExerciseEditView}>
			<Route path="main/:exercise_id" component={ExerciseMain} />
			<Route path="breakdown/:exercise_id" component={ExerciseEditBreakdown} />
			<Route path="sample/:exercise_id" component={ExerciseEditSample} />
			<Route path="exerciseViewByKp" component={ExercisesView} />
			<Route path="image_manager" component={ImageManager} />
    	</Route>
    	
    </Route>
);