import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { MoviePreview } from 'src/app/models/movie-preview';
import { SubUser } from 'src/app/models/sub-user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css'],
})
export class MyListComponent implements OnInit {
  myLists: MoviePreview[];
  sliderNums: number;
  _sliderLines: MoviePreview[][];
  openedCategory: string;
  subUser: SubUser;
  navigationSubscription;

  constructor(
    private movieService: MovieService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.subUser = this.authService.subUser;
    this.getMyListMovies();
  }

  get sliderLines() {
    if (this.subUser && this.subUser.id !== this.authService.subUser.id) {
      this.getMyListMovies();
      this.subUser = this.authService.subUser;
    }
    return this._sliderLines;
  }

  getMyListMovies() {
    this.movieService.getMyListMovies().subscribe(movies => {
      this.myLists = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.name,
          url: movie['horizontal_image_path'],
          preview: movie['sample_video_file'],
        };
      });
      this.parseMyList();
    });
  }

  parseMyList() {
    this.sliderNums = Math.ceil(this.myLists.length / 6);
    this._sliderLines = Array.from(Array(this.sliderNums), () => Array());
    for (let i = 0; i < this.sliderNums; i++) {
      this._sliderLines[i] = this.myLists.slice(i * 6, (i + 1) * 6);
    }
  }

  sliderOpened(category: string) {
    const thanos = document.querySelector('.thanos');

    this.openedCategory = category;
    thanos.classList.add('has-open-jaw');
  }

  sliderClosed(category: string) {
    const thanos = document.querySelector('.thanos');

    this.openedCategory =
      this.openedCategory === category ? '' : this.openedCategory;

    thanos.classList.remove('has-open-jaw');
  }
}
