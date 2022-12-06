const camelToKebab = (string = "") => {
  return string.replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
};

function objToString(
  styleObj: Partial<CSSStyleDeclaration>,
  parser = camelToKebab
) {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(
      `expected an argument of type object, but got ${typeof styleObj}`
    );
  }
  const lines = Object.keys(styleObj).map(
    (property) =>
      `${parser(property)}: ${styleObj[property as keyof CSSStyleDeclaration]};`
  );
  return lines.join("\n");
}

export default objToString;
