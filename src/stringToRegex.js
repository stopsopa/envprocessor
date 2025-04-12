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
        throw new Error(`param '${v}' splits to more than 2 segments`);
      }

      return new RegExp(vv[0], vv[1]);
    } catch (e) {
      throw th(`general error: string '${v}' error: ${e}`);
    }
  };
})();

module.exports = stringToRegex;
