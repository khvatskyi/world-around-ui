import { environment } from "src/environments/environment";
import { UriUtility } from "./uri.utility";

export class ImageUtility {

  static readonly noUserImage: string = 'assets/images/userPlaceholder.png';

  static convertImagePathToUrl(imagePath: string) {
    if(!imagePath || imagePath.length === 0) {
      return null;
    }

    return UriUtility.createUri(environment.cloudStorageUrl,'images', encodeURI(imagePath));
  }
}
