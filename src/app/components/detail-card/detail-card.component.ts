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
  @Input() isContinue: boolean;
  @Output() detailClose = new EventEmitter();
  @Output() toggleMyList = new EventEmitter();

  imageRotatorImage: object;
  running_time: number;
  continue_time: number;
  tabState: string;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.imageRotatorImage = {
      'background-image': 'url()',
      'z-index': 2,
      opacity: 1,
      'transition-duration': '750ms',
    };
    this.tabState = 'content';
  }

  ngOnChanges() {
    // console.log("detail", this.moviesDetail);
    if (this.moviesDetail) {
      // console.log('detail', this.moviesDetail);
      this.running_time = Math.floor(this.moviesDetail.total_minute);
      this.continue_time = Math.floor(this.moviesDetail.paused_minute);
    }
  }

  detailClosed() {
    this.isOpen = false;
    this.detailClose.emit();
  }

  likeMovie(id: number) {
    this.movieService.likeMovie(id).subscribe(({ response }) => {
      this.moviesDetail.like = response ? 1 : 0;
    });
    this.ngOnInit();
  }

  dislikeMovie(id: number) {
    this.movieService.dislikeMovie(id).subscribe(({ response }) => {
      this.moviesDetail.like = response ? 2 : 0;
    });
    this.ngOnInit();
  }

  myList(movie: MovieDetail) {
    this.movieService.myList(movie.id).subscribe(({ marked }) => {
      movie.marked = marked;
      this.toggleMyList.emit();
    });
    this.ngOnInit();
  }
}
