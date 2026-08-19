import type { Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export function InvoiceDocument({
  order,
  customerEmail,
  findProductName,
}: {
  order: Order;
  customerEmail: string;
  findProductName: (slug: string) => string;
}) {
  return (
    <div id="invoice-root" className="mx-auto max-w-2xl bg-white p-10 text-studio-ink print:p-0">
      <div className="flex items-start justify-between border-b border-studio-line pb-6">
        <div>
          <p className="font-wordmark text-2xl">
            <span className="text-accent-cyan">A</span>
            <span className="text-accent-purple">M</span>ISTRIÉ
          </p>
          <p className="mt-1 text-xs text-studio-ink/50">Precision 3D Printing Studio</p>
          <p className="text-xs text-studio-ink/50">hello@amistrie.print</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl">Invoice</p>
          <p className="mt-1 font-mono text-sm text-studio-ink/60">{order.id}</p>
          <p className="text-xs text-studio-ink/40">{new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-studio-ink/40">Billed To</p>
          <p className="mt-1 text-sm">{order.billingName || "—"}</p>
          <p className="text-xs text-studio-ink/50">{customerEmail}</p>
          {order.billingAddress && (
            <p className="mt-1 text-xs text-studio-ink/50">
              {order.billingAddress}
              {order.billingCity ? `, ${order.billingCity}` : ""}
              {order.billingPincode ? ` — ${order.billingPincode}` : ""}
            </p>
          )}
          {order.billingPhone && <p className="text-xs text-studio-ink/50">{order.billingPhone}</p>}
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-studio-ink/40">Status</p>
          <p className="mt-1 inline-block rounded-full bg-accent-cyan/10 px-3 py-1 text-xs uppercase text-accent-cyan">
            {order.status.replace("-", " ")}
          </p>
          {order.paymentStatus && (
            <p
              className={`mt-1.5 inline-block rounded-full px-3 py-1 text-xs uppercase ${
                order.paymentStatus === "paid"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : order.paymentStatus === "failed"
                    ? "bg-rose-500/10 text-rose-600"
                    : "bg-amber-500/10 text-amber-600"
              }`}
            >
              Payment {order.paymentStatus}
            </p>
          )}
          {order.trackingNumber && (
            <p className="mt-2 text-xs text-studio-ink/50">
              {order.courier ?? "Courier"}: {order.trackingUrl ? (
                <a href={order.trackingUrl} className="text-accent-cyan hover:underline" target="_blank" rel="noopener noreferrer">
                  {order.trackingNumber}
                </a>
              ) : (
                order.trackingNumber
              )}
            </p>
          )}
        </div>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-studio-line text-[11px] uppercase tracking-wider text-studio-ink/40">
            <th className="py-2">Item</th>
            <th className="py-2">Options</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((line) => (
            <tr key={line.id} className="border-b border-studio-line/60">
              <td className="py-3">{findProductName(line.productSlug)}</td>
              <td className="py-3 text-xs text-studio-ink/50">
                {Object.values(line.selectedOptions).join(" · ") || "Standard"}
              </td>
              <td className="py-3 text-center">{line.quantity}</td>
              <td className="py-3 text-right font-mono">{formatINR(line.unitPrice * line.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-56 text-sm">
          <div className="flex justify-between py-1 text-studio-ink/60">
            <span>Subtotal</span>
            <span className="font-mono">{formatINR(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between py-1 text-accent-cyan">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span className="font-mono">-{formatINR(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 text-studio-ink/60">
            <span>Shipping</span>
            <span className="font-mono">{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
          </div>
          <div className="flex justify-between py-1 text-studio-ink/60">
            <span>Tax (18% GST)</span>
            <span className="font-mono">{formatINR(order.tax)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-studio-line pt-2 text-base">
            <span>Total</span>
            <span className="font-mono">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-studio-line pt-4 text-center text-[11px] text-studio-ink/30">
        Thank you for printing with Amistrié. This invoice was generated automatically.
      </div>
    </div>
  );
}
