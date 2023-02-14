export const WorkSheetCell = {
  IMAGE: "Image",
  PRODUCT_CODE: "Product Code",
  TOTOAL_QTY: "Total Qty",
  CUSTOMER: "Customer",
  ORDER_ID: "Order ID",
  BARCODE: "Barcode",
  QUANTITY: "Quantity",
  PACKAGE_WEIGHT: "Order Package Weight (g)",
  DELIVERY_ADDRESS: "Delivery Address",
  POSTAL_CODE: "Postal Code",
  TRACKING_ID: "Tracking ID",
  ITEM_COUNT: "Item Count",
};

export const PickWorkSheetHeader = [
  WorkSheetCell.IMAGE,
  WorkSheetCell.PRODUCT_CODE,
  WorkSheetCell.BARCODE,
  WorkSheetCell.TOTOAL_QTY,
];
export const PackWorkSheetHeader = [
  WorkSheetCell.CUSTOMER,
  WorkSheetCell.ORDER_ID,
  WorkSheetCell.PRODUCT_CODE,
  WorkSheetCell.BARCODE,
  WorkSheetCell.QUANTITY,
  WorkSheetCell.PACKAGE_WEIGHT,
  WorkSheetCell.DELIVERY_ADDRESS,
  WorkSheetCell.POSTAL_CODE,
];
export const OrderWorkSheetHeader = [
  WorkSheetCell.ORDER_ID,
  WorkSheetCell.ITEM_COUNT,
  WorkSheetCell.DELIVERY_ADDRESS,
  WorkSheetCell.POSTAL_CODE,
  WorkSheetCell.TRACKING_ID,
];

export const WorkSheetNames = {
  PICKING_LIST: "Picking List",
  PACKING_LIST: "Packing List",
  ORDER_LIST: "Order List",
};