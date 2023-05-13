import { getGuid } from "../../../_helpers";

export class Alert {
    id: string;
    type: string;
    message: string;
    constructor(message: string, type: string) {
        this.message = message;
        this.type = type;
        this.id = getGuid();
    }
}
