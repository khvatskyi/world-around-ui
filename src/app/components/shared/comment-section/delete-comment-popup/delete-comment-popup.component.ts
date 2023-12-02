import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { CommentsGateway } from 'src/app/gateways/comments.gateway';;

@Component({
  selector: 'app-delete-comment-popup',
  templateUrl: './delete-comment-popup.component.html',
  styleUrls: ['./delete-comment-popup.component.scss']
})
export class DeleteCommentPopupComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteCommentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly commentId: number,
    private readonly commentsGateway: CommentsGateway) { }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  deleteComment() {
    this.commentsGateway.deleteComment(this.commentId).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.dialogRef.close(true);
    })
  }
}
