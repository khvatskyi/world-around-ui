export class CommentModel {
    id: number;
    createDate: string;
    text: string;
    childComments: CommentModel[];

    authorId: number;
    authorName: string;
    imagePath: string;
}