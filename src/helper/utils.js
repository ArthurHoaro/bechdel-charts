class Utils {
  static range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  static getRatingLabel(rating) {
    switch (rating) {
      case 0:
        return 'Fail all tests';
      case 3:
        return 'Pass all tests';
      default:
        return `Pass ${rating} of 3 tests`;
    }
  }
}

export default Utils;
