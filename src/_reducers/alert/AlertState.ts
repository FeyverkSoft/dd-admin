import { Alert } from '../../_services/entity';

export class AlertState {
    messages: Alert[];
    constructor(arr: Alert[] = new Array<Alert>()) {
        this.messages = arr;
    }
}