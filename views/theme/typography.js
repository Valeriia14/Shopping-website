import palette from "./palette";

export default {
  fontFamily: [
    "Barlow-Regular",
    "Barlow-Medium",
    "Barlow-Light",
    "Barlow-Bold",
    "Barlow-Black",
    "Barlow-Regular",
  ].join(","),
  h1: {
    fontFamily: "Barlow-Bold",
    fontWeight: 500,
    fontSize: "60px",
  },
  h2: {
    fontFamily: "Barlow-Bold",
    fontWeight: 500,
    fontSize: "34px",
  },
  h3: {
    fontFamily: "Barlow-Bold",
    fontWeight: 500,
    fontSize: "24px",
  },
  h4: {
    fontFamily: "Barlow-Medium",
    fontWeight: 500,
    fontSize: "20px",
  },
  h5: {
    fontFamily: "Barlow-Medium",
    fontWeight: 500,
    fontSize: "14px",
  },
  h6: {
    fontFamily: "Barlow-Medium",
    fontWeight: 500,
    fontSize: "12px",
  },
  subtitle1: {
    fontFamily: "Barlow-Black",
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: "22px",
  },
  subtitle2: {
    fontFamily: "Barlow-Black",
    color: palette.text.primary,
    fontWeight: 600,
    fontSize: "16px",
  },
  body1: {
    fontFamily: "Barlow-Medium",
    fontSize: "20px",
  },
  
  body2: {
    fontFamily: "Barlow-Regular",
    fontSize: "16px",
  },
  button: {
    fontFamily: "Barlow-Regular",
    fontSize: "18px",
  },
};
