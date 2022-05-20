import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { exprience } from '../Interfaces/exprience';
import { Candidate } from '../Interfaces/candidate'
import { HttpService } from '../http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  detailsArray: Candidate[] = [];
  editForm!: FormGroup;
  editUser! :Candidate
  skillsArray: string[] = [
    'Angular',
    'React',
    'Node.JS',
    'JavaScript',
    'Flutter',
    'java',
  ];
  optionArray: exprience[] = [];
  constructor(private _router: ActivatedRoute, private _fb: FormBuilder, private _rout:Router,private _httpService: HttpService,private _toastrService: ToastrService) {}
  id: string | null = '';
  ngOnInit(): void {
    this.getRoutePara();

    this.editForm = this._fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pin: ['', Validators.required],
      skills: this._fb.array([],[Validators.required,Validators.minLength(3)]),
      exprience: this._fb.array(
        this.optionArray.map((contact: any) => this.createContact(contact))
      ),
    });
    //this.setValue();
  }

  createContact(contact: exprience): FormGroup {
    return this._fb.group({
      companyName: [contact.companyName, Validators.required],
      Duration: [contact.Duration, Validators.required],
      responsibilities: [contact.responsibilities, Validators.required],
    });
  }

  quantities(): FormArray {
    return this.editForm.get('exprience') as FormArray;
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
  getRoutePara() {
    this.id = this._router.snapshot.paramMap.get('id');
    if (this.id) {
      this._httpService.getSpecificPost(this.id).subscribe((user: Candidate) => {
        this.editUser = user;
        console.log(this.editUser)
        this.setValue()
      })
    }
  }

  setValue() {
    this.editForm.controls['firstname'].setValue(this.editUser.firstname);
    this.editForm.controls['lastname'].setValue(this.editUser.lastname);
    this.editForm.controls['gender'].setValue(this.editUser.gender);
    this.editForm.controls['email'].setValue(this.editUser.email);
    this.editForm.controls['address'].setValue(this.editUser.address);
    this.editForm.controls['country'].setValue(this.editUser.country);
    this.editForm.controls['state'].setValue(this.editUser.state);
    this.editForm.controls['pin'].setValue(this.editUser.pin);

    const formArray = this.editForm.get('skills') as FormArray;
    for (let i = 0; i < this.editUser.skills.length; i++) {
      formArray.push(new FormControl(this.editUser.skills[i]));
    }

    for (let i = 0; i < this.editUser?.exprience.length; i++) {
      this.addQuantity();
      ((this.editForm.controls['exprience'] as FormArray).at(i) as FormGroup)
        .get('companyName')
        ?.setValue(this.editUser.exprience[i].companyName),
        ((this.editForm.controls['exprience'] as FormArray).at(i) as FormGroup)
          .get('Duration')
          ?.setValue(this.editUser.exprience[i].Duration),
        ((this.editForm.controls['exprience'] as FormArray).at(i) as FormGroup)
          .get('responsibilities')
          ?.setValue(this.editUser.exprience[i].responsibilities);
    }
  }

  selectSkill(e: any) {
    console.log(e.target.value);

    const formArray = this.editForm.get('skills') as FormArray;
    if (!e.target.checked) {
      var i = formArray.controls.findIndex((x) => x === e.target.value);
      formArray.removeAt(i);
    } else {
      formArray.push(new FormControl(e.target.value));
    }
  }

  submit()
  {
    //console.log(this.editForm.value);
    if (this.id)
    {
      this._httpService.updateSpecificPost(this.id, this.editForm.value).subscribe(res => {
        console.log(res);
        if (res) {
          this._toastrService.success('User Update successfully!');
          this._rout.navigate(['/list'])
        }
      }, (error) => {
        console.log(error)
      })
    }
  }
}
