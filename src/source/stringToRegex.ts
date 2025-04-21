const stringToRegex = (function () {
  function th(msg: string): Error {
    return new Error("stringToRegex error: " + msg);
  }

  /**
   * @throws {Error} if input splits into more than 2 segments
   * @throws {Error} if the string is not a valid regex
   */
  return (v: string): RegExp => {
    try {
      const vv = v.match(/(\\.|[^/])+/g);

      if (!vv || vv.length > 2) {
        throw new Error(`param '${v}' should split to one or two segments`);
      }

      return new RegExp(vv[0], vv[1]);
    } catch (e) {
      throw th(`general error: string '${v}' error: ${e}`);
    }
  };
})();

export default stringToRegex;
