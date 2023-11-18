import { TargetType } from "./targetType";

export class GetCommentsModel {
    constructor(
        public targetId: number,
        public targetType: TargetType
    ) { }
}