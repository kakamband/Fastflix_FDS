import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Main } from 'src/app/models/main';
import { MovieService } from 'src/app/services/movie.service';
import { HomeCategories } from 'src/app/models/homeCategories';
import { MovieCategory } from 'src/app/models/movie-category';
import { MoviePreview } from 'src/app/models/movie-preview';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: string;
  playBillBoard: boolean;
  movies: object[];
  mainMovie: Main;
  bigMovie: Main;
  homeCatogories: MovieCategory[];
  openedCategory: string;
  myLists: MoviePreview[];

  constructor(
    private authService: AuthenticationService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.user = this.authService
      .getSubUsers()
      .find(({ id }) => id === +this.authService.getProfile()).name;

    this.playBillBoard = false;
    this.homeCatogories = HomeCategories;
    this.openedCategory = '';
    this.getMainMovie();
    this.getMyListMovies();
  }

  getMainMovie() {
    this.movieService.getHomeMain().subscribe(mainMovie => {
      this.mainMovie = {
        id: mainMovie[0]['메인 영화']['id'],
        image: mainMovie[0]['메인 영화']['big_image_path'],
        logo: mainMovie[0]['메인 영화']['logo_image_path'],
        title: mainMovie[0]['메인 영화']['name'],
        degree: mainMovie[0]['메인 영화']['degree'],
        synopsis: mainMovie[0]['메인 영화']['synopsis'],
        marked: mainMovie[0]['메인 영화']['marked'],
      };
      this.getCategoryMovies();
    });

    this.movieService.getBigMovie().subscribe(bigMovie => {
      this.bigMovie = {
        id: bigMovie['id'],
        image: bigMovie['big_image_path'],
        logo: bigMovie['logo_image_path'],
        title: bigMovie['name'],
        degree: bigMovie['degree'],
        synopsis: bigMovie['synopsis'],
        marked: bigMovie['marked'],
      };
    });
  }

  toggleMyLsit(movie: Main) {
    this.movieService.myList(movie.id).subscribe(({ marked }) => {
      this.getMyListMovies();
      movie.marked = marked;
    });
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

  getCategoryMovies() {
    this.getPopularMovies();
    this.getLatestMovies();
    this.getFollowUpMovies();
  }

  getPopularMovies() {
    const popularCategory = this.homeCatogories.find(
      ({ category }) => category === 'Fastflix 인기 콘텐츠'
    );

    this.movieService.getPopularMovies().subscribe(movies => {
      popularCategory.movies = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.name,
          url: movie['horizontal_image_path'],
          preview: movie['sample_video_file'],
        };
      });
    });
  }

  getMyListMovies() {
    const myListCategory = this.homeCatogories.find(
      ({ category }) => category === '내가 찜한 콘텐츠'
    );
    this.movieService.getMyListMovies().subscribe(movies => {
      this.myLists = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.name,
          url: movie['horizontal_image_path'],
          preview: movie['sample_video_file'],
        };
      });
      myListCategory.movies = this.myLists;
    });
  }

  getLatestMovies() {
    const latestCategory = this.homeCatogories.find(
      ({ category }) => category === '최신 등록 콘텐츠'
    );
    this.movieService.getLatestMovies().subscribe(movies => {
      latestCategory.movies = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.name,
          url: movie['horizontal_image_path'],
          preview: movie['sample_video_file'],
        };
      });
    });
  }

  getFollowUpMovies() {
    const follwUpCategory = this.homeCatogories.find(
      ({ category }) => category === '시청 중인 콘텐츠'
    );
    this.movieService.getFollowUpMovies().subscribe(
      movies => {
        console.log('시청 중', movies);

        follwUpCategory.movies = movies.map(continueMovie => {
          return {
            id: continueMovie.movie.id,
            title: continueMovie.movie.name,
            url: continueMovie.movie['horizontal_image_path'],
            preview: continueMovie.movie['sample_video_file'],
            continue: continueMovie['progress_bar'],
          };
        });
      },
      error => console.error(error)
    );
  }

  // original API 미완
  getOriginalMovies() {
    const originalCategory = this.homeCatogories.find(
      ({ category }) => category === 'Fastflix 오리지널'
    );
    // this.movieService.getFollowUpMovies().subscribe(
    //   movies => {
    //     originalCategory.movies = movies.map(movie => {
    //       return {
    //         id: movie.id,
    //         title: movie.name,
    //         url: movie['horizontal_image_path'],
    //         preview: movie['sample_video_file'],
    //       };
    //     });
    //   },
    //   error => console.error(error)
    // );
  }
}
