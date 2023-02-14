export function cashFormat(cash, currency = "SGD") {
  if (cash) {
    switch (currency) {
      case "MYR":
        return `RM ${cash.toFixed(2)}`;
      default:
        return `$${cash.toFixed(2)}`;
    }
  } else {
    return "$0.00";
  }
};

export function ratingStar(reviews) {
  if(reviews?.length>0){
    return (
      reviews?.reduce(
        (previousValue, currentValue) => previousValue + currentValue?.score,
        0
      ) / reviews?.length
    );
  }
  else {
    return 0
  }
};

export function nameFormat(model, newline = false) {
  let name = `${model.firstname && `${model.firstname} `}${model.lastname || ""}`;
  if (newline === true) {
    name = `${name}\n`;
  }
  return name || "-";
};

export function quantityFormat(qty = 0) {
  if (qty) {
    return `${qty} pcs`;
  }
  return "-";
};

export function postalCodeFormat(model) {
  if (model?.currency === "MYR") {
    return `${model?.account?.postal_code}\nMalaysia`;
  } else {
    return `Singapore ${model?.account?.postal_code}`;
  }
}