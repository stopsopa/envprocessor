const stringToRegex = (function () {
  /**
   * @param {string} msg
   * @returns {Error}
   */
  function th(msg) {
    return new Error("stringToRegex error: " + msg);
  }

  /**
   * @param {string} v
   */
  return (v) => {
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
