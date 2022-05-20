import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { exprience } from '../Interfaces/exprience';
import { HttpService } from '../http.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css'],
})
export class AddCandidateComponent implements OnInit {
  constructor(private _fb: FormBuilder, private _router: Router,private _httpService: HttpService,private _toastrService: ToastrService) {}
  addCandidateForm!: FormGroup;
  skillsArray: string[] = [
    'Angular',
    'React',
    'Node.JS',
    'JavaScript',
    'Flutter',
    'java',
  ];
  optionArray: exprience[] = [
    { companyName: '', Duration: '', responsibilities: '' },
    { companyName: '', Duration: '', responsibilities: '' },
  ];

  ngOnInit(): void {
    //Creating form
    this.addCandidateForm = this._fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pin: ['', Validators.required],
      skills: this._fb.array(
        [],
        [Validators.required, Validators.minLength(3)]
      ),
      exprience: this._fb.array(
        this.optionArray.map((contact: any) => this.createContact(contact))
      ),
    });
  }
  createContact(contact: exprience): FormGroup {
    return this._fb.group({
      companyName: [contact.companyName, Validators.required],
      Duration: [contact.Duration, Validators.required],
      responsibilities: [contact.responsibilities, Validators.required],
    });
  }

  quantities(): FormArray {
    return this.addCandidateForm.get('exprience') as FormArray;
  }

  newQuantity(): FormGroup {
    return this._fb.group({
      companyName: ['', Validators.required],
      Duration: ['', Validators.required],
      responsibilities: ['', Validators.required],
    });
  }

  addQuantity() {
    if (this.quantities().length < 5)
      this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    if (this.quantities().length > 2) {
      this.quantities().removeAt(i);
    }
  }

  selectSkill(e: any) {
    const formArray = this.addCandidateForm.get('skills') as FormArray;
    if (!e.target.checked) {
      var i = formArray.controls.findIndex((x) => x === e.target.value);
      formArray.removeAt(i);
    } else {
      formArray.push(new FormControl(e.target.value));
    }
  }

  submit() {
    this._httpService.postData(this.addCandidateForm.value).subscribe(res => {
      console.log(res)
      if (res)
      this._toastrService.success('User added successfully!');
      this._router.navigate(['/list']);
    }, (error) => {
      console.log(error)
    })
  }
}
