import OrderSuccessView from "@/components/OrderSuccessView";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <OrderSuccessView
      paymentId={params.payment_id}
      orderId={params.order_id}
    />
  );
}
