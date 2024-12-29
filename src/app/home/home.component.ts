import {Component, inject, OnInit, signal} from '@angular/core';
import {MovieDto} from "../types/movie.type";
import {MovieService} from "../services/movie.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {UpdateMovieComponent} from "../update-movie/update-movie.component";
import {DeleteMovieComponent} from "../delete-movie/delete-movie.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  isLoggedIn = signal<boolean>(false);
  movies: MovieDto[] = [];

  movieService = inject(MovieService);
  authService = inject(AuthService);
  router= inject(Router);
  matDialog = inject(MatDialog);

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedInSignal();

    if(this.isLoggedIn()){
      this.getMovies();
    }
  }

  getMovies() {
    if(this.authService.isAuthenticated()) {
      this.movieService.getMovies().subscribe({
        next: (response) => {
          this.movies = response;
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['register']);
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  update(movie: MovieDto) {
    console.log("movie id = ", movie.movieId);
    console.log("movie = ", movie);

    const dialogRef = this.matDialog.open(UpdateMovieComponent, {
      data: { movie: movie },
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.getMovies();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  delete(movie: MovieDto) {
    console.log("movie id = ", movie.movieId);
    console.log("movie = ", movie);

    const dialogRef = this.matDialog.open(DeleteMovieComponent, {
      data: { movie: movie },
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.getMovies();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
