import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() width: string = '50px';
  @Input() height: string = '50px';
  @Input() color: string = 'black';
  @Input() hoverColor: string;
  @Input() icon: string;
  @Input() pointer: boolean = true;

  hover: boolean;

  getStyle(): any {
    const style = {
      'width': this.width,
      'height': this.height,
      'background-color': this.color
    };

    if (this.hoverColor && this.hover) {
      style['background-color'] = this.hoverColor;
    }

    if (this.icon) {
      style['mask-image'] = `url("${this.icon}")`;
      style['mask-size'] = 'cover';
      style['-webkit-mask-image'] = `url("${this.icon}")`;
      style['-webkit-mask-size'] = 'cover';

    }

    if (this.pointer) {
      style['cursor'] = 'pointer';
    }

    return style;
  }
}
