import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { of, switchMap } from 'rxjs';
import { Category } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') input!: ElementRef
  image?: File
  imagePreview: any;
  isNew = true;
  form!: FormGroup;
  category!: any;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (category: Category | null) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInput();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  onSubmit() {
      let obs$
      this.form.disable()
      if (this.isNew) {
        obs$ = this.categoriesService.create(this.form.value.name, this.image)
      } else {
        obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
      }
  
      obs$.subscribe(
        category => {
          this.category = category;
          MaterialService.toast('Изменения сохранены')
          this.router.navigate(['/categories'])
          this.form.enable()
        },
        error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      )
  }

  onFileSelect(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  triggerClick() {
    this.input.nativeElement.click()
  }

  onDelete() {
    const decision = window.confirm('Вы уверены, что хотите удалить категорию?')
    if (decision) {
      console.log(this.category._id)
      this.categoriesService.delete(this.category._id).subscribe(
        response => MaterialService.toast('delete'),
        error => MaterialService.toast('error'),
        () => this.router.navigate(['/categories'])
      )
    }
  }
  
}
