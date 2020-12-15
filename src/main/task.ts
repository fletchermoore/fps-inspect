import { BehaviorSubject } from "rxjs";
import { TaskState} from '../common/constants';
//import { BehaviorSubject } from 'rxjs';



export interface Task {
    status: BehaviorSubject<TaskState>;
    start(): void;
    cancel(): void;
}

