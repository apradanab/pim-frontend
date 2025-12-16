import { Injectable, inject } from '@angular/core';
import { MediaService } from './media.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly mediaService = inject(MediaService);

  readonly local = {
    favicon: '/assets/logo.svg',
  };

  readonly videos = {
    tourVideo: this.mediaService.getImageUrl('static/tour-video.mp4')
  };

  readonly images = {
    backgroundAdvices: this.mediaService.getImageUrl('static/background-advices.webp'),
    introSlider: this.mediaService.getImageUrl('static/intro-slider-image.webp'),
    lydia: this.mediaService.getImageUrl('static/Lydia.webp'),
  }

  readonly icons = {
    favicon: this.mediaService.getImageUrl('static/pim-logo.svg'),
    orangeLogo: this.mediaService.getImageUrl('static/pim-logo-orange.svg'),
    purpleLogo: this.mediaService.getImageUrl('static/pim-logo-purple.svg'),
    greenLogo: this.mediaService.getImageUrl('static/pim-logo-green.svg'),
    starFlower: this.mediaService.getImageUrl('static/star-flower.svg'),
    triangle: this.mediaService.getImageUrl('static/triangle-child.svg'),
    shapes: this.mediaService.getImageUrl('static/icon-shapes.svg'),
    together: this.mediaService.getImageUrl('static/together.svg'),
    logoInline: this.mediaService.getImageUrl('static/pim-logo-inline.svg'),
    curvedLoopLine: this.mediaService.getImageUrl('static/curved-loop-line.svg'),
    purpleDoubleCircle: this.mediaService.getImageUrl('static/purple-doble-circle.svg'),
    purpleStar: this.mediaService.getImageUrl('static/purple-star.svg'),
    flowerMom: this.mediaService.getImageUrl('static/flower-mom.svg'),
    purpleHeart: this.mediaService.getImageUrl('static/purple-heart.svg'),
    iconTriangle: this.mediaService.getImageUrl('static/icon-triangle.svg'),
    happyTriangle: this.mediaService.getImageUrl('static/happy-triangle.svg'),
    jumpingTriangle: this.mediaService.getImageUrl('static/jumping-triangle.svg'),
    walkingChat: this.mediaService.getImageUrl('static/walking-chat.svg'),
    circleStar: this.mediaService.getImageUrl('static/star-circle.svg'),
    purpleCircle: this.mediaService.getImageUrl('static/purple-circle.svg'),
    purpleStar2: this.mediaService.getImageUrl('static/purple-star2.svg'),
    orangeSquare: this.mediaService.getImageUrl('static/orange-square.svg'),
    greenCircle: this.mediaService.getImageUrl('static/green-circle.svg'),
  }
}
