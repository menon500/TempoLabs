export function getStatusBadgeColor(status: string) {
  switch (status) {
    case "confirmado":
      return "bg-green-500";
    case "cancelado":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
}

export function getPaymentStatusBadgeColor(status: string) {
  return status === "pago" ? "bg-green-500" : "bg-orange-500";
}
