import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { MovieDetail } from 'src/app/models/movies-detail';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.css'],
})
export class DetailCardComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean;
  @Input() moviesDetail: MovieDetail;
  @Output() detailClose = new EventEmitter();
  @Output() toggleMyList = new EventEmitter();

  imageRotatorImage: object;
  tabState: string;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    // this.imageRotatorImage = {
    //   'background-image':
    //     'url(https://occ-0-3451-1009.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8…hfsWSXP71AbW-Y4zu5qBVu85QO95uibYFSlZitqSIzn88HjzNybPhBpc6Y68e9w.webp?r=c9b)',
    //   'z-index': 2,
    //   opacity: 1,
    //   'transition-duration': '750ms',
    // };
    this.imageRotatorImage = {
      'background-image': 'url()',
      'z-index': 2,
      opacity: 1,
      'transition-duration': '750ms',
    };
    this.tabState = 'content';
  }

  ngOnChanges() {
    // console.log('detail', this.moviesDetail);
  }

  detailClosed() {
    this.isOpen = false;
    this.detailClose.emit();
  }

  likeMovie(id: number) {
    // console.log(id);

    this.movieService.likeMovie(id).subscribe(({ response }) => {
      console.log('liked response', response);
      this.moviesDetail.like = response ? 1 : 0;
      console.log('after like', this.moviesDetail.like);

      // this.hoverMoviesDetail(id);
      // this.movieGood = response;
    });

    // if (this.movieGood) {
    //   this.movieGood = false;
    // } else {
    //   this.movieGood = true;
    // }
    // this.movieBad = false;
  }

  dislikeMovie(id: number) {
    // console.log(id);

    this.movieService.dislikeMovie(id).subscribe(({ response }) => {
      console.log('disliked response', response);
      this.moviesDetail.like = response ? 2 : 0;
      console.log('after dislike', this.moviesDetail.like);

      // this.hoverMoviesDetail(id);
      // this.movieBad = response;
    });
  }

  myList(movie: MovieDetail) {
    this.movieService.myList(movie.id).subscribe(({ marked }) => {
      console.log('myList', movie.id, marked);
      movie.marked = marked;
      this.toggleMyList.emit();
    });
  }
}
