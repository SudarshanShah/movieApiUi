import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MovieService} from "../services/movie.service";
import {MovieDto} from "../types/movie.type";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-delete-movie',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './delete-movie.component.html',
  styleUrl: './delete-movie.component.css'
})
export class DeleteMovieComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {movie: MovieDto},
    private dialogRef: MatDialogRef<DeleteMovieComponent>,
    private authService: AuthService,
    private movieService: MovieService,
  ) {
  }

  delete() {
    if(this.authService.isAuthenticated()) {
      this.movieService.deleteMovie(this.data.movie.movieId!).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
          this.dialogRef.close(false);
        },
        complete: () => {
          this.dialogRef.close(true);
        }
      })
    }

  }

  cancel() {
    this.dialogRef.close();
  }
}
