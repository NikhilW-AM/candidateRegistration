import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidate } from './Interfaces/candidate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  getAllUser() :Observable<Candidate[]>{
    return this._http.get<Candidate[]>('http://localhost:8080/api')
  }

  postData(userObj: Candidate):Observable<Candidate>{
    return this._http.post<Candidate>('http://localhost:8080/api/register',userObj)
  }

  getSpecificPost(postId: string):Observable<Candidate> {
    return this._http.get<Candidate>(`http://localhost:8080/api/${postId}`)
  }

  deleteSpecificPost(postId: string) {
    return this._http.delete<any>(`http://localhost:8080/api/${postId}`)
  }

  updateSpecificPost(postId: string, userObj: Candidate) {
    return this._http.patch(`http://localhost:8080/api/update/${postId}`,userObj)
  }
}
