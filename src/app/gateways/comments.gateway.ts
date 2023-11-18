import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddCommentModel } from '../models/comments/addCommentModel';
import { CommentModel } from '../models/comments/comment';
import { GetCommentsModel } from '../models/comments/getCommentsModel';
import { UpdateCommentModel } from '../models/comments/updateCommentModel';

@Injectable({
  providedIn: 'root'
})
export class CommentsGateway {

  private baseUrl = `${environment.apiBaseUrl}Comments`;

  constructor(private http: HttpClient) { }

  getComments(getCommentsModel: GetCommentsModel): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(this.baseUrl, { params: { ...getCommentsModel } });
  }

  addComment(addCommentModel: AddCommentModel): Observable<CommentModel> {
    return this.http.post<CommentModel>(this.baseUrl, addCommentModel);
  }

  updateComment(updateCommentModel: UpdateCommentModel){
    return this.http.put(this.baseUrl, updateCommentModel);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${commentId}`);
  }
}
