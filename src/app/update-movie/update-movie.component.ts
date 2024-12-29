import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MovieDto} from "../types/movie.type";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {MovieService} from "../services/movie.service";

@Component({
  selector: 'app-update-movie',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.css'
})
export class UpdateMovieComponent {

  movieId = this.data.movie.movieId!;
  poster = this.data.movie.poster!;

  title = new FormControl<string>(this.data.movie.title, Validators.required);
  director = new FormControl<string>(this.data.movie.director, Validators.required);
  studio = new FormControl<string>(this.data.movie.studio, [Validators.required]);
  movieCast = new FormControl<string>(this.data.movie.movieCast.join(", "), [Validators.required]);
  releaseYear = new FormControl<string>(this.data.movie.releaseYear.toString(), [Validators.required]);

  selectedFile: File | null = null;

  updateMovieForm: FormGroup;

  inlineNotification = {
    show: false,
    type: '',
    text: '',
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {movie: MovieDto},
    public dialogRef: MatDialogRef<UpdateMovieComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private movieService: MovieService,
  ) {
    this.updateMovieForm = this.formBuilder.group({
      title: this.title,
      director: this.director,
      studio: this.studio,
      movieCast: this.movieCast,
      releaseYear: this.releaseYear,
      poster: [null],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.updateMovieForm.patchValue({file: this.selectedFile});
  }

  updateMovie() {
    if(this.authService.isAuthenticated() && this.updateMovieForm.valid) {
      let movieCast = this.updateMovieForm.get("movieCast")?.value as string;
      const mvc = movieCast.split(",").map(e => e.trim()).filter(e => e.length > 0);

      const movieDto: MovieDto = {
        title: this.updateMovieForm.get("title")?.value,
        director: this.updateMovieForm.get("director")?.value,
        studio: this.updateMovieForm.get("studio")?.value,
        movieCast: mvc,
        releaseYear: this.updateMovieForm.get("releaseYear")?.value,
        poster: this.selectedFile ? this.updateMovieForm.get("poster")?.value : null,
      }

      console.log("final movie data = ", movieDto);
      console.log("final file = ", this.selectedFile);

      this.movieService.updateMovie(this.movieId, movieDto, this.selectedFile).subscribe({
        next: response => {
          console.log("movie data = ", response);
        },
        error: err => {
          console.log(err);
          this.dialogRef.close(false);
        },
        complete: () => {
          this.dialogRef.close(true);
        }
      })

    } else {
      console.log("form not valid ", this.updateMovieForm.valid);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
