import { TargetType } from "./targetType";

export class AddCommentModel {
    constructor(
        public text: string,
        public authorId: number,
        public targetId: number,
        public targetType: TargetType,
        public parentCommentId: number = null
    ) { }
}