export default (s) => {
  if (!s) return s;
  let output = s.replace(/(_\w)/g, function (m) { return " " + m[1].toUpperCase(); });
  output = output[0].toUpperCase() + output.slice(1);
  return output;
}