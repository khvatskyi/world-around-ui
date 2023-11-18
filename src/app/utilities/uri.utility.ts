export class UriUtility {

  static createUri(baseUrl: string, ...paths: string[]): string {

    let uri: string = this.removeRedundantSlashes(baseUrl);

    paths.forEach((path, index) => {

      if (index === paths.length - 1) {
        path = this.removeStartSlashes(path);

        uri += path;

        return;
      }

      uri += this.removeRedundantSlashes(path);
    });

    return uri;
  }

  private static removeRedundantSlashes(text: string): string {

    text = this.removeStartSlashes(text);
    text = this.removeEndSlashes(text);

    if (text.length !== 0) {
      text += '/';
    }

    return text;
  }

  private static removeStartSlashes(text: string): string {

    while (text.length !== 0 && (text.startsWith('\\') || text.startsWith('/'))) {
      text = text.slice(1);
    }

    return text;
  }

  private static removeEndSlashes(text: string): string {

    while (text.length !== 0 && (text.endsWith('\\') || text.endsWith('/'))) {
      text = text.slice(0, -1);
    }

    return text;
  }
}
