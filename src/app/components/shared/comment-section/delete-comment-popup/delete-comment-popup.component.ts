import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentsGateway } from 'src/app/gateways/comments.gateway';;

@Component({
  selector: 'app-delete-comment-popup',
  templateUrl: './delete-comment-popup.component.html',
  styleUrls: ['./delete-comment-popup.component.scss']
})
export class DeleteCommentPopupComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteCommentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly commentId: number,
    private readonly commentsGateway: CommentsGateway) { }

  cancel() {
    this.dialogRef.close(false);
  }

  deleteComment() {
    this.commentsGateway.deleteComment(this.commentId).subscribe(() => {
      this.dialogRef.close(true);
    })
  }
}
