import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { Candidate } from '../Interfaces/candidate'
import { exprience } from '../Interfaces/exprience'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  detailsArray: Candidate[] = [];
  constructor(private _rout: Router, private _httpService:HttpService,private _toastrService: ToastrService) {}

  ngOnInit(): void {
    this._httpService.getAllUser().subscribe((data:Candidate[]) => {
      this.detailsArray = data
      console.log(this.detailsArray);
    })
  }

  totalExperience(exprience: any): number {
    console.log(exprience);

    return exprience.map((item:any)=> parseInt(item.Duration)).reduce((prev:number,next:number)=>prev+next)
  }

  editDetails(user:Candidate) {
    this._rout.navigate(['/edit', user._id]);
  }
  deleteDetails(user: Candidate) {
     if(user._id)
       this._httpService.deleteSpecificPost(user._id).subscribe(res => {
         if (res.data) {
           this._toastrService.success('User deleted successfully!');
           this.detailsArray = res.data
         }

    },(err) => console.log(err));
  }
}
