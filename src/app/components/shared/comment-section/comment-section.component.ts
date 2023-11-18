import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommentsGateway } from 'src/app/gateways/comments.gateway';
import { AddCommentModel } from 'src/app/models/comments/addCommentModel';
import { CommentModel } from 'src/app/models/comments/comment';
import { GetCommentsModel } from 'src/app/models/comments/getCommentsModel';
import { TargetType } from 'src/app/models/comments/targetType';
import { UpdateCommentModel } from 'src/app/models/comments/updateCommentModel';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { environment } from 'src/environments/environment';
import { DeleteCommentPopupComponent } from './delete-comment-popup/delete-comment-popup.component';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {

  @Input() targetId: number = 0;
  @Input() targetType: TargetType = TargetType.Trip;
  comments: CommentModel[] = [];
  replies: any = {};
  replyTexts: any = {};
  edits: any = {};

  userId: number;

  commentText: string = '';

  constructor(
    private readonly commentsGateway: CommentsGateway,
    private readonly authorizationService: AuthorizationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.commentsGateway.getComments(new GetCommentsModel(this.targetId, this.targetType)).subscribe(x => {
      this.comments = x;

      x.forEach(element => {
        this.replies[element.id] = false;
        this.replyTexts[element.id] = '';

        this.edits[element.id] = { active: false, text: element.text };
        element.childComments.forEach(childComment => {
          this.edits[childComment.id] = { active: false, text: childComment.text };
        })
        
      });
    })
    this.userId = this.authorizationService.getUserId();
  }

  getBackgroundImage(imagePath: string): string {
    if(imagePath) {
      return `url(${environment.cloudStorageUrl + 'images/' + imagePath})`;
    }
    
    return 'url("/assets/images/userPlaceholder.png")';
  }

  getDate(dateString: string): string {
    return dateString;
  }

  createComment(parentCommentId = null): void {

    const commentText = parentCommentId ? this.replyTexts[parentCommentId] : this.commentText;

    this.commentsGateway.addComment(new AddCommentModel(commentText, this.userId, this.targetId, this.targetType, parentCommentId)).subscribe(data => {

      if (parentCommentId) {
        const parent = this.comments.find(x => x.id === parentCommentId);
        parent.childComments.push(data);
        this.showReply(parentCommentId);
        this.replyTexts[parentCommentId] = '';
      } else {
        this.comments.unshift(data);
        this.commentText = '';
      }
      this.edits[data.id] = {active:false, text:data.text};
    })
  }

  showReply(commentId: number): void {
    this.replies[commentId] = !this.replies[commentId];
  }

  showUpdate(commentId: number): void {
    this.edits[commentId].active = !this.edits[commentId].active

    if(!this.edits[commentId].active) {
      this.edits[commentId].text = this.findCommentText(commentId);
    }
  }

  updateComment(commentId: number) {
    const text = this.edits[commentId].text;
    this.commentsGateway.updateComment(new UpdateCommentModel(commentId, text)).subscribe(()=> {

      this.comments.forEach(x=> {
        if(x.id === commentId){
          x.text = text;
          this.showUpdate(commentId);
          return;
        }

        x.childComments.forEach(y=> {
          if(y.id === commentId) {
            y.text = text;
            this.showUpdate(commentId);
            return;
          }
        })
      })
    })
  }

  deleteComment(commentId: number, parentCommentId: number = null): void {

    const dialogRef = this.dialog.open(DeleteCommentPopupComponent, {
      width: '450px',
      data: commentId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (parentCommentId) {
          const parent = this.comments.find(x => x.id === parentCommentId);
          parent.childComments = parent.childComments.filter(x => x.id !== commentId);
        } else {
          this.comments = this.comments.filter(x => x.id !== commentId)
        }
      }
    });

    // this.commentsGateway.deleteComment(commentId).subscribe(() => {
    //   if (parentCommentId) {
    //     const parent = this.comments.find(x => x.id === parentCommentId);
    //     parent.childComments = parent.childComments.filter(x => x.id !== commentId);
    //   } else {
    //     this.comments = this.comments.filter(x => x.id !== commentId)
    //   }
    // });
  }

  private findCommentText(commentId: number): string {
    let text = '';
    this.comments.forEach(x=> {
      if(x.id===commentId){
        text= x.text;
      }

      x.childComments.forEach(y=> {
        if(y.id === commentId) {
          text = y.text;
        }
      })
    });

    return text;
  }
}
