import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly baseUrl = 'https://res.cloudinary.com/djzn9f9kc/image/upload';

  readonly local = {
    favicon: '/assets/logo.svg',
    tourVideo: '/assets/tour-video.mp4'
  }

  readonly images = {
    background: this.generateImageUrl('v1744292048/pim-images/image1_rlpbxb.webp'),
    lydia: this.generateImageUrl('v1742987718/pim-images/Lydia_o0fwbi.webp'),
    introSlider: this.generateImageUrl('v1743950817/pim-images/intro-slider-image_swzpyc.webp')
  };

  readonly svg = {
    orangeLogo: this.generateSvgUrl('v1744199262/pim-images/pim-logo-orange_tjqv88.svg'),
    purpleLogo: this.generateSvgUrl('v1744733899/pim-images/pim-logo-purple_zonwit.svg'),
    greenLogo: this.generateSvgUrl('v1744733907/pim-images/pim-logo-green_cgcztj.svg'),
    starFlower: this.generateSvgUrl('v1743950515/pim-images/star-flower_zdpozp.svg'),
    triangle: this.generateSvgUrl('v1743950491/pim-images/triangle-child_ffwtzt.svg'),
    shapes: this.generateSvgUrl('v1744294373/pim-images/icon-shapes_x3tykr.svg'),
    together: this.generateSvgUrl('v1744294373/pim-images/together_d4gwhr.svg'),
    logoInline: this.generateSvgUrl('v1744199869/pim-images/pim-logo-inline_t5wsdx.svg'),
    curvedLoopLine: this.generateSvgUrl('v1744225058/pim-images/curved-loop-line_kxouyv.svg'),
    purpleDobleCircle: this.generateSvgUrl('v1743950571/pim-images/purple-doble-circle_g3wy3u.svg'),
    purpleStar: this.generateSvgUrl('v1743950532/pim-images/purple-star_zjfrf4.svg'),
    flowerMom: this.generateSvgUrl('v1743950601/pim-images/flower-mom_zv1m0o.svg'),
    purpleHeart: this.generateSvgUrl('v1743950549/pim-images/purple-heart_hcikp2.svg'),
    iconTriangle: this.generateSvgUrl('v1744294371/pim-images/icon-triangle_ggdxxr.svg'),
    circleStar: this.generateSvgUrl('v1743950619/pim-images/star-circle_oa3bpf.svg'),
    purpleCircle: this.generateSvgUrl('v1744405647/pim-images/purple-circle_dzyomw.svg'),
    greenCircle: this.generateSvgUrl('v1744405647/pim-images/green-circle_jkghpo.svg'),
    orangeSquare: this.generateSvgUrl('v1744405647/pim-images/orange-square_mdknip.svg'),
    purpleStar2: this.generateSvgUrl('v1744405733/pim-images/purple-star2_qchrxu.svg')
  };

  private generateImageUrl(url: string): string {
    return `${this.baseUrl}/q_auto,f_webp/${url}`;
  }

  private generateSvgUrl(url: string): string {
    return `${this.baseUrl}/${url}`;
  }
}
